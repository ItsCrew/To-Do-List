document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("list-container");
  const addButton = document.querySelector(".add");
  const addButtonForPrompt = document.querySelector(".add-prompt");
  const clearButton = document.querySelector(".clear");
  const textBox = document.getElementById("text-box");
  const contextMenu = document.querySelector(".context-menu");
  const editButton = document.querySelector(".editOption");
  const removeButton = document.querySelector(".removeOption");
  const colorPicker = document.getElementById("colorPicker");
  const openColorPickerButton = document.getElementById("openColorPicker");
  const notasktext = document.querySelector(".no-tasks");
  const row = document.querySelector(".row");

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("add-prompt");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // };

  // Load tasks from local storage when the page loads
  loadTasksFromLocalStorage();

  //The popup screen that opens when clicked on the add button
  addButtonForPrompt.addEventListener("click", () => {
    console.log("It works");
  });

  // Add task when clicking the Add button or pressing Enter
  function addTask() {
    const taskText = textBox.value.trim();
    if (taskText !== "") {
      createTaskElement(taskText);
      saveTasksToLocalStorage();
      textBox.value = "";
      notasktext.style.display = "none";
      if (clearButton) clearButton.style.display = "block"; // Show clear button when a task is added
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
    notasktext.style.display = "block";
    clearButton.style.display = "none";
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

      if (listContainer.children.length === 0) {
        notasktext.style.display = "block";
        if (clearButton) clearButton.style.display = "none"; // Hide clear button when no tasks are left
      } else {
        notasktext.style.display = "none";
        if (clearButton) clearButton.style.display = "block"; // Show clear button when tasks are present
      }
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

    if (tasks.length === 0) {
      notasktext.style.display = "block";
      if (clearButton) clearButton.style.display = "none";
    } else {
      notasktext.style.display = "none";
      if (clearButton) clearButton.style.display = "block";
    }
  }
});
