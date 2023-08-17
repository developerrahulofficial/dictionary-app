/*****************************************************************************
 * prefersColorScheme
 *
 * Usage:
 *
 *  1. include or import this javascript file such that it is run on page load
 *  2. place a default theme on body.  e.g.: <body class="theme--default">
 *  3. add the data-dark-mode-toggle to the toggle checkbox.
 *      e.g. <input type="checkbox" data-dark-mode-toggle>
 *
 *  Behavior:
 *
 *    The script will manage the assignment of theme classes to <body> in
 *    order to override the default theme when the uer explicitly selects a
 *    theme.
 *
 *    - if the user does not click the toggle, then theme--default is always
 *      used.  This theme class is defined with
 *        @media (prefers-color-scheme: dark)
 *      to define two embedded themes that automatically switch
 *    - the script tracks the current system theme by querying and watching
 *      for changes in the media query.  This will update the toggle to
 *      indicate dark mode enabled (checked) or disabled (unchecked) if
 *      both the theme is default and the system theme changes.
 *    - when the user selection via toggle does not match system, then the
 *      needed theme--dark or theme--light class is set on body replacing
 *      theme--default.
 *    - when theh user selection does not match system, the override preference
 *      is written to localstorage as 'dark-mode-toggle': 'light'/'dark'.
 *
 *****************************************************************************/
const defaultThemeClass = "theme--default";
const lightThemeClass = "theme--light";
const darkThemeClass = "theme--dark";

// toggleElements contains an array of all toggle switches (checkbox) that know theme state
const toggleElements = getToggleElements();

// update the <body> element with the initial colorScheme.
//
//   - if a userColorScheme exists, then set light/dark explicitly
//   - else set default theme
//
updateDocumentState();
updateToggleStates();

//
// for all the checkboxes, add event listeners on click to swap classes on body as appropriate.
//
toggleElements.forEach((toggle) =>
  toggle.addEventListener("click", toggleEventListenerFor(toggle))
);

//
// watch for changes of the system color scheme.  We care about this in
// order to have the toggles track system color changes in default.
//
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (evt) => {
    // if default theme, then toggles updated to track change to system
    if (document.body.classList.contains(defaultThemeClass)) {
      updateToggleStates();
    }
  });

/**
 * toggleEventListenerFor
 *
 * create a listener to respond to clicks on the scheme toggle.
 *
 * determine the desired scheme, either "dark" or "light"
 *
 * if the desired scheme matches system, clear in user state
 * otherwise set in user state.
 *
 * update the document with the new state.
 *
 * @param {*} element
 * @returns function
 */
function toggleEventListenerFor(element) {
  return (evt) => {
    const selectedColorScheme = evt.target.checked ? "dark" : "light";

    if (selectedColorScheme === getSystemColorScheme()) {
      // we've clicked to match the system, so remove the user override
      removeUserColorScheme();
    } else {
      // click does not match system, so set override
      setUserColorScheme(selectedColorScheme);
    }
    updateDocumentState();
    updateToggleStates(evt.target);
  };
}

/**
 * updateToggleStates
 *
 * This utility iterates over all the toggle buttons on the page and updates
 * the checked state to match the one presently being clicked.
 *
 * @param {*} currentEl, provide evt.target if calling from a click handler, otherwise null
 */
function updateToggleStates(currentEl) {
  // get the user override scheme if present
  const userScheme = getUserColorScheme();

  // determine desired checked state, userScheme takes priority over system
  let checkedState = userScheme
    ? userScheme === "dark"
    : getSystemColorScheme() === "dark";

  // set the toggles based on the desired checked state
  toggleElements.forEach((el) => {
    if (el !== currentEl) {
      el.checked = checkedState;
    }
  });
}

/**
 * updateDocumentState
 *
 *  Update the document body with the appropriate class depending on the
 *  presence or absence of a userTheme override variable.
 */
function updateDocumentState() {
  const userTheme = getUserColorScheme();

  // if userTheme is defined then we use this to attach light/dark as required
  if (userTheme) {
    const userThemeClass =
      userTheme === "dark" ? darkThemeClass : lightThemeClass;

    // if the body does not presently have the userThemeClass, then modify
    if (!document.body.classList.contains(userThemeClass)) {
      // reset body state to no theme
      document.body.classList.remove(defaultThemeClass);
      document.body.classList.remove(darkThemeClass);
      document.body.classList.remove(lightThemeClass);

      // attach the user selected theme
      document.body.classList.add(userThemeClass);
    }
  } else {
    // if body does not presently use the default theme class
    if (!document.body.classList.contains(defaultThemeClass)) {
      // reset body state to no theme
      document.body.classList.remove(darkThemeClass);
      document.body.classList.remove(lightThemeClass);

      // and attach the default theme
      document.body.classList.add(defaultThemeClass);
    }
  }
}

/**
 * getSystemColorScheme
 *
 * query the browser for @media (prefers-color-scheme: dark)
 * this condition is identical to the syntax used in the CSS @media rules.
 *
 * If the match returns true, then return dark, otherwise light
 *
 * @returns "light" or "dark"
 */
function getSystemColorScheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * removeUserColorScheme
 *
 * clear the userColorScheme attribute in localstorage, to use system scheme
 */
function removeUserColorScheme() {
  localStorage.removeItem("userColorScheme");
}

/**
 * setUserColorScheme
 *
 * persist the user color scheme override selection.
 *
 * @param {string} scheme, either "dark" or "light"
 */
function setUserColorScheme(scheme) {
  localStorage.setItem("userColorScheme", scheme);
}

/**
 * getUserColorScheme
 *
 * return the user override from localstorage if present
 *
 * @returns {string} either "light" or "dark" or null
 */
function getUserColorScheme() {
  return localStorage.getItem("userColorScheme");
}

// toggleElements contains an array of all toggle switches (checkbox) that know theme state
function getToggleElements() {
  return Array.from(document.querySelectorAll("[data-dark-mode-toggle]"));
}
