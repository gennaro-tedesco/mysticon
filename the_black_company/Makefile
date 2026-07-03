BOOK=the_black_company
NAME=$(shell echo "$(BOOK)" | tr '_' ' ' | awk '{for(i=1;i<=NF;i++) $$i=toupper(substr($$i,1,1)) substr($$i,2); print}')
DICT_DIR=dict/
MERGED_FILE=${BOOK}_combined.stardict

.PHONY: clean merge build all

all: build

clean:
	-rm -rf ${DICT_DIR}
	-rm -f ${MERGED_FILE}

merge: clean
	cat *.stardict > ${MERGED_FILE}

build: merge
	mkdir -p ${DICT_DIR}
	uvx pyglossary ${MERGED_FILE} ${DICT_DIR}/${BOOK}.ifo \
		--read-format=Tabfile \
		--write-format=Stardict \
		--write-options="sametypesequence=h" \
		--name="$(NAME) Lexicon"
	rm -f ${MERGED_FILE}
