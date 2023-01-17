const notification = document.getElementById("notification");
const mainDisplay = document.getElementById("mainDisplay");
const addListBtn = document.getElementById("addListBtn");
const viewModeBtn = document.getElementById("viewModeBtn");
const exitBtn = document.getElementById("exitBtn");

// handle notification
async function handleNotification(text) {
    notification.classList.remove('d-none');
    notification.innerHTML = text;

    setTimeout(() => {
        notification.classList.add('d-none');
    }, 3000);
}

// button model
function createButton(text = "", className = []){
    let button = document.createElement("button");
    button.classList.add("btn", ...className);

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
        window.list.deleteTask(e.target.closest(".list").getAttribute("index"), itemDiv.getAttribute("itemIndex"));

        e.target.parentNode.remove();
    });

    // edit task event
    item.addEventListener("focusout", (e) => {
        window.list.editTask(e.target.closest(".list").getAttribute("index"), itemDiv.getAttribute("itemIndex"), e.target.value);
    });

    return itemDiv;
}

// option dropdown model
function createOption() {
    let dropdownMenu = document.createElement("div");
    let duplicateAction = document.createElement("a");
    let colorAction = document.createElement("a");

    dropdownMenu.classList.add("dropdown-menu");
    duplicateAction.classList.add("dropdown-item");
    colorAction.classList.add("dropdown-item");

    dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
    duplicateAction.innerHTML = "Duplicate"
    colorAction.innerHTML = "Color"

    dropdownMenu.appendChild(duplicateAction);
    dropdownMenu.appendChild(colorAction);

    // duplicate event
    duplicateAction.addEventListener("click", (e) => {
        console.log(e.target.closest(".list").getAttribute("index"));
        window.saveFile.duplicate(e.target.closest(".list").getAttribute("index"));
        //mainDisplay.innerHTML = "";
        //createDisplay();
    });

    return dropdownMenu;
}

// list model
function createList(){
    let list = document.createElement("div");
    let listFrame = document.createElement("div");
    let addBtn = createButton("+");
    let title = createInput("New List", ["title", "m-1", "text-white"]);
    let optionDropdown = document.createElement("div");
    let optionsBtn = createButton();
    let optionIcon = document.createElement("i");
    let optionList = createOption();
    let closeBtn =  createButton("x");

    list.classList.add("container", "bg-primary-subtle", "rounded-2", "m-0", "p-0", "list");
    listFrame.classList.add("bg-primary", "d-flex", "align-content-center");
    optionDropdown.classList.add("dropdown", "d-flex", "justify-content-center");
    optionIcon.classList.add("bi", "bi-three-dots-vertical");

    optionsBtn.type = "button"
    optionsBtn.id = "dropdownMenuButton";
    optionsBtn.setAttribute("data-bs-toggle", "dropdown");
    optionsBtn.setAttribute("aria-haspopup", "false");
    optionsBtn.setAttribute("aria-expanded", "false");

    list.style.height = '400px';
    list.style.width = '230px';

    listFrame.appendChild(addBtn);
    listFrame.appendChild(title);
    optionsBtn.appendChild(optionIcon);
    optionDropdown.appendChild(optionsBtn);
    optionDropdown.appendChild(optionList);
    listFrame.appendChild(optionDropdown);
    listFrame.appendChild(closeBtn);
    list.appendChild(listFrame);

    // close button event
    closeBtn.addEventListener("click", (e) => {
        window.saveFile.delete(e.target.closest(".list").getAttribute("index"));
        e.target.closest(".list").remove();
    });

    // edit title event
    title.addEventListener("focusout", (e) => {
        const index = e.target.closest(".list").getAttribute("index");
        window.list.editTitle(index, e.target.value);
    });

    // add button event
    addBtn.addEventListener("click", (e) => {
        const data = window.saveFile.load();

        let itemDiv = createTask("New Task");

        itemDiv.setAttribute("itemIndex", data[e.target.closest(".list").getAttribute("index")].items.length);

        window.list.addTask(e.target.closest(".list").getAttribute("index"));
        
        e.target.parentNode.nextSibling.appendChild(itemDiv);
    });

    return list;
};

// Create list from data
function createDisplay() {
    // Read save.json data
    const data = window.saveFile.load();

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
}

createDisplay();

// adding event
addListBtn.addEventListener("click", () => {
    const data = window.saveFile.load();
    let list = createList();
    let body = document.createElement("div");

    body.classList.add("px-2");

    list.setAttribute("index", data.length);

    list.appendChild(body);
    mainDisplay.appendChild(list);

    window.saveFile.add({"title": "New List", "items": []});

    handleNotification("New List added")
});

exitBtn.addEventListener("click", async () => {
    window.program.exit();
});
