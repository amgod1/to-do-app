//Document is the DOM can be accessed in the console with document.window.
// Tree is from the top, html, body, p etc.

//Problem: User interaction does not provide the correct results.
//Solution: Add interactivity so the user can manage daily tasks.
//Break things down into smaller steps and take each step at a time.


// Event handling, user interaction is what starts the code execution.

var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder=document.getElementById("incompleteTasks");//ul of #incompleteTasks
var completedTasksHolder=document.getElementById("completed-tasks");//completed-tasks


//New task list item
var createNewTaskElement=function(taskString){

    var listItem=document.createElement("li");

    //input (checkbox)
    var checkBox=document.createElement("input");//checkbx
    //label
    var label=document.createElement("label");//label
    //input (text)
    var editInput=document.createElement("input");//text
    //button.edit
    var editButton=document.createElement("button");//edit button

    //button.delete
    var deleteButton=document.createElement("button");//delete button
    var deleteButtonImg=document.createElement("img");//delete button image

    label.innerText=taskString;
    label.className='task';

    //Each elements, needs appending
    checkBox.type="checkbox";
    editInput.type="text";
    editInput.className="task";

    editButton.innerText="Edit"; //innerText encodes special characters, HTML does not.
    editButton.className="edit";

    deleteButton.className="delete";
    deleteButtonImg.src='./remove.svg';
    deleteButton.appendChild(deleteButtonImg);


    //and appending.
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    return listItem;
}

var addTaskStorage=function(task){
    var listItem=createNewTaskElement(task);

    //Append listItem to incompleteTaskHolder
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    ajaxRequest()

}

var addTask=function(){
    //Create a new list item with the text from the #new-task:
    if (!taskInput.value) return;
    var listItem=createNewTaskElement(taskInput.value);
    
    //Append listItem to incompleteTaskHolder
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    taskInput.value="";
    startItems.todo.push(listItem.querySelector('.task').innerText)
    localStorage.setItem('todo', JSON.stringify(startItems))

}

//Edit an existing task.

var editTask=function(){


    var listItem=this.parentNode;

    var editInput=listItem.querySelector('input[type=text]');
    var label=listItem.querySelector("label");
    var editBtn=listItem.querySelector(".edit");
    var containsClass=listItem.classList.contains("editMode");
    //If class of the parent is .editmode

    let old = listItem.querySelector('.task').innerText

    if(containsClass){
        //switch to .editmode
        //label becomes the inputs value.
        label.innerText=editInput.value;
        editBtn.innerText="Edit";
    }else{
        editInput.value=label.innerText;
        editBtn.innerText="Save";
    }

    if (startItems.todo.includes(old)) {
        startItems.todo.splice(startItems.todo.indexOf(old), 1, editInput.value)
    } else {
        startItems.completed.splice(startItems.completed.indexOf(old), 1, editInput.value)
    }

    localStorage.setItem('todo', JSON.stringify(startItems))


    //toggle .editmode on the parent.
    listItem.classList.toggle("editMode");
};


//Delete task.
var deleteTask=function(){

    var listItem=this.parentNode;
    var ul=listItem.parentNode;

    if (ul.id === 'completed-tasks') {
        let deleted = listItem.querySelector('.task').innerText
        startItems.completed.splice(startItems.completed.indexOf(deleted), 1)
    } else {
        let deleted = listItem.querySelector('.task').innerText
        startItems.todo.splice(startItems.todo.indexOf(deleted), 1)
    }
    //Remove the parent list item from the ul.
    ul.removeChild(listItem);
    localStorage.setItem('todo', JSON.stringify(startItems))
}


//Mark task completed
var taskCompletedStorage=function(task){

    //Append the task list item to the #completed-tasks
    var listItem=createNewTaskElement(task);

    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);

}

var taskCompleted=function(){

    //Append the task list item to the #completed-tasks
    var listItem=this.parentNode;

    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);

    let deleted = listItem.querySelector('.task').innerText
    startItems.todo.splice(startItems.todo.indexOf(deleted), 1)
    startItems.completed.push(deleted)
    localStorage.setItem('todo', JSON.stringify(startItems))

}


var taskIncomplete=function(){
    //Mark task as incomplete.
    //When the checkbox is unchecked
    //Append the task list item to the #incompleteTasks.
    var listItem=this.parentNode;
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem,taskCompleted);

    let deleted = listItem.querySelector('.task').innerText
    startItems.completed.splice(startItems.todo.indexOf(deleted), 1)
    startItems.todo.push(deleted)
    localStorage.setItem('todo', JSON.stringify(startItems))

}



var ajaxRequest=function(){
    console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
addButton.onclick=addTask;
addButton.addEventListener("click",addTask);
addButton.addEventListener("click",ajaxRequest);


var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
    //select ListItems children
    var checkBox=taskListItem.querySelector("input[type=checkbox]");
    var editButton=taskListItem.querySelector("button.edit");
    var deleteButton=taskListItem.querySelector("button.delete");


    //Bind editTask to edit button.
    editButton.onclick=editTask;
    //Bind deleteTask to delete button.
    deleteButton.onclick=deleteTask;
    //Bind taskCompleted to checkBoxEventHandler.
    checkBox.onchange=checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
//for each list item
for (var i=0; i<incompleteTaskHolder.children.length;i++){

    //bind events to list items chldren(tasksCompleted)
    bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
}


//cycle over completedTasksHolder ul list items
for (var i=0; i<completedTasksHolder.children.length;i++){
    //bind events to list items chldren(tasksIncompleted)
    bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}

// Issues with usability don't get seen until they are in front of a human tester.

//prevent creation of empty tasks.

//Change edit to save when you are in edit mode.

let startItems = (!!localStorage.todo) 
    ? JSON.parse(localStorage.todo) 
    : {todo: ['Pay bills', 'Go Shopping'], completed: ['See the Doctor']}

localStorage.setItem('todo', JSON.stringify(startItems))

startItems.todo.map(task => addTaskStorage(task))
startItems.completed.map(task => taskCompletedStorage(task))