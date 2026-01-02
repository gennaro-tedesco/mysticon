#!/usr/bin/env -S luatex --luaonly

local function parse_tabfile(filepath)
	local file = io.open(filepath, "r")
	if not file then
		return nil, "Cannot open file: " .. filepath
	end

	local entries = {}
	local line_num = 0

	for line in file:lines() do
		line_num = line_num + 1
		local tab_pos = line:find("\t")
		if tab_pos then
			local headwords_part = line:sub(1, tab_pos - 1)
			for headword in headwords_part:gmatch("[^|]+") do
				headword = headword:match("^%s*(.-)%s*$")
				if headword ~= "" then
					if not entries[headword] then
						entries[headword] = {}
					end
					table.insert(entries[headword], line_num)
				end
			end
		end
	end

	file:close()
	return entries
end

local function get_txt_files(directory)
	local files = {}
	local pfile = io.popen('find "' .. directory .. '" -maxdepth 1 -name "*.txt" -type f')
	if pfile then
		for filename in pfile:lines() do
			table.insert(files, filename)
		end
		pfile:close()
	end
	return files
end

local function find_duplicates(directory)
	local files = get_txt_files(directory)

	if #files == 0 then
		print("No .txt files found in: " .. directory)
		return
	end

	print("Scanning " .. #files .. " file(s) for duplicates...\n")

	local global_entries = {}

	for _, filepath in ipairs(files) do
		local filename = filepath:match("([^/]+)$")
		local entries, err = parse_tabfile(filepath)

		if not entries then
			print("Error: " .. err)
		else
			for headword, line_numbers in pairs(entries) do
				if not global_entries[headword] then
					global_entries[headword] = {}
				end
				table.insert(global_entries[headword], {
					file = filename,
					lines = line_numbers,
				})
			end
		end
	end

	local duplicates_found = false
	local sorted_headwords = {}
	for headword in pairs(global_entries) do
		table.insert(sorted_headwords, headword)
	end
	table.sort(sorted_headwords)

	for _, headword in ipairs(sorted_headwords) do
		local locations = global_entries[headword]

		local total_occurrences = 0
		for _, loc in ipairs(locations) do
			total_occurrences = total_occurrences + #loc.lines
		end

		local appears_in_multiple_files = #locations > 1
		local appears_multiple_times_in_same_file = false
		for _, loc in ipairs(locations) do
			if #loc.lines > 1 then
				appears_multiple_times_in_same_file = true
				break
			end
		end

		if appears_in_multiple_files or appears_multiple_times_in_same_file then
			duplicates_found = true
			print("Duplicate: " .. headword)

			for _, loc in ipairs(locations) do
				if #loc.lines > 1 then
					local lines_str = table.concat(loc.lines, ", ")
					print("  - " .. loc.file .. " (lines: " .. lines_str .. ")")
				else
					print("  - " .. loc.file .. " (line: " .. loc.lines[1] .. ")")
				end
			end
			print()
		end
	end

	if not duplicates_found then
		print("No duplicates found!")
	end
end

local directory = arg[1] or "."
find_duplicates(directory)
