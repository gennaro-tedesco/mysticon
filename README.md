<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/1f3709cc-6eec-4a49-bf6b-8ae43ddf4fb7" width="300">
</h1>

Mysticon is a collection of kindle and StarDict dictionary for fantasy series. The following dictionaries are available:

- [The Warlord Chronicles](/the_warlord_chronicles) (B. Cornwell)
- [Die Hexer Saga](/hexer) (A. Sapkowski)
- [Agatha Christie characters](/agatha) (A. Christie)
- [The Malazan book of the Fallen](/malazan) (S. Erikson)

## Installation

- Browse to the relevant dictionary folder
- Copy the output dictionary into the relevant folder on your target device

## Examples

<details>
  <summary>Show examples</summary>

<img width="400" src="https://github.com/user-attachments/assets/3eae7f53-cf7a-49ff-8f6c-c92cd1ba9d31">
<img width="400" src="https://github.com/user-attachments/assets/88a5e981-3075-4069-9fc2-4b29f2db410b">
</details>

## Development

```make
make build # to generate the dictionary
make install # to copy the dictionary to your target device
```

### Duplicates check

- For kindle: run `lua list.lua /folder` to determine whether duplicate entries across the `.html` files in `/folder` exist.
- For StarDict: run `lua duplicates.lua /folder` to determine whether duplicate entries across the `.stardict` files in `/folder` exist.
