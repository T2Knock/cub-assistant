import { google } from "@ai-sdk/google";
import { streamText, type CoreMessage } from "ai";
import type { StreamingApi } from "hono/utils/stream";

const model = google("gemini-1.5-flash");

const messages: CoreMessage[] = [];

export const sendPrompt = async (stream: StreamingApi, userInput: string) => {
  messages.push({ role: "user", content: userInput });

  const result = streamText({
    model,
    messages,
  });

  let fullResponse = "";

  for await (const delta of result.textStream) {
    fullResponse += delta;
    await stream.write(delta);
  }

  messages.push({ role: "assistant", content: fullResponse });
  await stream.close();
};
