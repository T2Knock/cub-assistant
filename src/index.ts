import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import {
  parseCommandFromInput,
  sendPrompt,
  sendPromptForObject,
} from "./handler";
import { streamText } from "hono/streaming";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.post("/stream/text", async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt;

  return streamText(c, async (stream) => {
    await sendPrompt(stream, prompt);
  });
});

app.post("/stream/object", async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt;

  await sendPromptForObject(prompt);
});

app.post("/ai/session/prompt", async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt;

  const response = await parseCommandFromInput(prompt);
  return response.toJsonResponse();
});

export default app;
