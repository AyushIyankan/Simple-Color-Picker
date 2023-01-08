"use strict";

//select DOM elements
const colorPickerBtn = document.querySelector("#color-picker");
const clearAll = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

//Copy color code to clipboard, update element
const copyColor = (elem) => {
  elem.innerText = "Copied";
  //clipboard navigator
  navigator.clipboard.writeText(elem.dataset.color);
  //after 1sec of leaving
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

//map colors[] to html
const showColor = () => {
  if (!pickedColors.length) return; // Returning if there are no picked colors
  colorList.innerHTML = pickedColors
    .map(
      (color) => `
        <li class="color">
            <span class="rectangle" style="background: ${color}; border: 1px solid ${
        color == "#ffffff" ? "#ccc" : color
      }"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
    `
    )
    .join("");
  document.querySelector(".picked-colors").classList.remove("hide");

  // Copy color code logic
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};
showColor();

const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      //EyeDropper API
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      // Push Unique
      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColor();
      }
    } catch (error) {
      alert("Failed to copy the color code!");
    }
    document.body.style.display = "block";
  }, 10);
};

// Clear All Logic
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
