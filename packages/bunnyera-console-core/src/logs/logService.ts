import fs from "fs-extra";
import path from "path";
import winston from "winston";

export type LogLevel = "info" | "warn" | "error" | "system";

export interface LogEntry {
  id: string;
  type: LogLevel;
  message: string;
  timestamp: string;
}

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "console.log");

fs.ensureDirSync(LOG_DIR);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: LOG_FILE, maxsize: 5 * 1024 * 1024, maxFiles: 5 })
  ]
});

export function log(type: LogLevel, message: string) {
  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    message,
    timestamp: new Date().toISOString()
  };
  logger.log(type === "system" ? "info" : type, entry);
}

export async function readLogs(limit = 200): Promise<LogEntry[]> {
  if (!fs.existsSync(LOG_FILE)) return [];
  const content = await fs.readFile(LOG_FILE, "utf-8");
  const lines = content.split("\n").filter(Boolean);
  const parsed = lines.map((line) => {
    try {
      return JSON.parse(line) as LogEntry;
    } catch {
      return null;
    }
  }).filter((x): x is LogEntry => !!x);
  return parsed.slice(-limit);
}

export async function clearLogs() {
  await fs.writeFile(LOG_FILE, "", "utf-8");
}
