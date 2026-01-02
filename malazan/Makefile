BOOK=malazan
DICT_DIR=star_dict/
MERGED_FILE=${BOOK}_combined.txt

.PHONY: clean merge build all

all: build

clean:
	-rm -rf ${DICT_DIR}
	-rm -f ${MERGED_FILE}

merge: clean
	cat *.txt > ${MERGED_FILE}

build: merge
	mkdir -p ${DICT_DIR}
	uvx pyglossary ${MERGED_FILE} ${DICT_DIR}/${BOOK}.ifo \
		--read-format=Tabfile \
		--write-format=Stardict \
		--write-options="sametypesequence=h"
	rm -f ${MERGED_FILE}
