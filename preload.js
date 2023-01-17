const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

// read save file
function readSave(){
    return JSON.parse(fs.readFileSync(path.join(__dirname, "/src/save.json")));
}

// save function to eliminate redundant code
function save(data){
    let file = JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(__dirname, "/src/save.json"), file);
}

contextBridge.exposeInMainWorld("program", {
    exit: () => ipcRenderer.invoke("exit"),
    viewMode: () => null,
})

contextBridge.exposeInMainWorld("saveFile", {
    load: () => readSave().data,
    add: (obj) => {
        let data = readSave();
        data.data.push(obj);
        save(data);
    },
    duplicate: (index) => {
        let data = readSave();
        data.data.splice(index, 0, data.data[index]);
        save(data);
    },
    delete: (index) => {
        let data = readSave();
        data.data.splice(index, 1);
        save(data);
    }
});

contextBridge.exposeInMainWorld("list", {
    editTitle: (index, title) => {
        let data = readSave();
        data.data[index].title = title;
        save(data);
    },
    addTask: (index) => {
        let data = readSave();
        data.data[index].items.push("New Task");
        save(data);
    },
    editTask: (index, taskIndex, task) => {
        let data = readSave();
        data.data[index].items[taskIndex] = task;
        save(data);
    },
    deleteTask: (index, taskIndex) => {
        let data = readSave();
        data.data[index].items.splice(taskIndex, 1);
        save(data);
    },
})
