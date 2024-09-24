<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/4672f9a1-3e99-456f-87a3-932bbc17b847" width="100">
</h1>

Mysticon is a collection of kindle dictionary for fantasy series. The following dictionaries are available:

- [The Warlord Chronicles](/the_warlord_chronicles) (B. Cornwell)

## Installation

- Browse to the relevant dictionary folder
- Copy the `.mobi` (or `.epub`) file into the `/dictionary/` folder on your kindle device
- On your kindle, select a word to look up and choose as dictionary the newly installed one

## Development

- All entries must belong to `.html` files referenced in the `.opf` spine
- Run the `Makefile` specifying output name is the `$BOOK` environment variable

```make
make build # to generate .mobi
make convert # to convert to .epub
```
