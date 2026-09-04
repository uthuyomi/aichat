import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/ai-sdk";

import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  type JSONSchema7,
} from "ai";

export async function POST(req: Request) {
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<
      string,
      {
        description?: string;
        parameters: JSONSchema7;
      }
    >;
  } = await req.json();

  // ↓ 今回追加するデバッグログ
  console.log("[chat-api] received tools:", Object.keys(tools ?? {}));

  const result = streamText({
    model: openai("gpt-5.6-luna"),

    messages: await convertToModelMessages(messages),

    tools: {
      ...frontendTools(tools ?? {}),
      web_seach: openai.tools.webSearch(),
    },

    ...(system === undefined ? {} : { system }),
  });

  return result.toUIMessageStreamResponse();
}
