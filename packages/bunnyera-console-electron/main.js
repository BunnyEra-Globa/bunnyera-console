const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // 优先加载 UI（5173）
  mainWindow.loadURL("http://localhost:5173").catch(() => {
    // 如果 UI 不在 5173，就尝试 5174（apps）
    mainWindow.loadURL("http://localhost:5174");
  });

  // 防止窗口被垃圾回收
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

// 关键：防止 Electron 自动退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
