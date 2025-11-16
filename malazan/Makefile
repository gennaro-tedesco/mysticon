BOOK=malazan

.PHONY: *

clean:
	-rm ${BOOK}.mobi
	-rm ${BOOK}.epub

build: clean
	-"/Applications/Kindle Previewer 3.app/Contents/lib/fc/bin//kindlegen" -c0 -gen_ff_mobi7 -dont_append_source dict.opf -o ${BOOK}.mobi

convert: build
	/Applications/calibre.app/Contents/MacOS/ebook-convert ${BOOK}.mobi ${BOOK}.epub

install:
	cp ${BOOK}.mobi /Volumes/Kindle/documents/dictionaries
