# Surround It — v0.5.0

**Simple. Fast. Intuitive.**
Wrap selected text in quotes, backticks, or brackets—just like your favorite IDE, but right in your browser.

---

## Table of Contents

[[__TOC__]]

---

## Overview

**Surround it!** is a browser extension (Chrome, Firefox, Edge) that replicates one of the most addictive features in modern IDEs: wrapping a selected text with matching quotes,
backticks, or brackets. Automagically and intelligently.

- **Inspired by**: IDEs like VS Code, IntelliJ—makes typing quotes or brackets wrap selected content instead of replacing it.
- **Use case**: Developers, writers, editors—anyone editing text and tired of manually wrapping selections.
- **Current version**: v0.5.0 (released on **August 17, 2025**) :contentReference[oaicite:1]{index=1}.

---

## Features

- Wrap selected text with:
    - `" "` (double quotes)
    - `' '` (single quotes)
    - `` ` ` `` (backticks)
    - `( )` (parentheses)
    - `[ ]` (square brackets)
    - `{ }` (curly braces)
- **Lightweight** and **minimal permissions**.
- **Extensible**: You can customize the wrapping characters due to your liking.

---

## Installation

| Browser | Link                                                                                                       |
|---------|------------------------------------------------------------------------------------------------------------|
| Chrome  | [Download](https://chrome.google.com/webstore/detail/cjelblbjilfobifendknkljagdndaipd)                     |
| Firefox | [Download](https://addons.mozilla.org/en-US/firefox/addon/surround-it/)                                    |
| Edge    | [Download](https://microsoftedge.microsoft.com/addons/detail/surround-it/klkpiglljjcogfoinnimkkkhmjmjmonk) |

---

## Usage

1. Install the extension from your browser's store (see [Installation](#installation)).
2. Highlight any text in an input, textarea or contentEditable DOM element.
3. Press the key for the desired wrapper (e.g., `"` or `(`).
4. **Result**: Text is automatically wrapped:

```

"selected text"
(selected text)

````

5. **Edge cases**:

- **No selection**: Insert an empty pair and place the cursor between.
- ** Text already wrapped**: Wrap again.

---

## Configuration & Options

- Adding custom wrappers in the menu.
- Enabling or disabling every configured wrapper.
- Enable or disable the wrapping behavior.

---

## Development

### Prerequisites

- Node.js **>= 22.18.0** (tested locally)
- Yarn

### Setup Instructions

```bash
git clone https://github.com/Andret2344/surround-it.git
cd surround-it
yarn install
````

### Build & Test

```bash
yarn build
```

To test locally:

* **Chrome/Edge**: Load the `dist/` folder via `chrome://extensions`.
* **Firefox**: Install from `about:debugging` with `dist/`.

---

## Contribution Guidelines

Contributions welcome:

1. Fork the repo.
2. Create your feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Descriptive message"`.
4. Push: `git push origin feature-name`.
5. Open a pull request.

Please follow:

* Clear commit messages
* Consistent formatting (indentation, quotes, etc.)
* Explain your changes in the PR description

---

## Changelog

### v0.5.0

Release date: *2025-08-17*

* Initial browser-ready release for Chrome, Firefox, and Edge. ([GitHub][1])

---

## License & Acknowledgments

* © 2025 **Andret2344**
* License: **CC BY-SA 4.0**
* Inspired by behavior in popular IDEs like VS Code.

---

## Contact

Questions, ideas, bug reports:

* GitHub Issues: https://github.com/Andret2344/surround-it/issues
* Email: andret2344@gmail.com

---

[1]: https://github.com/Andret2344/surround-it "GitHub - Andret2344/surround-it: Extension inspired by programming IDEs. Simply wrap a text in any brackets or string marks: single or double quotation marks, or the grave accent."
