<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/1f3709cc-6eec-4a49-bf6b-8ae43ddf4fb7" width="300">
</h1>

Mysticon is a collection of kindle dictionary for fantasy series. The following dictionaries are available:

- [The Warlord Chronicles](/the_warlord_chronicles) (B. Cornwell)
- [Die Hexer Saga](/hexer) (A. Sapkowski)
- [Agatha Christie characters](/agatha) (A. Christie)
- [The Malazan book of the Fallen](/malazan) (S. Erikson)

## Installation

- Browse to the relevant dictionary folder
- Copy the `.mobi` (or `.epub`) file into the `/documents/dictionaries/` folder on your kindle device
- On your kindle, select a word to look up and choose as dictionary the newly installed one

## Examples

<details>
  <summary>Show examples</summary>

<img width="400" src="https://github.com/user-attachments/assets/3eae7f53-cf7a-49ff-8f6c-c92cd1ba9d31">
<img width="400" src="https://github.com/user-attachments/assets/88a5e981-3075-4069-9fc2-4b29f2db410b">
</details>

## Development

- All entries must belong to `.html` files referenced in the `.opf` spine
- Run the `Makefile` specifying output name is the `$BOOK` environment variable

```make
make build # to generate .mobi
make convert # to convert to .epub
make install # to copy the .mobi dictionary to your kindle
```

### Duplicates check

- Run `lua list.lua /folder` to determine whether duplicate entries across the `.html` files in `/folder` exist.
