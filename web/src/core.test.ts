import { PNG } from "pngjs";
import { computeDimensions, textToImageBuffer, textToPixels } from "./core";

describe("computeDimensions", () => {
  test("returns positive integers", () => {
    const [w, h] = computeDimensions("hello world");
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });

  test("produces a square image", () => {
    // 108 chars → 36 pixels → side = 6
    const [w, h] = computeDimensions("abc".repeat(36));
    expect(w).toBe(6);
    expect(h).toBe(6);
  });

  test("short text returns minimum 1×1", () => {
    expect(computeDimensions("ab")).toEqual([1, 1]);
  });

  test("single triplet returns 1×1", () => {
    expect(computeDimensions("abc")).toEqual([1, 1]);
  });

  test("300-char text → 10×10", () => {
    const [w, h] = computeDimensions("a".repeat(300));
    expect(w).toBe(10);
    expect(h).toBe(10);
  });
});

describe("textToPixels", () => {
  test("basic triplet", () => {
    expect(textToPixels("ABC")).toEqual([[65, 66, 67]]);
  });

  test("multiple triplets", () => {
    expect(textToPixels("ABCDEF")).toEqual([
      [65, 66, 67],
      [68, 69, 70],
    ]);
  });

  test("pads remainder one", () => {
    const pixels = textToPixels("A");
    expect(pixels).toHaveLength(1);
    expect(pixels[0]).toEqual([65, 0, 0]);
  });

  test("pads remainder two", () => {
    const pixels = textToPixels("AB");
    expect(pixels).toHaveLength(1);
    expect(pixels[0]).toEqual([65, 66, 0]);
  });

  test("empty string returns empty array", () => {
    expect(textToPixels("")).toEqual([]);
  });

  test("space character", () => {
    expect(textToPixels("   ")).toEqual([[32, 32, 32]]);
  });
});

describe("textToImageBuffer", () => {
  test("returns a Buffer", () => {
    const buf = textToImageBuffer("Hello, World!");
    expect(Buffer.isBuffer(buf)).toBe(true);
  });

  test("output is a valid PNG", () => {
    const buf = textToImageBuffer("Hello, World!");
    // PNG files start with the 8-byte PNG signature
    expect(buf.slice(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );
  });

  test("image dimensions match computeDimensions", () => {
    const text = "a".repeat(300); // → 10×10
    const buf = textToImageBuffer(text);
    const png = PNG.sync.read(buf);
    expect(png.width).toBe(10);
    expect(png.height).toBe(10);
  });

  test("throws on empty text", () => {
    expect(() => textToImageBuffer("")).toThrow("must not be empty");
  });

  test("pixel values match ASCII codes", () => {
    const buf = textToImageBuffer("ABC");
    const png = PNG.sync.read(buf);
    // First pixel: R=65, G=66, B=67
    expect(png.data[0]).toBe(65);
    expect(png.data[1]).toBe(66);
    expect(png.data[2]).toBe(67);
    expect(png.data[3]).toBe(255); // alpha
  });
});
