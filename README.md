<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/1f3709cc-6eec-4a49-bf6b-8ae43ddf4fb7" width="300">
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
