import { renderHome } from "./views/home.view.js";
import { initPlantsPage } from "./controllers/plants.controller.js";
import { initLoginPage } from "./controllers/auth.controller.js";
import { initDashboardPage } from "./controllers/dashboard.controller.js";
import { getCurrentPage } from "./utils/utils.js";
import { APP_CONFIG } from "./config/config.js";
import { isAuthenticated, getCurrentUser, logout } from "./services/auth.service.js";

function initTheme() {
  const themeButton = document.querySelector("#themeToggle");
  const savedTheme = localStorage.getItem(APP_CONFIG.storageKeys.themeKey) || "light";

  document.body.dataset.theme = savedTheme;

  themeButton?.addEventListener("click", () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.dataset.theme = newTheme;
    localStorage.setItem(APP_CONFIG.storageKeys.themeKey, newTheme);
  });
}

function initMenu() {
  const menuButton = document.querySelector("#menuButton");
  const navMenu = document.querySelector("#navMenu");

  menuButton?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Proteger rutas según autenticación y rol
function protectRoutes() {
  const currentPage = getCurrentPage();
  
  // Solo dashboard requiere autenticación (plants es público)
  const protectedPages = ["dashboard.html"];
  
  // Páginas para usuarios NO autenticados (login)
  const authPages = ["login.html"];
  
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  // Si la página requiere autenticación y no está autenticado
  if (protectedPages.includes(currentPage) && !authenticated) {
    window.location.href = APP_CONFIG.routes.login;
    return false;
  }
  
  // Verificar permisos específicos para dashboard (solo admin)
  if (currentPage === "dashboard.html" && authenticated && currentUser?.role !== "admin") {
    // Usuario normal no puede acceder al dashboard, redirigir a plants
    window.location.href = APP_CONFIG.routes.plants;
    return false;
  }
  
  // Si está autenticado y trata de acceder a login, redirigir según rol
  if (authPages.includes(currentPage) && authenticated) {
    if (currentUser?.role === "admin") {
      window.location.href = APP_CONFIG.routes.dashboard;
    } else {
      window.location.href = APP_CONFIG.routes.plants;
    }
    return false;
  }
  
  return true;
}

// Configurar botón de logout si existe
function setupLogoutButton() {
  // Buscar botones de logout por diferentes IDs/clases
  const logoutBtnSidebar = document.querySelector("#logoutBtnSidebar");
  const logoutBtn = document.querySelector("#logoutBtn");
  const logoutBtnClass = document.querySelector(".logout-btn");
  
  // Función para manejar el logout
  const handleLogout = (e) => {
    if (e) e.preventDefault();
    logout();
  };
  
  if (logoutBtnSidebar) {
    logoutBtnSidebar.addEventListener("click", handleLogout);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  
  if (logoutBtnClass) {
    logoutBtnClass.addEventListener("click", handleLogout);
  }
}

// Mostrar nombre del usuario en el header si existe
function displayUserInfo() {
  const userNameElement = document.querySelector("#userName");
  const userNameDisplay = document.querySelector("#userNameDisplay");
  const currentUser = getCurrentUser();
  
  if (userNameElement && currentUser) {
    userNameElement.textContent = currentUser.name || currentUser.email;
  }
  
  if (userNameDisplay && currentUser) {
    userNameDisplay.textContent = currentUser.name || currentUser.email;
  }
}

// Mostrar/ocultar botón Sign In según autenticación
function setupSignInButton() {
  const signInBtn = document.querySelector("#signinBtn");
  const currentUser = getCurrentUser();
  
  if (signInBtn) {
    if (!currentUser) {
      // No hay sesión, mostrar botón Sign In
      signInBtn.style.display = "block";
      signInBtn.textContent = "Sign In";
      signInBtn.href = "login.html";
    } else {
      // Hay sesión, mostrar nombre o botón de perfil
      signInBtn.style.display = "block";
      signInBtn.textContent = `👤 ${currentUser.name || currentUser.email}`;
      signInBtn.href = "#";
      signInBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentUser.role === "admin") {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "plants.html";
        }
      });
    }
  }
}

function initApp() {
  initTheme();
  initMenu();
  
  // Configurar botón Sign In
  setupSignInButton();
  
  // Proteger rutas ANTES de inicializar cualquier página
  const canProceed = protectRoutes();
  if (!canProceed) return;
  
  // Mostrar información del usuario
  displayUserInfo();
  
  // Configurar botón de logout (después de que el DOM esté listo)
  setTimeout(() => {
    setupLogoutButton();
  }, 100);

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