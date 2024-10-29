document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("list-container");
  const addButton = document.querySelector(".add");
  const clearButton = document.querySelector(".clear");
  const textBox = document.getElementById("text-box");
  const contextMenu = document.querySelector(".context-menu");
  const editButton = document.querySelector(".editOption");
  const removeButton = document.querySelector(".removeOption");

  // Load tasks from local storage when the page loads
  loadTasksFromLocalStorage();

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

  // Create and append a new task element
  function createTaskElement(taskText, isDone = false) {
    const li = document.createElement("li");
    li.className = isDone ? "task done" : "task";
    li.innerHTML = `
      <i class="fa-regular ${
        isDone ? "fa-check-circle" : "fa-circle"
      } checkbox-icon"></i>
      <span class="task-text">${taskText}</span>
    `;

    const checkboxIcon = li.querySelector(".checkbox-icon");
    checkboxIcon.addEventListener("click", () =>
      toggleTaskDone(li, checkboxIcon)
    );

    listContainer.appendChild(li);

    function toggleTaskDone(li, checkboxIcon) {
      li.classList.toggle("done");
      checkboxIcon.classList.toggle("fa-circle");
      checkboxIcon.classList.toggle("fa-check-circle");
      saveTasksToLocalStorage();
    }

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

  // Edit an existing task
  function editTask(li) {
    const taskText = li.querySelector(".task-text").textContent.trim();

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText;
    input.placeholder = "Edit the task";
    input.className = "edit-input";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("btn");
    saveButton.className = "save-button";

    // Clear the task text and add the input field for editing
    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(saveButton);

    // Save updated task or revert if empty
    function saveUpdatedTask() {
      const updatedText = input.value.trim();
      if (updatedText) {
        li.innerHTML = `<i class="fa-regular fa-circle checkbox-icon"></i><span class="task-text">${updatedText}</span>`;
        li.classList.remove("done");
        createTaskElement(updatedText);
        saveTasksToLocalStorage();
      } else {
        console.log("Task cannot be empty!");
      }
    }

    // Save button click to save updated task
    saveButton.addEventListener("click", saveUpdatedTask);

    // Enter key to save updated task
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveUpdatedTask();
      }
    });

    input.focus();
  }

  // Save tasks to local storage
  function saveTasksToLocalStorage() {
    const tasks = Array.from(listContainer.children).map((li) => ({
      text: li.querySelector(".task-text").textContent.trim(),
      done: li.classList.contains("done"),
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from local storage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ text, done }) => createTaskElement(text, done));
  }
});
