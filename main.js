const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");

let win = null;

const createWindow = () => {
    win = new BrowserWindow({
        ///frame:false,
        width: 1200,
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile("index.html");

    ipcMain.handle("dark-mode:toggle", () => {
        if(nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = "light";
        }else{
            nativeTheme.themeSource = "dark";
        }
        return nativeTheme.shouldUseDarkColors;
    });
};

app.whenReady().then(() => {
    ipcMain.handle('exit', async () => app.quit());

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })