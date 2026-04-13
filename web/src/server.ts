import express, { Request, Response } from "express";
import path from "path";
import { textToImageBuffer } from "./core";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

/**
 * POST /api/generate
 *
 * Body: { text: string }
 * Response: PNG image (Content-Type: image/png)  on success
 *           JSON { error: string } on validation failure (400)
 */
app.post("/api/generate", (req: Request, res: Response) => {
  const { text } = req.body as { text?: unknown };

  if (typeof text !== "string" || text.trim() === "") {
    res.status(400).json({ error: "Input text must not be empty." });
    return;
  }

  try {
    const buffer = textToImageBuffer(text);
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    res.status(400).json({ error: message });
  }
});

/**
 * GET /health
 *
 * Liveness probe for container orchestration.
 */
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const PORT = parseInt(process.env.PORT ?? "3000", 10);

app.listen(PORT, () => {
  console.log(`data-art web server running on http://localhost:${PORT}`);
});

export default app;
