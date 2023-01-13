const mainDisplay = document.getElementById("mainDisplay");

// Read save.json data
const data = window.saveFile.load();

// Create checklist from data
for(let i = 0; i < data.length; i++){
    let checkList = document.createElement("div");
    let title = document.createElement("p");
    let body = document.createElement("ul");

    checkList.classList.add("container", "bg-primary-subtle", "rounded-2", "m-0");

    checkList.style.height = '300px';
    checkList.style.width = '180px';

    title.innerHTML = data[i].title;

    for(let x = 0; x < data[i].items.length; x++){
        let item = document.createElement("li");
        item.innerHTML = data[i].items[x];
        body.appendChild(item);
    }
    checkList.appendChild(title);
    checkList.appendChild(body);
    mainDisplay.appendChild(checkList);
}