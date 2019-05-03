//STORAGE Controller
const StorageCtrl = (function(){

    //public methods
return {
    storeItem: function(item){
        let items;
        //check if any items in ls
        if (localStorage.getItem('items') == null){
            items = [];
            //push new item
            items.push(item);
            //set ls
            localStorage.setItem('items', JSON.stringify(items));
        }else{ 
            //get what is already in ls
            items = JSON.parse(localStorage.getItem('items'));
            //push new item
            items.push(item);
            //reset ls
            localStorage.setItem('items', JSON.stringify(items));
        }
    },
    getItemsFromStorage: function(){
        let items;
        if (localStorage.getItem('items') == null){
            items = [];
        }else{
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    },
    updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){
            if (updatedItem.id == item.id){
                items.splice(index, 1, updatedItem);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){
            if (id == item.id){
                items.splice(index, 1);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
        localStorage.removeItem('items');
    }
}
})();


// ITEM controller
const ItemCtrl = (function (){
    //item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data structure / STATE
    const data = {
        // items: [
        //     // {id : 0, name : 'Steak Dinner', calories: 1200},
        //     // {id : 1, name : 'Cookies', calories: 500},
        //     // {id : 0, name : 'Breakfast', calories: 800}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    //public methods
    return {
        logData : function(){
            return data;
        },
        addItem: function(name, calories){
            let ID;
            //create ID
            if (data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            //parse calories to number
            calories = parseInt(calories);

            //create new item
            const newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);

            return newItem;
        },
        updateItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(item => {
                if (item.id == data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        deleteItem: function(id){
            //get ids
            const ids = data.items.map(item =>{
                return item.id;
            });
            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            //set total cal in data structure
            data.totalCalories = total;
            //return total 
            return data.totalCalories;
        },
        getItemById: function(id){
            let found = null;
            //loop through items
            data.items.forEach(item => {
                if (item.id === id){
                    found = item;
                }
            });
            return found;
        },
        getCurrentItem : function(){
            return data.currentItem;
        },
        setCurrentItem:function(item){
            data.currentItem = item;
        },
        getItems: function(){
            return data.items;
        },
        clearAllItems: function(){
            data.items = [];
        }
    }
})();

// UI controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        clearBtn: '.clear-btn',
        totalCalories: '.total-calories'
    }

    //public methods
    return {
        populateItemList: function(items){
            let html = "";

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content "><i class=" edit-item fa fa-pencil-alt"></i>
                </a>
                        </li>`
                });
            // insert item into list
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element.
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil-alt"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
            
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";

        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = "inline";
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";

        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = "none";
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";

            
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn nodelist into array;
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');
                if (itemID == `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i></a>`;
                }
            });
        },
        getSelectors: function(){
            return UISelectors;
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn nodelist into array
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                item.remove();
            });
        }

    }
})();


//App controller
const App = (function(ItemCtrl, StorageCtrl,UICtrl){
    //load event listeners
    const loadEventListeners = function (){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if (e.keyCode == 13 || e.which == 13){
            e.preventDefault();
            return false;
            }
        });

        

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

         //back button event
         document.querySelector(UISelectors.backBtn).addEventListener('click', back);

          //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);


          //clear item event
          document.querySelector(UISelectors.clearBtn).addEventListener('click', ClearAllItemsClicked);


    }

    //back button
    const back = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //item delete submit
    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //delete item from Data Structure
        ItemCtrl.deleteItem(currentItem.id);
        //delete from Ui
        UICtrl.deleteListItem(currentItem.id);
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showCalories(totalCalories);
        //delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearInput();
        UICtrl.clearEditState();

        e.preventDefault();
    }
    //add item submit
    const itemAddSubmit = function(e){
        //get form input from UI Controller
        const input = UICtrl.getItemInput();
        //check for name and calorie input
        if (input.name !== "" && input.calories !== ""){
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to UI list
            UICtrl.addListItem(newItem);
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showCalories(totalCalories);
            //store in localStorage
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    //  icon edit click
    const itemEditClick = function(e){
        if (e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break into an array
            const listIdArr = listId.split('-');
            //get actual id
            const id = parseInt(listIdArr[1]);
            //get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            //add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // item update submit
    const itemUpdateSubmit = function (e){
        //get item input
        const input = UICtrl.getItemInput();
        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        //update ui
        UICtrl.updateListItem(updatedItem);
         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add total calories to UI
         UICtrl.showCalories(totalCalories);
         //update local storage
         StorageCtrl.updateItemStorage(updatedItem);
         UICtrl.clearEditState();
        e.preventDefault();
    }
    //clear items event
    const ClearAllItemsClicked = function(e){
        //delete all items from data structure
        ItemCtrl.clearAllItems();
        //remove from ui
        UICtrl.removeItems();
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showCalories(totalCalories);
        StorageCtrl.clearItemsFromStorage();
        UICtrl.clearEditState();
        
        //hide ul
        UICtrl.hideList();
        e.preventDefault();

    }


    //public methods
    return {
        init: function(){
            //clear edit state // set initial state
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if there are initially any items
            if (items.length === 0){
                UICtrl.hideList();
            }else{
                 //populate list with items
                UICtrl.populateItemList(items);
            }
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showCalories(totalCalories);

            //load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
App.init();