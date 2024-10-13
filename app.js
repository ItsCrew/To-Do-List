// make the input box look better
// add so it saves to local storage

const taskItems = document.querySelectorAll("#list-container li");
const listContainer = document.getElementById("list-container");
// const editButtons = document.querySelectorAll(".edit");
// const removeButtons = document.querySelectorAll(".remove");
const addButton = document.querySelector(".add");
const clear = document.querySelector(".clear");
const textBox = document.getElementById("text-box");

// Add button
function addTask() {
  const taskText = textBox.value.trim();
  if (taskText !== "") {
    createTaskElement(taskText);
    textBox.value = ""; // Clear the input box after adding
  }
}

addButton.addEventListener("click", function () {
  addTask();
});

// Keydown Event Listener: Checks for the Enter key
textBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Clear All Button
clear.addEventListener("click", () => {
  listContainer.innerHTML = "";
});

// Function for add button
function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.innerHTML = `
  <span class="task-text">${taskText}</span>
  <button class="btn edit">Edit</button>
  <button class="btn remove">Remove</button>
  `;

  const editButton = li.querySelector(".edit");
  const removeButton = li.querySelector(".remove");

  editButton.addEventListener("click", function () {
    editTask(li, editButton, removeButton);
  });

  removeButton.addEventListener("click", function () {
    li.remove();
  });

  listContainer.appendChild(li);
}

// function for edit button
function editTask(li, editButton, removeButton) {
  const taskText = li.querySelector(".task-text").textContent.trim();
  console.log(taskText);

  const input = document.createElement("input");
  input.type = "text";
  input.value = taskText;
  input.placeholder = "Edit the task";

  const save = document.createElement("button");
  save.textContent = "Save";
  save.classList.add("btn");

  //clear the current text and hide the buttons
  editButton.style.display = "none";
  removeButton.style.display = "none";

  li.querySelector(".task-text").textContent = "";
  li.appendChild(input);
  li.appendChild(save);

  save.addEventListener("click", function () {
    const updateText = input.value;
    if (updateText === "") {
      console.log("eh?");
      li.childNodes[0].textContent = "";
      input.remove();
      save.remove();
    } else {
      li.childNodes[0].textContent = updateText;
      input.remove();
      save.remove();
      editButton.style.display = "inline";
      removeButton.style.display = "inline";
    }
  });
}
