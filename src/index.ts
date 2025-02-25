import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { sendPrompt } from "./util";
import { streamText } from "hono/streaming";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

const globalSessionID = "550b0944-681d-4c35-ab43-3be1bd521b6f";
app.post("/prompt", async (c) => {
  const body = await c.req.json();
  const sessionID = body.sessionID;
  const userInput = body.userInput;

  if (sessionID !== globalSessionID) {
    return c.json({ error: "Not found sessionID" });
  }

  return streamText(c, async (stream) => {
    await sendPrompt(stream, userInput);
  });
});

export default app;
