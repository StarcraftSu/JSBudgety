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

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
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
        inputBtn:'.add__btn'
    };

    return {
        getinput:function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,//will be either increase or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value

            };
        },

        getDOMstrings:function(){
            return DOMstrings;
        },

        addListItem:function(obj,type){
            var html;
            //Create HTML string with placeholder text
            if(type === 'inc'){
                html = '<div class="item clearfix" id="income-0"> <div class="item__description">Salary</div><div class="right clearfix"><div class="item__value">+ 2,100.00</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                html = '<div class="item clearfix" id="expense-0"><div class="item__description">Apartment rent</div><div class="right clearfix"><div class="item__value">- 900.00</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            //Replace the placeholder text with some actual data

            //Insert the HTML into the DOM
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
    }

    var ctrlAddItem = function(){
        
        var input,newItem;
        //1.Get input data

        input = UICtrl.getinput();

        //2.Add the item to the budget controller

        newItem = budgetCtrl.addItem(input.type,input.description,input.value);
        budgetCtrl.testing();

        //3.Add the item to the UI

        //4.alculate the budget

        //5.Display the budget on the UI
    }

    return {
        init:function(){
            setEventListeners();
        }
    };

})(budgetController,UIController);

controller.init();