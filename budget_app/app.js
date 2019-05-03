//budget Controller
const budgetController = (function(){
    
    const Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100) ;
        }else{
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    const Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(elem => {
            sum += elem.value;
        });
        data.totals[type] = sum;

    }
    // dataStructure for all values
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    //public functions for budget
    return {
        addItem: function(type, des, val){
            let newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create newItem based on 'inc' or 'exp'
            if (type == 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type == 'inc'){
                newItem = new Income(ID, des, val);
            }
            //add new item to dataStructure
            data.allItems[type].push(newItem);
            //return new item 
            return newItem;
        },
        deleteItem: function(type, id){
            let ids, index;

            ids = data.allItems[type].map(elem => {
                return elem.id;
            });
            index = ids.indexOf(id);
            if (index != -1){
                data.allItems[type].splice(index, 1);
            }


        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of the income that we spent
            if (data.totals.inc > 0){
                data.percentage = Math.floor((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = 0;
            }

        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }

        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(elem => {
                elem.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            const allPercentages = data.allItems.exp.map(elem => {
                return elem.getPercentage();
            });
            return allPercentages;
        },
        testing: function(){
            console.log(data);
        }

    }
})();

//UI controller
const UIController = (function(){

    const domString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        submit: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    }
    // const formatNumber =  function(num, type){
    //     let numSplit, inc, dec;

    //     num  = Math.abs(num);
    //     num = num.toFixed(2);
    //     numSplit = num.split('.');
    //     int = numSplit[0];
    //     if (int.length > 3){
    //         int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    //     }
    //     dec = numSplit[1];
    //     return (type == 'exp' ? '-' : '+') + ' ' + inc + "." +  dec;
    // };

    return{
        getInput: function (){
            return {
                type: document.querySelector(domString.inputType).value, // 'inc' or 'exp'
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value)
            }
        },
        addListItem: function(obj, type){
            let html1 , element;
            //1. create html string with placeholder text
            //2. replace the placeholder text with some actual data

            if (type == 'inc'){
                element = domString.incomeContainer;
                html1 = `<div class="item clearfix" id="inc-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">+${obj.value}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
                    
            }else{
                element = domString.expenseContainer;
                html1 =  `<div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">-${obj.value}</div>
                                <div class="item__percentage">10%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }

            //3. insert html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', html1);
        },
        deleteListItem: function(selectorId){
            const el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);


        },
        getDomString: function(){
            return domString;
        },
        clearFields: function (){
            let fields;
            fields = document.querySelectorAll(`${domString.inputDescription}, ${domString.inputValue}`);
            fields = Array.from(fields);
            fields.forEach(elem => {
                elem.value = "";
            });
            fields[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(domString.budgetLabel).textContent = obj.budget;
            document.querySelector(domString.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domString.expenseLabel).textContent = obj.totalExp;
            if (obj.percentage > 0){
                document.querySelector(domString.percentage).textContent = `${obj.percentage}%`;
            }else{
                document.querySelector(domString.percentage).textContent = `-`;
            }
        },
        displayPercentages: function(percentages){
            let fields = document.querySelectorAll(domString.expensesPercLabel);
            fields = Array.from(fields);
            fields.forEach((elem, index) => {
                if (percentages[index] > 0){
                    elem.textContent = `${percentages[index]}%`;
                }else{
                    elem.textContent = `--`;
                }
            });
        },
        changedType: function(){
            let fields = document.querySelectorAll(domString.inputType + ',' + domString.inputDescription + ',' + domString.inputValue);
            fields = Array.from(fields);
            fields.forEach(elem => {
                elem.classList.toggle('red-focus');
            });
            document.querySelector(domString.submit).classList.toggle('red');
        }
        

    }
})();

//AppCtrl
var AppCtrl = (function(budgetCtrl, UICtrl){

    //set event listeners
    const setupEventListeners = function(){

        //event listener for submit button
        document.querySelector(domStrings.submit).addEventListener('click', ctrlAddItem);
        
        //event listener if 'enter' pressed instead of submit button
        // document.addEventListener('keypress', function(e){
        //     if (e.keyCode == 13 || e.which == 13){
        //         ctrlAddItem();  
        //     }
        // });

        document.querySelector(domStrings.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(domStrings.inputType).addEventListener('change', UICtrl.changedType);

    };

   
    
    //get domstrings
    const domStrings = UICtrl.getDomString();
    //calculate and update budget
    const updateBudget = function(){
        //1. calculate budget
        budgetCtrl.calculateBudget();
        //2. return budget
        const budget = budgetCtrl.getBudget();

        //3. display budget on ui
        UICtrl.displayBudget(budget);
    }

    //update percentage
    const updatePercentages = function(){
        //1. calculate percentage
        budgetCtrl.calculatePercentages();

        //2. read percentage from the budget controller
        const percentages = budgetCtrl.getPercentages();
        //3. update ui with the new percentage
        UICtrl.displayPercentages(percentages);


    }
    const ctrlAddItem = function(){
        let input, newItem;
        //1. get filled input data
        input = UICtrl.getInput();

        if (input.description != "" && !isNaN(input.value) && input.value > 0){

            //2. add item to budget controller
            item = budgetController.addItem(input.type, input.description, input.value);
            //3. add item to ui
            UICtrl.addListItem(item, input.type);
            UICtrl.clearFields();

            //4. calculate and update budget in UI
            updateBudget();

            //5. calculate and update percentage
            updatePercentages();
        }
    }
     //cntrlDeleteItem
     const ctrlDeleteItem = function(e){
        let itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){
             let splitId = itemId.split('-');
             let type = splitId[0];
             let id = parseInt(splitId[1]);

             //1.delete item from dataStructure
             budgetCtrl.deleteItem(type, id);

             //2.delete item from UI
             UICtrl.deleteListItem(itemId);
             

            //3. update and show the new budget
            updateBudget();
               //4. calculate and update percentage
               updatePercentages();

        }
        
    };
    


    
    return {
        init: function(){
            console.log('Application has started ...');
            setupEventListeners();
            document.querySelector(domStrings.budgetLabel).textContent = "";
            document.querySelector(domStrings.incomeLabel).textContent = "";
            document.querySelector(domStrings.expenseLabel).textContent = "";
            document.querySelector(domStrings.percentage).textContent = ``;
            
        }
   

    }
})(budgetController, UIController);

//start
AppCtrl.init();




