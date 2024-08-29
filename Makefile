.PHONY: *

clean:
	-rm arthur.mobi
	-rm arthur.epub

build: clean
	-"/Applications/Kindle Previewer 3.app/Contents/lib/fc/bin//kindlegen" -c0 -gen_ff_mobi7 -dont_append_source dict.opf -o arthur.mobi

convert: build
	/Applications/calibre.app/Contents/MacOS/ebook-convert arthur.mobi arthur.epub
