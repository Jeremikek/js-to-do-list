const bg = document.getElementById("bg");
const sidebar = document.getElementById("sidebar");
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
function createTask(text = "", checked = false){
    let itemDiv = document.createElement("div");
    let checkBox = document.createElement("input");
    let item = createInput(text);
    let delBtn = createButton("x");

    itemDiv.classList.add("d-flex", "my-1","align-items-baseline");
    checkBox.classList.add("form-check-input");

    checkBox.type = "checkbox";
    checkBox.checked = checked;

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

    // check event
    checkBox.addEventListener("click", (e) => {
        window.list.checkTask(e.target.closest(".list").getAttribute("index"), itemDiv.getAttribute("itemIndex"));
    });

    return itemDiv;
}

// option dropdown model
function createOption() {
    let dropdownMenu = document.createElement("div");
    let duplicateAction = document.createElement("a");
    let colorDropdown = document.createElement("div");
    let colorBtn = createButton("Color", ["dropdown-item"]);
    let colorMenu = document.createElement("div");

    let colors = ["primary", "danger", "warning", "success"];
    colorItems = colors.map(color => {
         let obj = document.createElement("a");
         obj.classList.add("dropdown-item", "text-white");
         obj.innerHTML = color;
         return obj;
    });
    let [blue, red, yellow, green] = colorItems;

    blue.classList.add("bg-primary");
    red.classList.add("bg-danger");
    yellow.classList.add("bg-warning");
    green.classList.add("bg-success");
    dropdownMenu.classList.add("dropdown-menu");
    duplicateAction.classList.add("dropdown-item");
    colorMenu.classList.add("dropdown-menu", "dropdown-submenu");

    dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
    duplicateAction.innerHTML = "Duplicate"

    colorMenu.style.display = "none";
    colorMenu.style.position = "absolute";
    colorMenu.style.right = "100%";
    colorMenu.style.top = "0";

    dropdownMenu.appendChild(duplicateAction);
    colorItems.map(color => { colorMenu.appendChild(color); });
    colorDropdown.appendChild(colorBtn);
    colorDropdown.appendChild(colorMenu);
    dropdownMenu.appendChild(colorDropdown);

    // duplicate event
    duplicateAction.addEventListener("click", (e) => {
        const index = e.target.closest(".list").getAttribute("index");
        window.saveFile.duplicate(index);
        mainDisplay.innerHTML = "";
        createDisplay();
    });

    colorDropdown.addEventListener("mouseover", (e) => {
        colorMenu.style.display = "block";
    });

    colorDropdown.addEventListener("mouseout", () => {
        colorMenu.style.display = "none";
    });

    colorItems.map((item, i) => {
        item.addEventListener("click", (e) => {
            const index = e.target.closest(".list").getAttribute("index");
            window.list.editColor(index, colors[i]);
            // remove bg
            e.target.closest(".list").classList.remove("bg-primary-subtle", "bg-danger-subtle", "bg-warning-subtle", "bg-success-subtle");
            e.target.closest(".frame").classList.remove("bg-primary", "bg-danger", "bg-warning", "bg-success");
            // add bg
            e.target.closest(".list").classList.add(`bg-${colors[i]}-subtle`);
            e.target.closest(".frame").classList.add(`bg-${colors[i]}`);
        });
    });

    return dropdownMenu;
}

// list model
function createList(color = "primary"){
    // body of list 
    let list = document.createElement("div");
    // top frame
    let listFrame = document.createElement("div");
    // add button
    let addBtn = createButton("+");
    // title
    let title = createInput("New List", ["title", "m-1", "text-white"]);
    // option button
    let optionDropdown = document.createElement("div");
    let optionsBtn = createButton();
    let optionIcon = document.createElement("i");
    let optionList = createOption();
    // close button
    let closeBtn =  createButton("x");

    list.classList.add("container", "rounded-2", "m-0", "p-0", "list", "shadow");
    listFrame.classList.add("d-flex", "align-content-center", "frame");
    optionDropdown.classList.add("dropdown", "d-flex", "justify-content-center");
    optionIcon.classList.add("bi", "bi-three-dots-vertical");

    optionsBtn.type = "button"
    optionsBtn.id = "dropdownMenuButton";
    optionsBtn.setAttribute("data-bs-toggle", "dropdown");
    optionsBtn.setAttribute("aria-haspopup", "false");
    optionsBtn.setAttribute("aria-expanded", "false");

    list.style.height = '400px';
    list.style.width = '230px';

    // set color based on color properties
    list.classList.add(`bg-${color}-subtle`);
    listFrame.classList.add(`bg-${color}`);

    listFrame.appendChild(addBtn);
    listFrame.appendChild(title);
    optionsBtn.appendChild(optionIcon);
    optionDropdown.appendChild(optionsBtn);
    optionDropdown.appendChild(optionList);
    listFrame.appendChild(optionDropdown);
    listFrame.appendChild(closeBtn);
    list.appendChild(listFrame);

    // close button event (cant think of a better way to do it now)
    closeBtn.addEventListener("click", (e) => {
        window.saveFile.delete(e.target.closest(".list").getAttribute("index"));
        mainDisplay.innerHTML = "";
        createDisplay();
        handleNotification("List Deleted");
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
        let list = createList(data[i].properties.color);
        let title = list.querySelector(".title");
        let body = document.createElement("div");

        body.classList.add("px-2");

        list.setAttribute("index", i);
        title.value = data[i].title;

        for(let x = 0; x < data[i].items.length; x++){
            let itemDiv = createTask(data[i].items[x].name, data[i].items[x].checked);

            itemDiv.setAttribute("itemIndex", x);

            body.appendChild(itemDiv);
        }

        list.appendChild(body);
        mainDisplay.appendChild(list);
    }
}

function checkTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        bg.classList.replace("bg-secondary-subtle", "bg-dark"); 
        sidebar.classList.replace("bg-primary", "bg-secondary");
        document.getElementById("viewIcon").classList.replace("bi-brightness-high", "bi-moon");
    }
}

createDisplay();
checkTheme();

// adding event
addListBtn.addEventListener("click", () => {
    const data = window.saveFile.load();
    let list = createList();
    let body = document.createElement("div");

    body.classList.add("px-2");

    list.setAttribute("index", data.length);

    list.appendChild(body);
    mainDisplay.appendChild(list);

    window.saveFile.add({"title": "New List", "items": [], "properties": { "color": "primary" }});

    handleNotification("New List added")
});

viewModeBtn.addEventListener("click", async () => {
    const isDarkMode = await window.program.viewMode();
    if(isDarkMode) {
        bg.classList.replace("bg-secondary-subtle", "bg-dark"); 
        sidebar.classList.replace("bg-primary", "bg-secondary");
        document.getElementById("viewIcon").classList.replace("bi-brightness-high", "bi-moon");
    }else{
        bg.classList.replace("bg-dark", "bg-secondary-subtle");
        sidebar.classList.replace("bg-secondary", "bg-primary");
        document.getElementById("viewIcon").classList.replace("bi-moon", "bi-brightness-high");
    }

    handleNotification("Dark Mode " + ((isDarkMode) ? "On" : "Off"));
});

exitBtn.addEventListener("click", async () => {
    window.program.exit();
});
