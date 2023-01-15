const mainDisplay = document.getElementById("mainDisplay");
const addListBtn = document.getElementById("addListBtn");
const viewModeBtn = document.getElementById("viewModeBtn");

// Read save.json data
const data = window.saveFile.load();

// button model
function createButton(text = "", className = []){
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary", ...className);

    button.innerHTML = text;

    return button;
}

// input model
function createInput(text = "", className = []){
    let input = document.createElement("input");

    input.classList.add("form-control", ...className);

    input.style.background = "none";
    input.style.border= "none";

    input.value = text;

    return input;
}

// task model
function createTask(text = ""){
    let itemDiv = document.createElement("div");
    let checkBox = document.createElement("input");
    let item = createInput(text);
    let delBtn = createButton("x");

    itemDiv.classList.add("d-flex", "my-1","align-items-baseline");
    checkBox.classList.add("form-check-input");

    checkBox.type = "checkbox";

    itemDiv.appendChild(checkBox);
    itemDiv.appendChild(item);
    itemDiv.appendChild(delBtn);

    // delete task event
    delBtn.addEventListener("click", (e) => {
        window.list.deleteTask(e.target.closest(".container").getAttribute("index"), itemDiv.getAttribute("itemIndex"));

        e.target.parentNode.remove();
    });

    // edit task event
    item.addEventListener("focusout", (e) => {
        window.list.editTask(e.target.closest(".container").getAttribute("index"), itemDiv.getAttribute("itemIndex"), e.target.value);
    });

    return itemDiv;
}

// list model
function createList(){
    let list = document.createElement("div");
    let listFrame = document.createElement("div");
    let addBtn = createButton("+");
    let title = createInput("New List", ["title", "m-1"]);
    let closeBtn =  createButton("x");

    list.classList.add("container", "bg-primary-subtle", "rounded-2", "m-0", "p-0");
    listFrame.classList.add("bg-primary", "d-flex", "justify-content-between");

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

        let itemDiv = createTask("New Task");

        itemDiv.setAttribute("itemIndex", data[e.target.closest(".container").getAttribute("index")].items.length);

        window.list.addTask(e.target.closest(".container").getAttribute("index"));
        
        e.target.parentNode.nextSibling.appendChild(itemDiv);
    });

    return list;
};

// Create list from data
for(let i = 0; i < data.length; i++){
    let list = createList();
    let title = list.querySelector(".title");
    let body = document.createElement("div");

    body.classList.add("px-2");

    list.setAttribute("index", i);
    title.value = data[i].title;

    for(let x = 0; x < data[i].items.length; x++){
        let itemDiv = createTask(data[i].items[x]);

        itemDiv.setAttribute("itemIndex", x);

        body.appendChild(itemDiv);
    }

    list.appendChild(body);
    mainDisplay.appendChild(list);
}

addListBtn.addEventListener("click", () => {
    const data = window.saveFile.load();
    let list = createList();
    let body = document.createElement("div");

    body.classList.add("px-2");

    list.setAttribute("index", data.length);

    list.appendChild(body);
    mainDisplay.appendChild(list);

    window.saveFile.add({"title": "New List", "items": []});
});
