import fs from "fs-extra";
import path from "path";
import { z } from "zod";

const CONFIG_DIR = path.join(process.cwd(), "config");
const CONFIG_FILE = path.join(CONFIG_DIR, "console.config.json");

export const ConfigSchema = z.object({
  language: z.string().default("en"),
  theme: z.enum(["dark", "light"]).default("dark"),
  ai: z.object({
    provider: z.enum(["openai", "azure", "deepseek", "ollama"]).default("openai"),
    apiKey: z.string().optional(),
    baseUrl: z.string().optional(),
    model: z.string().default("gpt-4o-mini")
  }).default({
    provider: "openai",
    model: "gpt-4o-mini"
  })
});

export type ConsoleConfig = z.infer<typeof ConfigSchema>;

export async function loadConfig(): Promise<ConsoleConfig> {
  await fs.ensureDir(CONFIG_DIR);
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = ConfigSchema.parse({});
    await fs.writeJson(CONFIG_FILE, defaultConfig, { spaces: 2 });
    return defaultConfig;
  }
  const raw = await fs.readJson(CONFIG_FILE);
  return ConfigSchema.parse(raw);
}

export async function saveConfig(config: ConsoleConfig): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  const parsed = ConfigSchema.parse(config);
  await fs.writeJson(CONFIG_FILE, parsed, { spaces: 2 });
}
