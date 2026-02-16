import fs from "fs-extra";
import path from "path";

export async function listDirectory(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.map((e) => ({
    name: e.name,
    isDirectory: e.isDirectory()
  }));
}

export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}

export async function deletePath(targetPath: string): Promise<void> {
  if (await fs.pathExists(targetPath)) {
    await fs.remove(targetPath);
  }
}
