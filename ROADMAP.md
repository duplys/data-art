# data-art — Feature Extension Roadmap

This document describes planned features beyond the current `v0.1` core.  
Items are grouped into near-term (v0.2–v0.3) and long-term (v1.0+) milestones.

---

## v0.2 — NLP Pipeline

| Feature | Description |
|---------|-------------|
| Stop-word removal | Strip common English stop words (via NLTK) before pixel mapping so the visual fingerprint reflects *content* words only. |
| Lemmatisation | Reduce inflected forms to their base form (e.g. *running* → *run*) for more compact and stable images. |
| Named-entity highlighting | Colour-encode detected named entities (persons, locations, organisations) using distinct hue offsets to make entities visually prominent. |
| Multiple input formats | Accept plain-text files (`.txt`), Markdown, and raw strings through the CLI. |

---

## v0.3 — PDF Support & Web Frontend

### PDF ingestion

Add a lightweight PDF-to-text extraction step powered by **[pypdf](https://github.com/py-pdf/pypdf)**:

```
PDF file ──► pypdf.PdfReader ──► extracted text ──► existing core pipeline ──► PNG
```

CLI extension:

```bash
data-art report.pdf -o report.png          # auto-detected by extension
data-art --pdf report.pdf -o report.png    # explicit flag
```

### Web Frontend (FastAPI + HTMX)

A minimal, dependency-light web application so users can generate images directly in the browser:

```
Browser
  │
  │  POST /generate  (multipart: PDF or raw text)
  ▼
FastAPI app  ──► data_art.core.text_to_image()  ──► PNG bytes
  │
  │  200 OK  (Content-Type: image/png  or  application/json with base64)
  ▼
Browser renders result inline using HTMX swap
```

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | HTML upload form |
| `POST` | `/generate` | Accept text or PDF, return PNG |
| `GET` | `/health` | Liveness probe for container orchestration |

**Stack:**
- [FastAPI](https://fastapi.tiangolo.com/) — async HTTP framework
- [HTMX](https://htmx.org/) — browser-side partial page updates without a JS build step
- [pypdf](https://github.com/py-pdf/pypdf) — PDF text extraction
- [uvicorn](https://www.uvicorn.org/) — ASGI server
- Docker Compose for local development

---

## v0.4 — Alternative Colour Schemes

Rather than a direct 1:1 ASCII→channel mapping, offer pluggable colour strategies:

| Scheme | Mapping logic |
|--------|---------------|
| `ascii` (default) | `(ord(c0), ord(c1), ord(c2))` — current algorithm |
| `hue-shift` | Shift the hue of a base colour by the character's position in the alphabet. |
| `frequency` | Map character frequency rank to a gradient (rare chars = bright, common = dark). |
| `semantic` | Use a small word-embedding model to assign colour based on word meaning. |

CLI flag: `--color-scheme <name>`

---

## v1.0 — Stable API & Distribution

| Item | Detail |
|------|--------|
| Public Python API | Stable, documented `data_art.core` API with semantic versioning. |
| PyPI release | Publish to PyPI so users can `uv add data-art` or `pip install data-art`. |
| Docker Hub image | Push `ghcr.io/duplys/data-art:<version>` on every tagged release. |
| Accessibility | Export a colour-blind-safe palette option. |
| CI/CD improvements | Automated release workflow triggered by version tags. |

---

## Long-term ideas (v2.0+)

- **3-D voxel rendering** — map text chunks to 3-D voxel grids and export as STL or glTF for printing/VR.
- **Animation** — produce MP4/GIF showing the image being "written" character by character.
- **ML colour mapping** — fine-tune a small model on labelled text→palette pairs to produce aesthetically pleasing images.
- **Collaborative gallery** — web gallery where users share and discover data-art images created from famous texts.
- **REST API / SaaS** — expose the pipeline as a public HTTP API with rate limiting and API-key authentication.
