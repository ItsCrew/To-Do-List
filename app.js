// When clicked on edit it turns into a input box and i edit it to whatever it wants and then it switches back to edit button but the task changes.
// remove button removes it ofc.
// delete all button
// add btn functionality
// make the input box look better

const taskItems = document.querySelectorAll("#list-container li");
const editButtons = document.querySelectorAll(".edit");
const removeButtons = document.querySelectorAll(".remove");
const addButton = document.querySelector(".add");

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
