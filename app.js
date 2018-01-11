var budgetController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(val){
            sum += val.value;
        });
     data.totals[type] = sum;
    };

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1

    };

    return{
        addItem:function(type,des,val){
            var newItem,id;

            if(data.allItems[type].length>0){            
               id=data.allItems[type][data.allItems[type].length -1].id+1;
            }else{
                id=0;
            }


            if(type === 'exp'){
                newItem = new Expense(id,des,val);
            }else{
                 newItem = new Income(id,des,val);
            }

            data.allItems[type].push(newItem);

            return newItem;

        },

        deleteItem:function(type,id){
            var ids,index;
            ids = data.allItems[type].map(function(val){
                return val.id; 
            });

            index = ids.indexOf(id);

            if(index!==-1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget:function(){
            //Calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');
            //Calculate the budget:income-expenses
                data.budget = data.totals.inc-data.totals.exp;

            //Calculate the percentage of income that we spent
                if(data.totals.inc>0){
                    data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
  
                }else{
                    data.percentage = -1;
                }


        },

        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage

            };
        },

        testing:function(){
            console.log(data);
        }
    };

})();

var UIController = (function(){
    //private object
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container'

    };

    return {
        getinput:function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,//will be either increase or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value) 

            };
        },

        getDOMstrings:function(){
            return DOMstrings;
        },

        clearFields:function(){
            var fields,fieldsArr;
            //return nodelist rather than an array
            fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            //convert nodelist into array
            fieldsArr = [].slice.call(fields);
            //empty the input fields
            fieldsArr.forEach(function(val){
                 val.value = "";
            });
            // focus back on the input field
            fieldsArr[0].focus();
        },

        displayBudget:function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+"%";
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';   
            }


        },

        deleteListItem:function(selectorID){
            var child = document.getElementById(selectorID);
            child.parentNode.removeChild(child);
        },

        addListItem:function(obj,type){
            var html,newHtml,element;
            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            //Replace the placeholder text with some actual data

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);


            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);


        }

    };
})();

var controller = (function(budgetCtrl,UICtrl){

    var setEventListeners = function(){
            var DOM = UICtrl.getDOMstrings();
            
            document.querySelector(DOM.inputBtn).addEventListener("click",ctrlAddItem);
            
            document.addEventListener('keypress',function(e){
                if(e.keyCode === 13||e.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    }

    var updateBudget = function(){

        //1.Calculate the budget
        budgetCtrl.calculateBudget();
        //2.Return the budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        //3.Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
     
    var updatePercentages = function(){
        //1.calculate percentages

        //2.read percentages from the budget controller

        //3.update userinterface with the new percentages
    };

    var ctrlAddItem = function(){
        
        var input,newItem;
        //1.Get input data

        input = UICtrl.getinput();

        if(input.description!=="" && !isNaN(input.value) && input.value > 0){
        //2.Add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            budgetCtrl.testing();

            //3.Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //4.Clear the fields
            UICtrl.clearFields();

            //5.Calculate and update budget
            updateBudget();

            //6.Calculate and update percentages
            updatePercentages();
        }

    }

    var ctrlDeleteItem = function(e){
        var itemId,splitId,type,id;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            //1.Delete the item from the data structure
            budgetCtrl.deleteItem(type,id);

            //2.Delete the item from the UI
            UICtrl.deleteListItem(itemId)
            //3.Update and show the new budget
            updateBudget();
            //4.Calculate and update percentages
            updatePercentages();
        }
    }   

    return {
        init:function(){
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0});
            setEventListeners();
        }
    };

})(budgetController,UIController);

controller.init();