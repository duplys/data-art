/**
 * Core text-to-image conversion logic for data-art.
 *
 * Each group of three consecutive characters in the input text is mapped to a
 * single RGB pixel using the char codes of those characters.  The result is
 * returned as a raw PNG buffer.
 */

import { PNG } from "pngjs";

/**
 * Compute square image dimensions from text length.
 *
 * The number of pixels is `Math.floor(text.length / 3)` and the image is
 * kept as close to a square as possible by taking the integer square root.
 *
 * @param text - Input text string.
 * @returns A `[width, height]` tuple of positive integers.
 */
export function computeDimensions(text: string): [number, number] {
  const numPixels = Math.max(1, Math.floor(text.length / 3));
  const side = Math.max(1, Math.floor(Math.sqrt(numPixels)));
  return [side, side];
}

/**
 * Convert text to an array of RGB pixel tuples.
 *
 * The text is zero-padded to the nearest multiple of three so that every
 * character belongs to exactly one pixel.
 *
 * @param text - Input text string.
 * @returns An array of `[r, g, b]` tuples where each value is in `[0, 255]`.
 */
export function textToPixels(text: string): Array<[number, number, number]> {
  const padding = (3 - (text.length % 3)) % 3;
  const padded = text + "\x00".repeat(padding);
  const pixels: Array<[number, number, number]> = [];
  for (let i = 0; i < padded.length; i += 3) {
    pixels.push([
      padded.charCodeAt(i),
      padded.charCodeAt(i + 1),
      padded.charCodeAt(i + 2),
    ]);
  }
  return pixels;
}

/**
 * Convert text to a PNG image and return it as a Buffer.
 *
 * @param text - Input text string to visualize.
 * @returns A Buffer containing the encoded PNG data.
 * @throws {Error} If `text` is empty.
 */
export function textToImageBuffer(text: string): Buffer {
  if (!text) {
    throw new Error("Input text must not be empty.");
  }

  const [width, height] = computeDimensions(text);
  const pixels = textToPixels(text);
  const totalPixels = width * height;

  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const dataIndex = pixelIndex * 4;
      const [r, g, b] =
        pixelIndex < pixels.length ? pixels[pixelIndex] : [0, 0, 0];
      png.data[dataIndex] = r;
      png.data[dataIndex + 1] = g;
      png.data[dataIndex + 2] = b;
      png.data[dataIndex + 3] = 255; // fully opaque
    }
  }

  // PNG.sync.write returns a Buffer
  return PNG.sync.write(png);
}
