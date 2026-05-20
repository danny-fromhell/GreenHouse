import { renderHome } from "./views/home.view.js";
import { initPlantsPage } from "./controllers/plants.controller.js";
import { initLoginPage } from "./controllers/auth.controller.js";
import { initDashboardPage } from "./controllers/dashboard.controller.js";
import { getCurrentPage } from "./utils/utils.js";
import { APP_CONFIG } from "./config/config.js";

function initTheme() {
  const themeButton = document.querySelector("#themeToggle");
  const savedTheme = localStorage.getItem(APP_CONFIG.themeKey) || "light";

  document.body.dataset.theme = savedTheme;

  themeButton?.addEventListener("click", () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.dataset.theme = newTheme;
    localStorage.setItem(APP_CONFIG.themeKey, newTheme);
  });
}

function initMenu() {
  const menuButton = document.querySelector("#menuButton");
  const navMenu = document.querySelector("#navMenu");

  menuButton?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

function initApp() {
  initTheme();
  initMenu();

  const currentPage = getCurrentPage();

  if (currentPage === "index.html") {
    renderHome();
  }

  if (currentPage === "plants.html") {
    initPlantsPage();
  }

  if (currentPage === "login.html") {
    initLoginPage();
  }

  if (currentPage === "dashboard.html") {
    initDashboardPage();
  }
}

document.addEventListener("DOMContentLoaded", initApp);