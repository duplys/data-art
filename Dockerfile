# syntax=docker/dockerfile:1
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /app

# Install project dependencies into an isolated virtual environment.
COPY pyproject.toml README.md LICENSE ./
COPY src/ ./src/
RUN uv sync --no-dev --no-editable

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Copy the pre-built virtual environment from the builder stage.
COPY --from=builder /app/.venv /app/.venv

ENV PATH="/app/.venv/bin:$PATH"

# Mount /data as the working directory so users can pass files easily:
#   docker run --rm -v "$(pwd):/data" data-art --text "Hello" -o /data/out.png
WORKDIR /data

ENTRYPOINT ["data-art"]
CMD ["--help"]
