const { app, BrowserWindow } = require("electron");

let win = null;

const createWindow = () => {
    win = new BrowserWindow({
        //frame:false,
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile("index.html");
};

app.whenReady().then(() => {
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