/******************************************************************************
 * select - custom select that can be styled independent of user-agent styles
 *
 * usage:
 *
 *  data-select, add this data attribute to a div surrounding select.
 *  add option elements as usual.  The native select/option will be used
 *  to create the custom select.
 *
 *******************************************************************************/

import arrowDown from "../assets/icon-arrow-down.svg";
import element from "./element-factory";

// get all the custom select elements
const allSelectElements = Array.from(
  document.querySelectorAll("[data-select]")
);

allSelectElements.forEach(debugLog);
//allSelectElements.forEach(watchState);
allSelectElements.forEach(createSelectBox);

document.addEventListener("click", (evt) => {
  allSelectElements.forEach((el) => {
    const c = Array.from(el.children).find((e) =>
      e.classList.contains("select__control")
    );
    if (c.getAttribute("aria-expanded") === "true") {
      c.setAttribute("aria-expanded", "false");
    }
  });
});

/**
 * Log to debug the content of the elements found.
 *
 * @param {custom select element} el
 */
function debugLog(el) {
  const selectEl = selectFromDiv(el);
  Array.from(selectEl.children)
    .filter((e) => e.nodeName === "OPTION")
    .forEach((e) => {});
}

/**
 *
 * @param {custom select element} el
 */
function watchState(el) {
  const selectEl = selectFromDiv(el);

  selectEl.addEventListener("change", (evt) => {
    console.log("new value: " + evt.target.value);
  });
  el.addEventListener("click", (evt) => {
    console.log("click");
    console.log(evt.target);
  });
  document.addEventListener("click", (evt) => {
    console.log("global click");
  });
}

function selectFromDiv(el) {
  return Array.from(el.children).find((e) => e.nodeName === "SELECT");
}

function selectOptions(selectEl) {
  return Array.from(selectEl.children).filter((e) => e.nodeName === "OPTION");
}

function createSelectBox(parentDiv) {
  const selectEl = selectFromDiv(parentDiv);
  const divEl = element("div")
    .class("select__control")
    .attribute("role", "combobox")
    .attribute("aria-haspopup", "listbox")
    .attribute("aria-labelledby", "font-theme-select__label")
    .attribute("aria-controls", "font-theme-select__listbox")
    .attribute("aria-expanded", "false")
    .attribute("tabindex", 0)
    .addTo(parentDiv);
  element("span").text(selectEl.value).addTo(divEl);
  element("img")
    .attribute("src", arrowDown)
    .attribute("aria-hidden", "true")
    .class("icon")
    .class("icon-arrow-down")
    .addTo(divEl);

  divEl.addEventListener("click", (evt) => {
    const expanded = divEl.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
      //divEl.setAttribute("aria-expanded", "false");
    } else {
      openMenu();
      //divEl.setAttribute("aria-expanded", "true");
    }
    evt.preventDefault();
    evt.stopPropagation();
  });
  const popupDiv = element("div")
    .attribute("id", "font-theme-select__listbox")
    .attribute("role", "listbox")
    .attribute("aria-labelledby", "font-theme-select__label")
    .attribute("tabindex", "-1")
    .class("select__popup")
    .addTo(parentDiv);
  divEl.addEventListener("keydown", (evt) => {
    const expanded = divEl.getAttribute("aria-expanded") === "true";
    if (
      evt.key === "Enter" ||
      evt.key === " " ||
      evt.key === "Escape" ||
      evt.key === "Tab"
    ) {
      if (expanded) {
        closeMenu();
        //divEl.setAttribute("aria-expanded", "false");
        if (evt.key === "Enter" || evt.key === "Tab") {
          setToSelected();
        }

        if (evt.key !== "Tab") {
          evt.preventDefault();
          evt.stopPropagation();
        }
      } else {
        if (evt.key !== "Escape" && evt.key !== "Tab") {
          openMenu();
          //divEl.setAttribute("aria-expanded", "true");
          evt.preventDefault();
          evt.stopPropagation();
        }
      }
    } else if (
      evt.key === "ArrowDown" ||
      evt.key === "j" ||
      evt.key === "ArrowUp" ||
      evt.key === "k"
    ) {
      console.log("arrow key: " + evt.key);
      if (!expanded) {
        openMenu();
        //divEl.setAttribute("aria-expanded", "true");
      } else {
        const optlist = Array.from(popupDiv.children[0].children);
        const selectedIndex = optlist.findIndex((el) =>
          el.hasAttribute("aria-selected")
        );
        let newIndex = selectedIndex;
        if (evt.key === "ArrowDown" || evt.key === "j") {
          newIndex++;
          if (newIndex > optlist.length - 1) {
            newIndex = 0;
          }
        } else if (evt.key === "ArrowUp" || evt.key === "k") {
          newIndex--;
          if (newIndex < 0) {
            newIndex = optlist.length - 1;
          }
        }
        console.log("old index: " + selectedIndex);
        console.log("new index: " + newIndex);
        optlist[selectedIndex].removeAttribute("aria-selected");
        optlist[newIndex].setAttribute("aria-selected", "true");
      }

      evt.preventDefault();
      evt.stopPropagation();
    } else {
      console.log("key: " + evt.key);
    }
  });
  const options = selectOptions(selectEl);

  const optionList = element("ul").addTo(popupDiv);
  options.forEach((opt) => {
    const className = "text--" + opt.value.replaceAll(" ", "-").toLowerCase();
    const liEl = element("li")
      .attribute("role", "option")
      .text(opt.value)
      .class(className)
      .addTo(optionList);
    if (opt.value === selectEl.value) {
      liEl.setAttribute("aria-selected", "true");
    }
    liEl.addEventListener("click", (evt) => {
      divEl.children[0].innerText = liEl.innerText;
      selectEl.value = liEl.innerText;
      selectEl.dispatchEvent(new Event("change"));
      closeMenu();
      //divEl.setAttribute("aria-expanded", "false");
      selectOption(optionList, liEl.innerText);
      evt.preventDefault();
      evt.stopPropagation();
    });
  });

  function openMenu() {
    // set selected to match combo text value
    selectOption(optionList, divEl.children[0].innerText);

    // set expanded to show popup
    divEl.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    divEl.setAttribute("aria-expanded", "false");
  }
  function setToSelected() {
    const optionText = Array.from(optionList.children).find(
      (el) => el.getAttribute("aria-selected") === "true"
    )?.innerText;
    console.log("optionText: " + optionText);
    divEl.children[0].innerText = optionText;
    selectEl.value = optionText;
    selectEl.dispatchEvent(new Event("change"));
    divEl.setAttribute("aria-expanded", "false");
  }
}

function selectOption(optionList, selected) {
  Array.from(optionList.children).forEach((opt) => {
    if (opt.innerText !== selected) {
      opt.removeAttribute("aria-selected");
    } else {
      opt.setAttribute("aria-selected", "true");
    }
  });
}
