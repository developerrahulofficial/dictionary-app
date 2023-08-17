function setFontTheme(theme) {
  if (theme === "Mono") {
    document.body.classList.remove("theme--serif");
    document.body.classList.remove("theme--sans-serif");
    if (!document.body.classList.contains("theme--mono")) {
      document.body.classList.add("theme--mono");
    }
    localStorage.setItem("font-theme", theme);
  } else if (theme === "Serif") {
    document.body.classList.remove("theme--mono");
    document.body.classList.remove("theme--sans-serif");
    if (!document.body.classList.contains("theme--serif")) {
      document.body.classList.add("theme--serif");
    }
    localStorage.setItem("font-theme", theme);
  } else if (theme === "Sans Serif") {
    document.body.classList.remove("theme--serif");
    document.body.classList.remove("theme--mono");
    if (!document.body.classList.contains("theme--sans-serif")) {
      document.body.classList.add("theme--sans-serif");
    }
    localStorage.setItem("font-theme", theme);
  }
}

const initialTheme = localStorage.getItem("font-theme") || "Sans Serif";
setFontTheme(initialTheme);

const fontThemeSelect = document.querySelector("[data-font-theme]");
fontThemeSelect.value = initialTheme;

fontThemeSelect.addEventListener("change", (evt) => {
  setFontTheme(evt.target.value);
});
