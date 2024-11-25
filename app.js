document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("list-container");
  const addButton = document.querySelector(".add");
  const clearButton = document.querySelector(".clear");
  const textBox = document.getElementById("text-box");
  const contextMenu = document.querySelector(".context-menu");
  const editButton = document.querySelector(".editOption");
  const removeButton = document.querySelector(".removeOption");
  const colorPicker = document.getElementById("colorPicker");
  const openColorPickerButton = document.getElementById("openColorPicker");

  // Load tasks from local storage when the page loads
  loadTasksFromLocalStorage();

  // Add task when clicking the Add button or pressing Enter
  function addTask() {
    const taskText = textBox.value.trim();
    if (taskText !== "") {
      createTaskElement(taskText);
      saveTasksToLocalStorage();
      textBox.value = "";
    }
  }

  addButton.addEventListener("click", addTask);
  textBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Clear all tasks
  clearButton.addEventListener("click", () => {
    listContainer.innerHTML = "";
    localStorage.removeItem("tasks");
  });

  // Create and append a new task element with an optional end time
  function createTaskElement(taskText, color = "") {
    // A function which has 3 arguments taskText, endtime which is set to be empty by default and same with colour
    const li = document.createElement("li");

    // Set initial background color if provided
    if (color) {
      li.style.backgroundColor = color;
    } // Ask chat gpt

    // Task text and optional end time
    li.innerHTML = `
      <span class="task-text">${taskText}</span>
    `;

    listContainer.appendChild(li);

    // Context menu setup for the task
    li.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      // Position and show the context menu
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.display = "block";

      // Store reference to the current task for edit/remove actions
      contextMenu.currentTask = li;
    });
  }

  // Hide context menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) {
      contextMenu.style.display = "none";
    }
  });

  // Edit task when clicking Edit in the context menu
  editButton.addEventListener("click", () => {
    if (contextMenu.currentTask) {
      editTask(contextMenu.currentTask);
      contextMenu.style.display = "none";
    }
  });

  // Remove task when clicking Remove in the context menu
  removeButton.addEventListener("click", () => {
    if (contextMenu.currentTask) {
      contextMenu.currentTask.remove();
      saveTasksToLocalStorage();
      contextMenu.style.display = "none";
    }
  });

  // Open color picker for specific task
  openColorPickerButton.addEventListener("click", () => {
    if (contextMenu.currentTask) {
      colorPicker.click(); // Open color picker
    }
    contextMenu.style.display = "none";
  });

  // Apply selected color to the specific task
  colorPicker.addEventListener("input", function () {
    if (contextMenu.currentTask) {
      contextMenu.currentTask.style.backgroundColor = this.value;
      saveTasksToLocalStorage(); // Save color change to local storage
    }
  });

  // Edit an existing task
  function editTask(li) {
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

    // Clear the task text and add the input field for editing
    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(saveButton);

    // Save updated task or revert if empty
    function saveUpdatedTask() {
      const updatedText = input.value.trim();
      if (updatedText) {
        li.innerHTML = `<span class="task-text">${updatedText}</span>`;
        saveTasksToLocalStorage();
      } else {
        console.log("Task cannot be empty!");
      }
    }

    saveButton.addEventListener("click", saveUpdatedTask);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveUpdatedTask();
      }
    });

    input.focus();
  }

  // Save tasks to local storage
  function saveTasksToLocalStorage() {
    // We are creating a function here called saveTasksToLocalStorage
    // console.log(listContainer.children);
    const tasks = Array.from(listContainer.children).map((li) => ({
      // Here we are defining tasks which
      text: li.querySelector(".task-text").textContent.trim(),
      color: li.style.backgroundColor || "", // Save background color if set
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from local storage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ text, color }) => createTaskElement(text, color));
  }
});
