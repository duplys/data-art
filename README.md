# Data Art

Transform any text into a visual "data fingerprint" by encoding characters as
RGB pixels.  Each group of three consecutive characters maps to one pixel via
their ASCII values, producing a unique square PNG image for every piece of
text.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Algorithm Details](#algorithm-details)
7. [Docker](#docker)
8. [Development](#development)
9. [Troubleshooting](#troubleshooting)
10. [Roadmap](#roadmap)

---

## Introduction

### Use Cases

- **Digital Art** — create unique artwork from quotes, poems, or stories.
- **Data Visualisation** — understand text structure and character distributions at a glance.
- **Security** — "visual hashing" for quick comparison of similar texts.
- **Education** — illustrate ASCII encoding, colour theory, and data representation.

---

## Architecture

```
Input Text
    │
    ▼
compute_dimensions()   →   (width, height)  pixels
    │
    ▼
text_to_pixels()       →   [(r,g,b), …]
    │
    ▼
PIL Image.putdata()    →   square PNG image
    │
    ▼
PNG Output
```

### Technology Stack

| Purpose | Library / Tool |
|---------|---------------|
| Image generation | [Pillow](https://pillow.readthedocs.io/) ≥ 12.1.1 |
| CLI | [Click](https://click.palletsprojects.com/) ≥ 8.1 |
| Package management | [uv](https://docs.astral.sh/uv/) |
| Build backend | [Hatchling](https://hatch.pypa.io/) |
| Testing | [pytest](https://docs.pytest.org/) |
| Linting / formatting | [Ruff](https://docs.astral.sh/ruff/) |

---

## Installation

### Recommended: uv

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone the repository
git clone <repository-url>
cd data-art

# Install the package (creates an isolated virtual environment)
uv sync

# Run
uv run data-art --help
```

### pip

```bash
git clone <repository-url>
cd data-art
pip install .
data-art --help
```

### Docker

```bash
docker build -t data-art .
docker run --rm -v "$(pwd):/data" data-art --text "Hello, World!" -o /data/hello.png
```

---

## Usage

### Generate an image from a string

```bash
data-art --text "To be or not to be, that is the question." -o hamlet.png
```

### Generate an image from a file

```bash
data-art essay.txt -o essay.png
```

### Read from standard input

```bash
cat mybook.txt | data-art -o book.png
```

### CLI reference

```
Usage: data-art [OPTIONS] [INPUT]

  Convert text to a data-art PNG image.

  Reads text from INPUT file, from --text, or from standard input, then
  generates a PNG where each pixel's RGB values encode three consecutive
  characters via their ASCII values.

Arguments:
  INPUT  [optional]

Options:
  -t, --text TEXT    Input text string (alternative to file input).
  -o, --output PATH  Output PNG file path.  [default: output.png]
  -h, --help         Show this message and exit.
```

---

## API Reference

The public Python API lives in `data_art.core`:

### `compute_dimensions(text: str) -> tuple[int, int]`

Compute the square image dimensions for a given text.

```python
from data_art.core import compute_dimensions

w, h = compute_dimensions("Hello!")  # e.g. (1, 1) for short text
```

### `text_to_pixels(text: str) -> list[tuple[int, int, int]]`

Convert a text string to a list of `(r, g, b)` tuples.

```python
from data_art.core import text_to_pixels

pixels = text_to_pixels("ABC")
# → [(65, 66, 67)]
```

### `text_to_image(text: str, output_path: Path | str = "output.png") -> Path`

Full pipeline: convert text to a PNG and save it.

```python
from data_art.core import text_to_image

path = text_to_image("Hello, World!", "hello.png")
print(path)  # PosixPath('hello.png')
```

Raises `ValueError` if `text` is empty.

---

## Algorithm Details

### Dimension calculation

```
num_pixels = len(text) // 3
side       = isqrt(num_pixels)      # integer square root → square image
```

A 300-character text produces `100` pixels and a `10 × 10` image.

### Colour mapping

Each group of three characters becomes one pixel:

```
(ord(text[i]), ord(text[i+1]), ord(text[i+2]))  →  (R, G, B)
```

The canvas is padded with black pixels `(0, 0, 0)` to fill any remainder.

### Colour distribution by character type

| Range | Characters | Colour tendency |
|-------|-----------|----------------|
| 32–47 | Spaces & symbols | Very dark |
| 48–57 | Digits 0–9 | Dark |
| 65–90 | A–Z | Medium |
| 97–122 | a–z | Medium–bright |
| 128–255 | Extended ASCII | Bright |

---

## Docker

A multi-stage Dockerfile is included at the repository root.  The builder
stage uses the official `uv` image to install dependencies; the runtime stage
is a lean Python 3.12 image.

```bash
# Build
docker build -t data-art .

# Run with a text argument
docker run --rm -v "$(pwd):/data" data-art --text "Hello" -o /data/out.png

# Run with a file
docker run --rm -v "$(pwd):/data" data-art /data/myfile.txt -o /data/out.png
```

---

## Development

### Set up the development environment

```bash
uv sync --all-groups
```

### Run the tests

```bash
uv run pytest
```

### Lint and format

```bash
uv run ruff check .
uv run ruff format .
```

### Project layout

```
data-art/
├── pyproject.toml          # Project metadata, deps, tool config
├── Dockerfile              # Multi-stage container build
├── ROADMAP.md              # Feature extension plan
├── src/
│   └── data_art/
│       ├── __init__.py
│       ├── core.py         # Core text→image logic
│       └── cli.py          # Click-based CLI
├── tests/
│   └── test_core.py        # pytest unit tests
└── text/
    └── pil.py              # Original prototype script (deprecated)
```

### Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Make your changes, add tests, and run `uv run pytest` + `uv run ruff check .`.
4. Open a pull request — CI will run automatically.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `ValueError: Input text must not be empty.` | Empty input | Provide non-empty text. |
| `ModuleNotFoundError: No module named 'PIL'` | Pillow not installed | `uv sync` or `pip install pillow` |
| `ValueError: width and height must be > 0` | Text too short (< 3 chars) | Use at least 3 characters. |
| Docker build fails | Docker not running | Start Docker Desktop / Engine. |

---

## Roadmap

See **[ROADMAP.md](ROADMAP.md)** for the full feature-extension plan including:

- v0.2 — NLP pipeline (stop words, lemmatisation, named-entity highlighting)
- v0.3 — PDF ingestion & web frontend (FastAPI + HTMX)
- v0.4 — Alternative colour schemes
- v1.0 — Stable API, PyPI release, Docker Hub image
- v2.0+ — 3-D voxels, animation, ML colour mapping, collaborative gallery

---

### Resources

- [Pillow Documentation](https://pillow.readthedocs.io/)
- [uv Documentation](https://docs.astral.sh/uv/)
- [ASCII Table Reference](https://www.asciitable.com/)
