/**
 * Unit tests for src/core.ts
 */

import { PNG } from "pngjs";
import {
  computeDimensions,
  textToImageBuffer,
  textToPixels,
} from "../../src/core";

describe("computeDimensions", () => {
  it("returns positive integers", () => {
    const [w, h] = computeDimensions("hello world");
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
    expect(Number.isInteger(w)).toBe(true);
    expect(Number.isInteger(h)).toBe(true);
  });

  it("returns a square result", () => {
    // 108 chars → 36 pixels → side = 6
    const [w, h] = computeDimensions("abc".repeat(36));
    expect(w).toBe(6);
    expect(h).toBe(6);
  });

  it("returns (1,1) for short text", () => {
    expect(computeDimensions("ab")).toEqual([1, 1]);
  });

  it("returns (1,1) for a single triplet", () => {
    expect(computeDimensions("abc")).toEqual([1, 1]);
  });

  it("returns (10,10) for 300-character text", () => {
    // 300 chars → 100 pixels → side = 10
    const [w, h] = computeDimensions("a".repeat(300));
    expect(w).toBe(10);
    expect(h).toBe(10);
  });
});

describe("textToPixels", () => {
  it("maps a single triplet to correct RGB values", () => {
    expect(textToPixels("ABC")).toEqual([[65, 66, 67]]);
  });

  it("maps multiple triplets correctly", () => {
    expect(textToPixels("ABCDEF")).toEqual([
      [65, 66, 67],
      [68, 69, 70],
    ]);
  });

  it("pads remainder-1 text with zeros", () => {
    const pixels = textToPixels("A");
    expect(pixels).toHaveLength(1);
    expect(pixels[0]).toEqual([65, 0, 0]);
  });

  it("pads remainder-2 text with a trailing zero", () => {
    const pixels = textToPixels("AB");
    expect(pixels).toHaveLength(1);
    expect(pixels[0]).toEqual([65, 66, 0]);
  });

  it("returns an empty array for empty string", () => {
    expect(textToPixels("")).toEqual([]);
  });

  it("handles space character (ASCII 32)", () => {
    expect(textToPixels("   ")).toEqual([[32, 32, 32]]);
  });
});

describe("textToImageBuffer", () => {
  it("returns a Buffer", () => {
    const buf = textToImageBuffer("Hello, World!");
    expect(Buffer.isBuffer(buf)).toBe(true);
  });

  it("returns a valid PNG buffer", () => {
    const buf = textToImageBuffer("Hello, World!");
    // PNG files start with an 8-byte signature.
    expect(buf.slice(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );
  });

  it("produces the correct image dimensions", () => {
    // 300 chars → 10×10
    const buf = textToImageBuffer("a".repeat(300));
    const png = PNG.sync.read(buf);
    expect(png.width).toBe(10);
    expect(png.height).toBe(10);
  });

  it("encodes pixel values matching ASCII code points", () => {
    const buf = textToImageBuffer("ABC");
    const png = PNG.sync.read(buf);
    // Pixel at (0,0) — index 0 in the data array (RGBA).
    expect(png.data[0]).toBe(65); // R = ord('A')
    expect(png.data[1]).toBe(66); // G = ord('B')
    expect(png.data[2]).toBe(67); // B = ord('C')
    expect(png.data[3]).toBe(255); // A = fully opaque
  });

  it("throws on empty text", () => {
    expect(() => textToImageBuffer("")).toThrow("must not be empty");
  });
});
