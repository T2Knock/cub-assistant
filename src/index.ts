import { NoObjectGeneratedError } from "ai";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { streamText } from "hono/streaming";
import { STATUS_CODE } from "./constants";
import {
  parseCommandFromInput,
  sendPrompt,
  sendPromptForObject,
} from "./handler";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.onError((err) => {
  if (NoObjectGeneratedError.isInstance(err)) {
    throw new HTTPException(STATUS_CODE.BAD_REQUEST.code, {
      message: err.message,
    });
  }

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return new HTTPException(STATUS_CODE.INTERNAL_SERVER_ERROR.code, {
    message: STATUS_CODE.INTERNAL_SERVER_ERROR.message,
  }).getResponse();
});

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
