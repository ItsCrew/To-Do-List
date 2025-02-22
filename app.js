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
  });

  CloseModal.addEventListener("click", () => {
    AddModal.style.display = "none";
  });

  //Hide Modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == AddModal) {
      AddModal.style.display = "none";
    }
  };

  // Add Task Function
  function AddTaskFunction() {
    const li = document.createElement("li");
    li.textContent = InputBox.value;
    ListContainer.appendChild(li);
    InputBox.value = "";
    NoTasks.style.display = "none";
    clearButton.style.display = "block";
    InputBox.focus();
    //Context Menu
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

  function EditTask() {}

  AddTask.addEventListener("click", () => {
    AddTaskFunction();
  });

  InputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      AddTaskFunction();
    }
  });

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
