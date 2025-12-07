const btn = document.getElementById("theme-toggle");
const html = document.documentElement;

const toggleDarkMode = () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    btn.innerText = "☀️";
  } else {
    btn.innerText = "🌙";
  }
};

btn.addEventListener("click", toggleDarkMode);
