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
Browser / API Client
       │
       │  POST /generate  { text: "…" }
       ▼
  Express server (Node.js + TypeScript)
       │
       ├─► computeDimensions()  →  (width, height)
       │
       ├─► textToPixels()       →  [(r,g,b), …]
       │
       └─► pngjs PNG.sync.write()  →  PNG bytes
               │
               │  200 OK  Content-Type: image/png
               ▼
        Browser renders image inline
```

### Technology Stack

| Purpose | Library / Tool |
|---------|---------------|
| Runtime | [Node.js](https://nodejs.org/) 22 LTS |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| HTTP framework | [Express](https://expressjs.com/) 4 |
| PNG generation | [pngjs](https://github.com/pngjs/pngjs) 7 |
| Testing | [Jest](https://jestjs.io/) + ts-jest |
| Containerisation | [Docker](https://docs.docker.com/) / [Docker Compose](https://docs.docker.com/compose/) |

---

## Installation

### Docker Compose (recommended for deployment)

```bash
# Clone the repository
git clone <repository-url>
cd data-art

# Build and start the web application
docker compose up --build
```

The app will be available at **http://localhost:3000**.

### Docker (standalone)

```bash
docker build -t data-art .
docker run --rm -p 3000:3000 data-art
```

### Local development

```bash
# Prerequisites: Node.js 22+
npm install
npm run dev   # starts the server with ts-node at http://localhost:3000
```

---

## Usage

### Web interface

Open **http://localhost:3000** in your browser, paste any text into the form,
and click **Generate Image**.  The resulting PNG is displayed inline and can be
downloaded with the link below the image.

### REST API

#### `POST /generate`

Accepts a JSON body with a `text` field and returns a PNG image.

```bash
curl -X POST http://localhost:3000/generate \
  -H 'Content-Type: application/json' \
  -d '{"text":"To be or not to be, that is the question."}' \
  --output hamlet.png
```

#### `GET /health`

Liveness probe for container orchestration.

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

---

## API Reference

The public TypeScript API lives in `src/core.ts`:

### `computeDimensions(text: string): [number, number]`

Compute the square image dimensions for a given text.

```typescript
import { computeDimensions } from "./core";

const [w, h] = computeDimensions("Hello!");  // e.g. [1, 1] for short text
```

### `textToPixels(text: string): Pixel[]`

Convert a text string to an array of `[r, g, b]` tuples.

```typescript
import { textToPixels } from "./core";

const pixels = textToPixels("ABC");
// → [[65, 66, 67]]
```

### `textToImageBuffer(text: string): Buffer`

Full pipeline: convert text to a PNG and return it as a Node.js `Buffer`.

```typescript
import { textToImageBuffer } from "./core";

const buf = textToImageBuffer("Hello, World!");
// buf is a valid PNG buffer
```

Throws `Error` if `text` is empty.

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

A multi-stage `Dockerfile` and a `docker-compose.yml` are included at the
repository root.  The builder stage compiles TypeScript; the runtime stage
copies only the compiled JavaScript and production dependencies into a lean
Node.js 22 Alpine image.

### docker-compose (recommended)

```bash
# Build the image and start the service
docker compose up --build

# Run in the background
docker compose up -d --build

# Stop
docker compose down
```

### docker (standalone)

```bash
# Build
docker build -t data-art .

# Run
docker run --rm -p 3000:3000 data-art

# Custom port
docker run --rm -p 8080:8080 -e PORT=8080 data-art
```

The service exposes **port 3000** by default and responds to a `GET /health`
health-check so it integrates cleanly with reverse proxies (e.g. Caddy,
nginx) or orchestrators like Docker Swarm.

---

## Development

### Set up the development environment

```bash
npm install
```

### Run the tests

```bash
npm test
```

### Build

```bash
npm run build   # compiles TypeScript → dist/
```

### Start the development server

```bash
npm run dev     # runs with ts-node (no build step required)
```

### Project layout

```
data-art/
├── package.json            # Node.js project metadata & scripts
├── tsconfig.json           # TypeScript compiler configuration
├── Dockerfile              # Multi-stage Node.js container build
├── docker-compose.yml      # Compose file for deployment
├── .dockerignore
├── src/
│   ├── core.ts             # Core text→image logic (TypeScript)
│   └── server.ts           # Express web server
├── public/
│   └── index.html          # Web UI
└── tests/
    └── ts/
        └── core.test.ts    # Jest unit tests
```

### Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Make your changes, add tests, and run `npm test`.
4. Open a pull request — CI will run automatically.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `Error: Input text must not be empty.` | Empty input | Provide non-empty text. |
| `Cannot find module 'pngjs'` | Dependencies not installed | Run `npm install` |
| Port already in use | Another process on port 3000 | Set `PORT=3001` env variable |
| Docker build fails | Docker not running | Start Docker Desktop / Engine |

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
