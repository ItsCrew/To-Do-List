document.addEventListener("DOMContentLoaded", () => {
  const ListContainer = document.getElementById("ListContainer");
  const AddTask = document.querySelector(".AddTask");
  const AddPrompt = document.querySelector(".AddPromptButton");
  const AddModal = document.querySelector(".AddModal");
  const CloseModal = document.querySelector(".close");
  const clearButton = document.querySelector(".ClearButton");
  const InputBox = document.getElementById("InputBox");
  const Login = document.querySelector(".Login");
  const Logout = document.querySelector(".Logout");
  const NoTasks = document.querySelector(".NoTasks");
  const ContextMenu = document.querySelector(".ContextMenu");
  const editButton = document.querySelector(".EditOption");
  const MarkDone = document.querySelector(".MarkDone");
  const MarkNotDone = document.querySelector(".MarkNotDone");
  const removeButton = document.querySelector(".RemoveOption");
  const ColorPicker = document.getElementById("ColorPicker");
  const OpenColorPickerButton = document.getElementById("OpenColorPicker");

  // Login Function/Logic
  function LoginUser() {
    Login.style.display = "none";
    Logout.style.display = "block";
  }

  Login.addEventListener("click", () => {
    LoginUser();
  });

  //Modal for adding a task logic
  AddPrompt.addEventListener("click", () => {
    AddModal.style.display = "block";
    InputBox.focus();
    CloseModal.addEventListener("click", () => {
      AddModal.style.display = "none";
    });
  });

  //Hide Modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == AddModal) {
      AddModal.style.display = "none";
    }
  };

  InputBox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      AddModal.style.display = "none";
    }
  });

  // Add Task Function
  function AddTaskFunction() {
    const taskText = InputBox.value.trim();
    if (taskText !== "") {
      CreateTaskElement(taskText);
      //save
      InputBox.value = "";
      NoTasks.style.display = "none";
      if (clearButton) clearButton.style.display = "block";
    }
    InputBox.focus();
    // AddModal.style.display = "none";
  }

  function CreateTaskElement(taskText, color = "") {
    const li = document.createElement("li");

    if (color) {
      li.style.backgroundColor = color;
    }
    li.innerHTML = `
      <span class="TaskText">${taskText}</span>
    `;

    ListContainer.appendChild(li);

    li.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      // Position and show the context menu
      ContextMenu.style.top = `${e.clientY}px`;
      ContextMenu.style.left = `${e.clientX}px`;
      ContextMenu.style.display = "block";

      // Store reference to the current task for edit/remove actions
      ContextMenu.currentTask = li;
    });
  }

  editButton.addEventListener("click", () => {
    if (ContextMenu.currentTask) {
      EditTask(ContextMenu.currentTask);
      ContextMenu.style.display = "none";
    }
  });

  function EditTask(li) {
    const taskText = li.querySelector(".TaskText").textContent.trim();

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
        li.innerHTML = `<span class="TaskText">${updatedText}</span>`;
        // saveTasksToLocalStorage();
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

  AddTask.addEventListener("click", () => {
    AddTaskFunction();
  });

  InputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      AddTaskFunction();
    }
  });

  // Color Picking Logic
  function SetTileColor() {
    const SelectedColor = ColorPicker.value;
    if (ContextMenu.currentTask) {
      ContextMenu.currentTask.style.backgroundColor = SelectedColor;
    }
  }
  OpenColorPickerButton.addEventListener("click", () => {
    ColorPicker.click();
    ContextMenu.style.display = "none";
  });

  ColorPicker.addEventListener("input", SetTileColor);

  //Mark a task done/Incomplete
  function MarkTaskDone() {
    if (ContextMenu.currentTask) {
      ContextMenu.currentTask.innerHTML = `<span class="TaskText" style="text-decoration: line-through;">${ContextMenu.currentTask.innerHTML}</span>`;
      ContextMenu.style.display = "none";
      MarkDone.style.display = "none";
      MarkNotDone.style.display = "block";
    }
  }

  function MarkTaskIncomplete() {
    if (ContextMenu.currentTask) {
      ContextMenu.currentTask.innerHTML = `<span class="TaskText" style="text-decoration: none;>${ContextMenu.currentTask.innerHTML}</span>`;
      ContextMenu.style.display = "none";
      MarkNotDone.style.display = "none";
      MarkDone.style.display = "block";
    }
  }

  MarkDone.addEventListener("click", MarkTaskDone);
  MarkNotDone.addEventListener("click", MarkTaskIncomplete);

  // Removing a task logic
  function RemoveTask() {
    if (ContextMenu.currentTask) {
      ContextMenu.currentTask.remove();
      ContextMenu.style.display = "none";
      if (ListContainer.children.length === 0) {
        NoTasks.style.display = "block";
        clearButton.style.display = "none";
      }
    }
  }

  removeButton.addEventListener("click", RemoveTask);

  // Hide context menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!ContextMenu.contains(e.target)) {
      ContextMenu.style.display = "none";
    }
  });

  // Clear Button Logic
  function Clear_Tasks() {
    ListContainer.innerHTML = "";
    NoTasks.style.display = "block";
    clearButton.style.display = "none";
  }
  clearButton.addEventListener("click", Clear_Tasks);
});
