const input = document.querySelector(".inputFiled");
const inputDate = document.querySelector(".inputDate");
const CheckBox = document.querySelector(".checkBox");
const button = document.querySelector(".addButton");
const searchInput = document.querySelector(".search-input");
let PendingArr = JSON.parse(localStorage.getItem("todoP")) || [];
let DoneArr = JSON.parse(localStorage.getItem("todoD")) || [];
let editIndex = -1; 

const render = () => {
  let pending = document.querySelector(".toDoTasksPending");
  let done = document.querySelector(".toDoTasksComplete");
  pending.innerHTML = "";
  done.innerHTML = "";

 
  PendingArr.forEach((obj, index) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <div class="tasks shadow-sm p-1 mb-2 rounded bg-body rounded">
        <ul class="mb-1 ps-2 ">
          <li>${index + 1}. ${obj.inputVal} - ${obj.DateValue}</li>
        </ul>
        <div class="buttons ms-2">
          <button type="button" class="btn btn-success" onClick="handleCompleteTodo(${index})">Complete</button>
          <button type="button" class="btn btn-warning" onClick="handleEditTodo(${index})">Edit</button>
          <button type="button" class="btn btn-danger delete" onClick="handleDeleteTodo(${index}, false)">Delete</button>
        </div>
      </div>
    `;
    pending.appendChild(div);
  });

  
  DoneArr.forEach((obj, index) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <div class="tasks shadow-sm p-1 mb-2 rounded bg-body rounded">
        <ul class="mb-1 ps-2 ">
          <li class="completed">${index + 1}. ${obj.inputVal} - ${
      obj.DateValue
    }</li>
        </ul>
        <div class="buttons ms-2">
          <button type="button" class="btn btn-success" onClick="handleUndoTodo(${index})">Undo</button>
          <button type="button" class="btn btn-warning" ${
            obj.checkBoxVal ? "disabled" : ""
          }>Edit</button>
          <button type="button" class="btn btn-danger delete" onClick="handleDeleteTodo(${index}, true)">Delete</button>
        </div>
      </div>
    `;
    done.appendChild(div);
  });
  saveData();
};

const fetchData = async () => {
  try {
      if (PendingArr.length === 0) {
          let url = "https://jsonplaceholder.typicode.com/todos?_start=0&_limit=8";
          const response = await fetch(url);
          const data = await response.json();
          data.forEach((e) => {
              let obj = {
                  inputVal: e.title,
                  DateValue: new Date().toISOString().split("T")[0],
                  checkBoxVal: e.completed
              };

              if (e.completed) {
                  DoneArr.push(obj);
              } else {
                  PendingArr.push(obj);
              }
          });

          saveData(); 
      }
      render();
  } catch (error) {
      console.error("Error fetching data:", error);
  }
};

const saveData = () => {
  localStorage.setItem("todoP", JSON.stringify(PendingArr));
  localStorage.setItem("todoD", JSON.stringify(DoneArr));
};

fetchData();


searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();

  if (searchText === "") {
   
    render();
    return;
  }

 
  const filteredPending = PendingArr.filter(task =>
    task.inputVal.toLowerCase().includes(searchText)
  );
  const filteredDone = DoneArr.filter(task =>
    task.inputVal.toLowerCase().includes(searchText)
  );

 
  renderFiltered(filteredPending, filteredDone);
});


const renderFiltered = (filteredPending, filteredDone) => {
  let pending = document.querySelector(".toDoTasksPending");
  let done = document.querySelector(".toDoTasksComplete");
  pending.innerHTML = "";
  done.innerHTML = "";

  filteredPending.forEach((obj, index) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <div class="tasks shadow-sm p-1 mb-2 rounded bg-body rounded">
        <ul class="mb-1 ps-2 ">
          <li>${index + 1}. ${obj.inputVal} - ${obj.DateValue}</li>
        </ul>
        <div class="buttons ms-2">
          <button type="button" class="btn btn-success" onClick="handleCompleteTodo(${index})">Complete</button>
          <button type="button" class="btn btn-warning" onClick="handleEditTodo(${index})">Edit</button>
          <button type="button" class="btn btn-danger delete" onClick="handleDeleteTodo(${index}, false)">Delete</button>
        </div>
      </div>
    `;
    pending.appendChild(div);
  });

  filteredDone.forEach((obj, index) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <div class="tasks shadow-sm p-1 mb-2 rounded bg-body rounded">
        <ul class="mb-1 ps-2 ">
          <li class="completed">${index + 1}. ${obj.inputVal} - ${obj.DateValue}</li>
        </ul>
        <div class="buttons ms-2">
          <button type="button" class="btn btn-success" onClick="handleUndoTodo(${index})">Undo</button>
          <button type="button" class="btn btn-warning" ${
            obj.checkBoxVal ? "disabled" : ""
          }>Edit</button>
          <button type="button" class="btn btn-danger delete" onClick="handleDeleteTodo(${index}, true)">Delete</button>
        </div>
      </div>
    `;
    done.appendChild(div);
  });
};


button.addEventListener("click", () => {
  let inputVal = input.value;
  let DateValue = inputDate.value;
  let checkBoxVal = CheckBox.checked;

  if (inputVal === "" || DateValue === "") {
    alert("Please enter a value");
    return;
  }

  let obj = { inputVal, DateValue, checkBoxVal };

  if (editIndex === -1) {
   
    if (checkBoxVal) {
      DoneArr.push(obj);
    } else {
      PendingArr.push(obj);
    }
  } else {
  
    PendingArr[editIndex] = obj;
    editIndex = -1; 
    button.textContent = "Add Task"; 
  }

  input.value = "";
  inputDate.value = "";
  CheckBox.checked = false;
  render();
  saveData();
});

const handleDeleteTodo = (id, isDone) => {
  if (isDone) {
    DoneArr = DoneArr.filter((_, index) => index !== id);
  } else {
    PendingArr = PendingArr.filter((_, index) => index !== id);
  }
  render();
  saveData();
};

const handleUndoTodo = (id) => {
  let obj = DoneArr[id];
  DoneArr = DoneArr.filter((_, index) => index !== id);
  PendingArr.push(obj);
  render();
  saveData();
};

const handleCompleteTodo = (id) => {
  let obj = PendingArr[id];
  obj.checkBoxVal = true;
  PendingArr = PendingArr.filter((_, index) => index !== id);
  DoneArr.push(obj);
  saveData();
  render();
};

const handleEditTodo = (id) => {
  let obj = PendingArr[id];
  input.value = obj.inputVal;
  inputDate.value = obj.DateValue;
  editIndex = id; 
  button.textContent = "Edit"; 
  saveData();
};




window.handleDeleteTodo = handleDeleteTodo;
window.handleUndoTodo = handleUndoTodo;
window.handleCompleteTodo = handleCompleteTodo;
window.handleEditTodo = handleEditTodo;

