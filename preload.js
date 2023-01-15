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

contextBridge.exposeInMainWorld("list", {
    editTitle: (index, title) => {
        let data = readSave();
        data.data[index].title = title;
        data = JSON.stringify(data, null, 2);
        fs.writeFileSync(path.join(__dirname, "/src/save.json"), data);
    },
    addTask: (index) => {
        let data = readSave();
        data.data[index].items.push("New Task");
        data = JSON.stringify(data, null, 2);
        fs.writeFileSync(path.join(__dirname, "/src/save.json"), data);
    },
    editTask: (index, taskIndex, task) => {
        let data = readSave();
        data.data[index].items[taskIndex] = task;
        data = JSON.stringify(data, null, 2);
        fs.writeFileSync(path.join(__dirname, "/src/save.json"), data);
    }
})
