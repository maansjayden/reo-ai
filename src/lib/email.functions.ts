import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  recipient: z.string().default(""),
  subject: z.string().default(""),
  tone: z.string().default("Professional"),
  context: z.string().default(""),
});

const SYSTEM =
  "You are an expert executive assistant. Write a complete and cohesive email using the provided context. The tone must strictly match the requested style. Never repeat the user's raw prompt instructions in the final output. Ensure the grammar is flawless.";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("openai/gpt-5.5");

    const userPrompt = [
      `Recipient: ${data.recipient || "(unspecified)"}`,
      data.subject ? `Subject: ${data.subject}` : null,
      `Tone: ${data.tone}`,
      `Context / key points:\n${data.context || "(no additional context provided)"}`,
      "",
      "Write the full email now. Include a natural greeting and sign-off. Use [Your name] as the sender placeholder. Output only the email body — no preamble, no explanations, no markdown code fences.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const { text } = await generateText({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
      });
      return { text: text.trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate email";
      throw new Error(message);
    }
  });
