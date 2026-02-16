import { IpcMain } from "electron";
import { getSystemInfo } from "../system/systemInfo";
import { readLogs, clearLogs, log } from "../logs/logService";
import { loadConfig, saveConfig } from "../config/configService";
import { listDirectory, readTextFile, writeTextFile, deletePath } from "../fs/fileService";
import { runChat } from "../ai/aiRuntime";

export function registerCoreIpcHandlers(ipcMain: IpcMain) {
  ipcMain.handle("core:getSystemInfo", async () => {
    return getSystemInfo();
  });

  ipcMain.handle("core:getLogs", async (_event, limit?: number) => {
    return readLogs(limit);
  });

  ipcMain.handle("core:clearLogs", async () => {
    await clearLogs();
    return true;
  });

  ipcMain.handle("core:writeLog", async (_event, type: "info" | "warn" | "error" | "system", message: string) => {
    log(type, message);
    return true;
  });

  ipcMain.handle("core:getConfig", async () => {
    return loadConfig();
  });

  ipcMain.handle("core:saveConfig", async (_event, config) => {
    await saveConfig(config);
    return true;
  });

  ipcMain.handle("core:listDirectory", async (_event, dir: string) => {
    return listDirectory(dir);
  });

  ipcMain.handle("core:readTextFile", async (_event, filePath: string) => {
    return readTextFile(filePath);
  });

  ipcMain.handle("core:writeTextFile", async (_event, filePath: string, content: string) => {
    await writeTextFile(filePath, content);
    return true;
  });

  ipcMain.handle("core:deletePath", async (_event, targetPath: string) => {
    await deletePath(targetPath);
    return true;
  });

  ipcMain.handle("core:aiChat", async (_event, messages) => {
    return runChat(messages);
  });
}
