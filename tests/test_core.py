"""Unit tests for data_art.core."""

from __future__ import annotations

import pytest
from PIL import Image

from data_art.core import compute_dimensions, text_to_image, text_to_pixels


class TestComputeDimensions:
    def test_returns_positive_integers(self) -> None:
        w, h = compute_dimensions("hello world")
        assert isinstance(w, int) and w > 0
        assert isinstance(h, int) and h > 0

    def test_square_output(self) -> None:
        w, h = compute_dimensions("abc" * 36)  # 108 chars → 36 pixels → 6×6
        assert w == h == 6

    def test_short_text_returns_minimum_one(self) -> None:
        assert compute_dimensions("ab") == (1, 1)

    def test_single_triplet(self) -> None:
        assert compute_dimensions("abc") == (1, 1)

    def test_longer_text(self) -> None:
        # 300 chars → 100 pixels → side = 10
        w, h = compute_dimensions("a" * 300)
        assert w == h == 10


class TestTextToPixels:
    def test_basic_triplet(self) -> None:
        assert text_to_pixels("ABC") == [(65, 66, 67)]

    def test_multiple_triplets(self) -> None:
        assert text_to_pixels("ABCDEF") == [(65, 66, 67), (68, 69, 70)]

    def test_pads_remainder_one(self) -> None:
        pixels = text_to_pixels("A")
        assert len(pixels) == 1
        assert pixels[0] == (65, 0, 0)

    def test_pads_remainder_two(self) -> None:
        pixels = text_to_pixels("AB")
        assert len(pixels) == 1
        assert pixels[0] == (65, 66, 0)

    def test_empty_string_returns_empty_list(self) -> None:
        assert text_to_pixels("") == []

    def test_space_character(self) -> None:
        pixels = text_to_pixels("   ")
        assert pixels == [(32, 32, 32)]


class TestTextToImage:
    def test_creates_image_file(self, tmp_path: object) -> None:
        output = tmp_path / "out.png"
        result = text_to_image("Hello, World!", output)
        assert result == output
        assert output.exists()

    def test_output_is_valid_png(self, tmp_path: object) -> None:
        output = tmp_path / "out.png"
        text_to_image("Hello, World!", output)
        img = Image.open(output)
        assert img.format == "PNG"

    def test_image_dimensions_match_compute(self, tmp_path: object) -> None:
        text = "a" * 300  # 100 pixels → 10×10
        output = tmp_path / "out.png"
        text_to_image(text, output)
        img = Image.open(output)
        assert img.size == (10, 10)

    def test_raises_on_empty_text(self, tmp_path: object) -> None:
        with pytest.raises(ValueError, match="empty"):
            text_to_image("", tmp_path / "out.png")

    def test_pixel_values_match_ascii(self, tmp_path: object) -> None:
        output = tmp_path / "out.png"
        text_to_image("ABC", output)
        img = Image.open(output).convert("RGB")
        assert img.getpixel((0, 0)) == (65, 66, 67)

    def test_accepts_string_path(self, tmp_path: object) -> None:
        output = str(tmp_path / "out.png")
        from pathlib import Path

        result = text_to_image("test text!", output)
        assert result == Path(output)
