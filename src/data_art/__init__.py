"""data-art: Transform text into visual data art by encoding characters as RGB pixels.

Each group of three characters maps to one RGB pixel via their ASCII values.
"""

from data_art.core import compute_dimensions, text_to_image, text_to_pixels

__all__ = ["compute_dimensions", "text_to_image", "text_to_pixels"]
