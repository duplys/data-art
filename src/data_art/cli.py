"""Command-line interface for data-art."""

from __future__ import annotations

import sys
from pathlib import Path

import click

from data_art.core import text_to_image


@click.command(context_settings={"help_option_names": ["-h", "--help"]})
@click.argument(
    "input_file", metavar="INPUT", type=click.Path(path_type=Path), required=False
)
@click.option(
    "--text",
    "-t",
    metavar="TEXT",
    help="Input text string (alternative to file input).",
)
@click.option(
    "--output",
    "-o",
    default="output.png",
    show_default=True,
    type=click.Path(path_type=Path),
    help="Output PNG file path.",
)
def main(input_file: Path | None, text: str | None, output: Path) -> None:
    """Convert text to a data-art PNG image.

    Reads text from INPUT file, from --text, or from standard input, then
    generates a PNG where each pixel's RGB values encode three consecutive
    characters via their ASCII values.
    """
    if input_file is not None:
        content = Path(input_file).read_text(encoding="utf-8")
    elif text is not None:
        content = text
    elif not sys.stdin.isatty():
        content = click.get_text_stream("stdin").read()
    else:
        raise click.UsageError(
            "Provide an INPUT file, use --text, or pipe text via stdin."
        )

    try:
        path = text_to_image(content, output)
    except ValueError as exc:
        raise click.ClickException(str(exc)) from exc

    click.echo(f"Image saved to {path}")
