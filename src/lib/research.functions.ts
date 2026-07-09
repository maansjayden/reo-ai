import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  topic: z.string().min(1),
});

const SYSTEM =
  "You are an expert enterprise research assistant. The user will provide a topic or question. You must synthesize the information and return exactly 4 concise, highly professional bullet points containing key insights about that topic. Never repeat the user's prompt. Output only the bullet points.";

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("openai/gpt-5.5");

    try {
      const { text } = await generateText({
        model,
        system: SYSTEM,
        prompt: data.topic,
      });

      const bullets = text
        .split("\n")
        .map((l) => l.replace(/^\s*(?:[-*•]|\d+\.)\s*/, "").trim())
        .filter((l) => l.length > 0)
        .slice(0, 4);

      return { insights: bullets };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to research topic";
      throw new Error(message);
    }
  });
