"""Core text-to-image conversion logic for data-art.

Each group of three consecutive characters in the input text is mapped to a
single RGB pixel using the ASCII values of those characters.  The result is
saved as a square-ish PNG image.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image


def compute_dimensions(text: str) -> tuple[int, int]:
    """Compute square image dimensions from text length.

    The number of pixels is ``len(text) // 3`` and the image is kept as close
    to a square as possible by taking the integer square root of that value.

    Args:
        text: Input text string.

    Returns:
        A ``(width, height)`` tuple of positive integers.
    """
    num_pixels = max(1, len(text) // 3)
    side = max(1, int(math.isqrt(num_pixels)))
    return side, side


def text_to_pixels(text: str) -> list[tuple[int, int, int]]:
    """Convert text to a list of RGB pixel tuples.

    The text is zero-padded to the nearest multiple of three so that every
    character belongs to exactly one pixel.

    Args:
        text: Input text string.

    Returns:
        A list of ``(r, g, b)`` tuples where each value is in ``[0, 255]``.
    """
    # Pad to the next multiple of 3 with null bytes.
    padding = (-len(text)) % 3
    padded = text + "\x00" * padding
    return [
        (ord(padded[i]), ord(padded[i + 1]), ord(padded[i + 2]))
        for i in range(0, len(padded), 3)
    ]


def text_to_image(text: str, output_path: Path | str = "output.png") -> Path:
    """Convert text to a PNG image and save it.

    Args:
        text: Input text string to visualize.
        output_path: Destination path for the generated PNG file.
            Defaults to ``output.png`` in the current working directory.

    Returns:
        The resolved :class:`~pathlib.Path` of the saved image.

    Raises:
        ValueError: If *text* is empty.
    """
    if not text:
        raise ValueError("Input text must not be empty.")

    output_path = Path(output_path)
    width, height = compute_dimensions(text)
    pixels = text_to_pixels(text)

    # Trim or pad the pixel list to fill the canvas exactly.
    total_pixels = width * height
    canvas_pixels = (pixels + [(0, 0, 0)] * total_pixels)[:total_pixels]

    image = Image.new("RGB", (width, height))
    image.putdata(canvas_pixels)
    image.save(output_path)

    return output_path
