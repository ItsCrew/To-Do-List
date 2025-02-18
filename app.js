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

  // const contextMenu = document.querySelector(".context-menu");
  // const editButton = document.querySelector(".editOption");
  // const removeButton = document.querySelector(".removeOption");

  // Login Logic
  Login.addEventListener("click", () => {
    console.log("Logged in");
    Login.style.display = "none";
    Logout.style.display = "block";
  });

  //Modal for adding a task logic
  AddPrompt.addEventListener("click", () => {
    AddModal.style.display = "block";
  });

  CloseModal.addEventListener("click", () => {
    AddModal.style.display = "none";
  });

  // Add Task Logic
  AddTask.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = InputBox.value;
    ListContainer.appendChild(li);
    InputBox.value = "";
  });

  // Clear Button Logic
  function Clear_Tasks() {
    ListContainer.innerHTML = "";
  }
  clearButton.addEventListener("click", Clear_Tasks);
});
