document.addEventListener("DOMContentLoaded", () => {
  const ListContainer = document.getElementById("ListContainer");
  const AddTask = document.querySelector(".AddTask");
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
