const mainDisplay = document.getElementById("mainDisplay");
const addListBtn = document.getElementById("addListBtn");
const viewModeBtn = document.getElementById("viewModeBtn");

// Read save.json data
const data = window.saveFile.load();

// list model
function createList(){
    let list = document.createElement("div");
    let btnDiv = document.createElement("div");
    let addBtn = document.createElement("button");
    let closeBtn =  document.createElement("button");

    list.classList.add("container", "bg-primary-subtle", "rounded-2", "m-0", "p-0");
    btnDiv.classList.add("bg-primary", "d-flex", "justify-content-between");
    addBtn.classList.add("btn", "btn-primary");
    closeBtn.classList.add("btn", "btn-primary");

    //
    addBtn.innerHTML = "+"
    closeBtn.innerHTML = "x";

    list.style.height = '300px';
    list.style.width = '180px';

    btnDiv.appendChild(addBtn);
    btnDiv.appendChild(closeBtn);
    list.appendChild(btnDiv);

    closeBtn.addEventListener("click", (e) => {
        window.saveFile.delete(e.target.closest(".container").getAttribute("test"));
        e.target.closest(".container").remove();
    });

    return list;
};

// Create list from data
for(let i = 0; i < data.length; i++){
    let list = createList();
    let title = document.createElement("p");
    let body = document.createElement("ul");

    list.setAttribute("test", i);
    title.innerHTML = data[i].title;

    for(let x = 0; x < data[i].items.length; x++){
        let item = document.createElement("li");
        item.innerHTML = data[i].items[x];
        body.appendChild(item);
    }
    list.appendChild(title);
    list.appendChild(body);
    mainDisplay.appendChild(list);

}

addListBtn.addEventListener("click", () => {
    const data = window.saveFile.load();
    let list = createList();
    let title = document.createElement("p");

    list.setAttribute("test", data.length);
    title.innerHTML = "New List"

    list.appendChild(title);
    mainDisplay.appendChild(list);

    window.saveFile.add({"title": "New List", "items": []});
});
