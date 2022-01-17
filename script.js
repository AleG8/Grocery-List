// ****** SELECT ITEMS **********
const alert = document.querySelector("#alert");
const form = document.querySelector("#form");
const groceryValue = document.querySelector("#grocery-value");
const submitBtn = document.querySelector("#submit-btn");
const listContainer = document.querySelector("#list-container");
const clearBtn = document.querySelector("#clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    addItem();
});
//Clear all button
clearBtn.addEventListener("click", ()=>{
    listContainer.innerHTML = "";
    localStorage.removeItem("items");
    displayAlert("All items have been removed","success");
});
//load items
window.addEventListener("DOMContentLoaded", ()=>{
    let items = localStorage.getItem("items");
    if(items && JSON.parse(items).length > 0){
        JSON.parse(items).forEach(elem =>{
            createElementList(elem.id, elem.value);
        });
    };
})

// ****** FUNCTIONS **********
//Add ITEM
function addItem(){
    let value = groceryValue.value;
    let id = new Date().getTime();
    if(value && !editFlag){
        //Create element
        createElementList(id, value);
        displayAlert("Item successfully added", "success");
        backToDefault();
        addItemToStorage(id, value);
    }else if(value && editFlag){
        if(value === editElement.firstElementChild.textContent){
            displayAlert("No changes", "success");
        }else if(value.length === 0 ){
            displayAlert("Value is empty", "danger");
        }else{
            displayAlert("Item successfully edited", "success");
            editElement.firstElementChild.textContent = value;
            editItemFromStorage(editID, value);
        };
        backToDefault();
    }else{
        displayAlert("Value is empty!", "danger");
        backToDefault();
    };
}

//Display alert
function displayAlert(value, type){
    alert.textContent = value;
    alert.style.visibility = "visible";
    alert.classList.add(`alert-${type}`);

    setTimeout(()=>{
        alert.style.visibility = "hidden";
        alert.classList = "";
    }, 1500)
};
//Reset values
function backToDefault(){
    groceryValue.value = "";
    submitBtn.textContent = "Submit";
    editFlag = false;
};
//Create element
function createElementList(id, value){
    //*Data ID
    let att = document.createAttribute("data-id");
    att.value = id;
    //*Create item
    let article = document.createElement("article");
    article.classList.add("list-item");
    article.setAttributeNode(att);
    article.innerHTML = `
        <p class="item-name">${value}</p>
        <div class="icons">
            <ion-icon name="create" class="edit-item-btn"></ion-icon>
            <ion-icon name="trash" class="clear-item-btn"></ion-icon>
        </div> 
     `;
    //AppendChild Article
    listContainer.appendChild(article);
    //*Edit button
    document.querySelectorAll(".edit-item-btn").forEach(item =>{
        item.addEventListener("click", (e)=>{
            editElement = e.currentTarget.parentElement.parentElement;
            groceryValue.value = editElement.firstElementChild.textContent;
            submitBtn.textContent = "Edit";
            editFlag = true;
            editID = editElement.dataset.id;
        });
    });
    //*Delete button
    document.querySelectorAll(".clear-item-btn").forEach(item =>{
        item.addEventListener("click", (e)=>{
            let child = e.currentTarget.parentElement
            .parentElement;
            let elementParent = child.parentElement;
            child.style.animation = "deleteItem 0.5s ease-in infinite";
            setTimeout(()=>{
                removeFromLocalStorage(child.dataset.id);
                elementParent.removeChild(child);
            }, 450);
            displayAlert("Item removed","danger");
        });
    });
};

// ****** LOCAL STORAGE **********
//Add LocalStorage
function addItemToStorage(id, value){
    let grocery = {id, value};
    let items = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

    items.push(grocery);
    localStorage.setItem("items", JSON.stringify(items));
};
//Edit localStorage
function editItemFromStorage(id, value){
    let items = JSON.parse(localStorage.getItem("items"))
    .map(elem => {
        if(elem.id.toString() === id){
           elem.value = value;
        };
        return elem;
    });
    localStorage.setItem("items", JSON.stringify(items));
};
//Remove localStorage
function removeFromLocalStorage(id){
    let items = JSON.parse(localStorage.getItem("items"))
    .filter(elem=> elem.id.toString() !== id);
     localStorage.setItem("items", JSON.stringify(items));
};

