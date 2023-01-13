const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

contextBridge.exposeInMainWorld("saveFile", {
    load: () => JSON.parse(fs.readFileSync(path.join(__dirname, "/src/save.json"))).data,
});