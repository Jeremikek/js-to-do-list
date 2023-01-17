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
    viewMode: () => ipcRenderer.invoke("dark-mode:toggle"),
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
    editColor: (index, color) => {
        let data = readSave();
        data.data[index].properties.color = color;
        save(data);
    },
    addTask: (index) => {
        let data = readSave();
        data.data[index].items.push({"name": "New Task", "checked":false});
        save(data);
    },
    editTask: (index, taskIndex, task) => {
        let data = readSave();
        data.data[index].items[taskIndex].name = task;
        save(data);
    },
    deleteTask: (index, taskIndex) => {
        let data = readSave();
        data.data[index].items.splice(taskIndex, 1);
        save(data);
    },
    checkTask: (index, taskIndex) => {
        let data = readSave();
        data.data[index].items[taskIndex].checked = (data.data[index].items[taskIndex].checked) ? false : true;
        save(data); 
    }
})
