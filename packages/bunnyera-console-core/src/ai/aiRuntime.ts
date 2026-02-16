import OpenAI from "openai";
import axios from "axios";
import { loadConfig } from "../config/configService";

export type AIProvider = "openai" | "azure" | "deepseek" | "ollama";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
}

async function getClient() {
  const config = await loadConfig();
  const { provider, apiKey, baseUrl, model } = config.ai;

  if (provider === "openai" || provider === "azure") {
    const client = new OpenAI({
      apiKey,
      baseURL: baseUrl
    });
    return { provider, model, client };
  }

  return { provider, model, client: null as unknown as OpenAI, baseUrl, apiKey };
}

export async function runChat(messages: AIMessage[]): Promise<AIResponse> {
  const { provider, model, client, baseUrl } = await getClient();

  if (provider === "openai" || provider === "azure") {
    const res = await client.chat.completions.create({
      model,
      messages
    });
    const content = res.choices[0]?.message?.content ?? "";
    return { content, provider, model };
  }

  if (provider === "deepseek") {
    const res = await axios.post(
      baseUrl ?? "https://api.deepseek.com/chat/completions",
      { model, messages },
      { headers: { "Content-Type": "application/json" } }
    );
    const content = res.data.choices?.[0]?.message?.content ?? "";
    return { content, provider, model };
  }

  if (provider === "ollama") {
    const res = await axios.post(
      baseUrl ?? "http://localhost:11434/api/chat",
      { model, messages },
      { headers: { "Content-Type": "application/json" } }
    );
    const content = res.data.message?.content ?? "";
    return { content, provider, model };
  }

  return { content: "", provider, model };
}
