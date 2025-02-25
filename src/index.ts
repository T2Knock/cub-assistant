import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const model = google("gemini-1.5-flash");

const text = await generateText({
  model,
  prompt: "Write a vegetarian lasagna recipe for 4 people.",
});

console.log(text);

import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hono!"));

export default app;
