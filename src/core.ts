/**
 * Core text-to-image conversion logic for data-art.
 *
 * Each group of three consecutive characters in the input text is mapped to a
 * single RGB pixel using the ASCII/Unicode code point of those characters.
 * The result is returned as a PNG buffer.
 */

import { PNG } from "pngjs";

export type Pixel = [number, number, number];

/**
 * Compute square image dimensions from text length.
 *
 * The number of pixels is `Math.floor(text.length / 3)` and the image is
 * kept as close to a square as possible by taking the integer square root.
 */
export function computeDimensions(text: string): [number, number] {
  const numPixels = Math.max(1, Math.floor(text.length / 3));
  const side = Math.max(1, Math.floor(Math.sqrt(numPixels)));
  return [side, side];
}

/**
 * Convert text to a list of RGB pixel tuples.
 *
 * The text is zero-padded to the nearest multiple of three so that every
 * character belongs to exactly one pixel. Values are clamped to [0, 255].
 */
export function textToPixels(text: string): Pixel[] {
  const padding = (3 - (text.length % 3)) % 3;
  const padded = text + "\x00".repeat(padding);
  const pixels: Pixel[] = [];
  for (let i = 0; i < padded.length; i += 3) {
    pixels.push([
      padded.charCodeAt(i) & 0xff,
      padded.charCodeAt(i + 1) & 0xff,
      padded.charCodeAt(i + 2) & 0xff,
    ]);
  }
  return pixels;
}

/**
 * Convert text to a PNG image and return it as a Buffer.
 *
 * @throws {Error} If text is empty.
 */
export function textToImageBuffer(text: string): Buffer {
  if (!text) {
    throw new Error("Input text must not be empty.");
  }

  const [width, height] = computeDimensions(text);
  const pixels = textToPixels(text);
  const totalPixels = width * height;

  // Trim or pad the pixel list to fill the canvas exactly.
  const blackPixel: Pixel = [0, 0, 0];
  const canvasPixels: Pixel[] = [
    ...pixels,
    ...Array<Pixel>(totalPixels).fill(blackPixel),
  ].slice(0, totalPixels);

  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b] = canvasPixels[y * width + x];
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255; // fully opaque
    }
  }

  return PNG.sync.write(png);
}
