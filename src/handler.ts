import { google } from "@ai-sdk/google";
import { generateObject, streamObject, streamText, type CoreMessage } from "ai";
import type { StreamingApi } from "hono/utils/stream";
import { z } from "zod";

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

export const sendPromptForObject = async (prompt: string) => {
  const { partialObjectStream } = streamObject({
    model,
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(z.string()),
        steps: z.array(z.string()),
      }),
    }),
    prompt,
  });

  for await (const partialObject of partialObjectStream) {
    console.clear();
    console.log(partialObject);
  }
};

export const parseCommandFromInput = async (prompt: string) => {
  const output = await generateObject({
    model,
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ name: z.string(), amount: z.string() }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt,
  });

  return output;
};
