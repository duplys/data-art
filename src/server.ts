import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { textToImageBuffer } from "./core";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000", 10);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply rate limiting to all routes to prevent abuse.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Serve the static web UI.
app.use(express.static(path.join(__dirname, "..", "public")));

/** HTML form — main entry point. */
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/** Accept text (form field or JSON body), return a PNG image. */
app.post("/generate", (req: Request, res: Response) => {
  const text: unknown = req.body?.text;

  if (!text || typeof text !== "string" || text.trim() === "") {
    res.status(400).json({ error: "A non-empty `text` field is required." });
    return;
  }

  try {
    const buffer = textToImageBuffer(text);
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

/** Liveness probe for container orchestration. */
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export { app };

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`data-art server running on http://0.0.0.0:${PORT}`);
  });
}
