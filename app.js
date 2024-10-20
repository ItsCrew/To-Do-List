const listContainer = document.getElementById("list-container");
const addButton = document.querySelector(".add");
const clearButton = document.querySelector(".clear");
const textBox = document.getElementById("text-box");

// Load tasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

// Add task when clicking the Add button or pressing Enter
function addTask() {
  const taskText = textBox.value.trim();
  if (taskText !== "") {
    createTaskElement(taskText);
    saveTasksToLocalStorage();
    textBox.value = ""; // Clear input field
  }
}

addButton.addEventListener("click", addTask);
textBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Clear all tasks
clearButton.addEventListener("click", () => {
  listContainer.innerHTML = "";
  localStorage.removeItem("tasks");
});

// Create and append a new task element
function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <button class="btn edit">Edit</button>
    <button class="btn remove">Remove</button>
  `;

  const editButton = li.querySelector(".edit");
  const removeButton = li.querySelector(".remove");

  // Edit task
  editButton.addEventListener("click", () => {
    editTask(li, editButton, removeButton);
    saveTasksToLocalStorage();
  });

  // Remove task
  removeButton.addEventListener("click", () => {
    li.remove();
    saveTasksToLocalStorage();
  });

  listContainer.appendChild(li);
}

// Edit an existing task
function editTask(li, editButton, removeButton) {
  const taskText = li.querySelector(".task-text").textContent.trim();

  const input = document.createElement("input");
  input.type = "text";
  input.value = taskText;
  input.placeholder = "Edit the task";
  input.className = "EditInput";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("btn");
  saveButton.className = "SaveButton";

  // Hide buttons and show the input field
  editButton.style.display = "none";
  removeButton.style.display = "none";
  li.querySelector(".task-text").textContent = "";

  li.appendChild(input);
  li.appendChild(saveButton);

  // Save the updated task or revert if empty
  function saveUpdatedTask() {
    const updatedText = input.value.trim();
    if (updatedText) {
      li.querySelector(".task-text").textContent = updatedText;
      input.remove();
      saveButton.remove();
      editButton.style.display = "inline";
      removeButton.style.display = "inline";
      saveTasksToLocalStorage();
    } else {
      console.log("Task cannot be empty!");
    }
  }

  // Click event for the Save button
  saveButton.addEventListener("click", saveUpdatedTask);

  // Keydown event for the Enter key on the input field
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveUpdatedTask();
    }
  });

  // Focus on the input field for user convenience
  input.focus();
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
  const tasks = Array.from(listContainer.children).map((li) =>
    li.querySelector(".task-text").textContent.trim()
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskText) => createTaskElement(taskText));
}
