// delete all button
// add btn functionality
// make the input box look better

const taskItems = document.querySelectorAll("#list-container li");
const editButtons = document.querySelectorAll(".edit");
const removeButtons = document.querySelectorAll(".remove");
const addButton = document.querySelector(".add");
const clear = document.querySelector(".clear");

editButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    const li = taskItems[index];
    const taskText = li.childNodes[0].textContent.trim();
    console.log(taskText);

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText;
    input.placeholder = "Edit the task";

    removeButtons[index].style.display = "none";

    const save = document.createElement("button");
    save.textContent = "Save";
    save.classList.add("btn");

    li.childNodes[0].textContent = "";
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
        button.style.display = "inline";
        removeButtons[index].style.display = "inline";
      }
    });

    button.style.display = "none";
  });
});

clear.addEventListener("click", function () {
  console.log("e");
});

addButton.addEventListener("click", function () {
  console.log("test");
});

removeButtons.forEach((removeb, index) => {
  removeb.addEventListener("click", function () {
    const li = taskItems[index];
    console.log("Task Deleted!");
    li.childNodes[0].textContent = "";
    editButtons[index].remove();
    removeb.remove();
  });
});
