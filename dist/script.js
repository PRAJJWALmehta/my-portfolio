// script.js

// 1. Select the toggle button
const themeToggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement; // Selects the <html> tag

// 2. Check for saved user preference, if any, on load
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  htmlElement.classList.add("dark");
} else {
  htmlElement.classList.remove("dark");
}

// 3. Add Event Listener to toggle the theme
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    // Toggle the class on the <html> element
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      htmlElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  });
}
