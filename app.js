// When clicked on edit it turns into a input box and i edit it to whatever it wants and then it switches back to edit button but the task changes.
// remove button removes it ofc.
// delete all button
// add btn functionality
// make the input box look better

const taskItems = document.querySelectorAll("#list-container li");
const editButtons = document.querySelectorAll(".edit");
const removeButtons = document.querySelectorAll(".remove");

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
      li.childNodes[0].textContent = updateText;
      input.remove();
      save.remove();
      button.style.display = "inline";
    });

    button.style.display = "none";
  });
});
