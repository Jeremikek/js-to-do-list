const mainDisplay = document.getElementById("mainDisplay");
const addListBtn = document.getElementById("addListBtn");
const viewModeBtn = document.getElementById("viewModeBtn");

// Read save.json data
const data = window.saveFile.load();

// input model
function createInput(className = []){
    let input = document.createElement("input");

    input.classList.add("form-control", ...className);

    input.style.background = "none";
    input.style.border= "none";

    return input;
}

// list model
function createList(){
    let list = document.createElement("div");
    let listFrame = document.createElement("div");
    let addBtn = document.createElement("button");
    let title = createInput(["title", "m-1"]);
    let closeBtn =  document.createElement("button");

    list.classList.add("container", "bg-primary-subtle", "rounded-2", "m-0", "p-0");
    listFrame.classList.add("bg-primary", "d-flex", "justify-content-between");
    addBtn.classList.add("btn", "btn-primary");
    closeBtn.classList.add("btn", "btn-primary");

    addBtn.innerHTML = "+"
    closeBtn.innerHTML = "x";
    title.value = "New List";

    list.style.height = '400px';
    list.style.width = '230px';

    listFrame.appendChild(addBtn);
    listFrame.appendChild(title);
    listFrame.appendChild(closeBtn);
    list.appendChild(listFrame);

    // close button event
    closeBtn.addEventListener("click", (e) => {
        window.saveFile.delete(e.target.closest(".container").getAttribute("index"));
        e.target.closest(".container").remove();
    });

    // edit title event
    title.addEventListener("focusout", (e) => {
        const index = e.target.closest(".container").getAttribute("index");
        window.list.editTitle(index, e.target.value);
    });

    // add button event
    addBtn.addEventListener("click", (e) => {
        const data = window.saveFile.load();
        let task = createInput();
        let taskDiv = document.createElement("li");

        task.value = "New Task";
        task.setAttribute("itemIndex", data[e.target.closest(".container").getAttribute("index")].items.length);

        window.list.addTask(e.target.closest(".container").getAttribute("index"));
        
        taskDiv.appendChild(task);
        e.target.parentNode.nextSibling.firstChild.appendChild(taskDiv);
    });

    return list;
};

// Create list from data
for(let i = 0; i < data.length; i++){
    let list = createList();
    let title = list.querySelector(".title");
    let body = document.createElement("div");
    let tasks = document.createElement("ul");

    body.classList.add("p-1");
    tasks.classList.add("tasks");

    list.setAttribute("index", i);
    title.value = data[i].title;

    for(let x = 0; x < data[i].items.length; x++){
        let itemDiv = document.createElement("li");
        let item = document.createElement("input");

        item.classList.add("form-control");

        item.style.background = "none";
        item.style.border = "none";

        item.setAttribute("itemIndex", x);
        item.value = data[i].items[x];

        itemDiv.appendChild(item);
        tasks.appendChild(itemDiv);
    }

    body.appendChild(tasks);
    list.appendChild(body);
    mainDisplay.appendChild(list);
}

addListBtn.addEventListener("click", () => {
    const data = window.saveFile.load();
    let list = createList();
    let title = document.createElement("p");

    list.setAttribute("index", data.length);

    list.appendChild(title);
    mainDisplay.appendChild(list);

    window.saveFile.add({"title": "New List", "items": []});
});
