"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
    });
    win.loadFile("./src/index.html");
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin")
            electron_1.app.quit();
    });
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
