local function load_names(file)
	local fh = assert(io.open(file, "r"))
	local data = fh:read("*a")
	fh:close()

	local set = {}
	for orth in data:gmatch("<idx:orth[^>]*>([%z\1-\255]-)</idx:orth>") do
		local name = orth:gsub("<[^>]+>", ""):gsub("^%s+", ""):gsub("%s+$", ""):gsub("%s+", " ")
		if name ~= "" then
			set[name] = true
		end
	end
	return set
end

local function set_size(t)
	local count = 0
	for _ in pairs(t) do
		count = count + 1
	end
	return count
end

if #arg ~= 1 then
	io.stderr:write("Usage: lua list.lua <directory>\n")
	os.exit(1)
end

local dir = arg[1]
local html_files = {}

local p = io.popen(string.format("fd -d 1 -t f -e html . %q", dir))
for fname in p:lines() do
	html_files[#html_files + 1] = fname
end
p:close()

if #html_files < 2 then
	io.stderr:write("Need at least two .html files in directory " .. dir .. "\n")
	os.exit(1)
end

local sets = {}
local sizes = {}
for _, f in ipairs(html_files) do
	sets[f] = load_names(f)
	sizes[f] = set_size(sets[f])
end

for i = 1, #html_files - 1 do
	for j = i + 1, #html_files do
		local f1, f2 = html_files[i], html_files[j]
		local s1, s2 = sets[f1], sets[f2]

		local smaller, larger = s1, s2
		if sizes[f1] > sizes[f2] then
			smaller, larger = s2, s1
		end

		local overlaps = {}
		for name in pairs(smaller) do
			if larger[name] then
				overlaps[#overlaps + 1] = name
			end
		end

		if #overlaps > 0 then
			table.sort(overlaps)
			print(string.format("Overlapping names between %s and %s (%d):", f1, f2, #overlaps))
			for _, n in ipairs(overlaps) do
				print("  " .. n)
			end
		end
	end
end
