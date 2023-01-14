const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

// read save file
function readSave(){
    return JSON.parse(fs.readFileSync(path.join(__dirname, "/src/save.json")));
}

contextBridge.exposeInMainWorld("saveFile", {
    load: () => readSave().data,
    add: (obj) => {
        let data = readSave();
        data.data.push(obj);
        data = JSON.stringify(data, null, 2);
        fs.writeFileSync(path.join(__dirname, "/src/save.json"), data);
    },
    delete: (index) => {
        let data = readSave();
        data.data.splice(index, 1);
        data = JSON.stringify(data, null, 2);
        fs.writeFileSync(path.join(__dirname, "/src/save.json"), data);
    }
});
