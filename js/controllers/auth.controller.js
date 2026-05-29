import { login, getCurrentUser } from "../services/auth.service.js";
import { showMessage } from "../utils/utils.js";
import { APP_CONFIG } from "../config/config.js";

export function initLoginPage() {
  const form = document.querySelector("#loginForm");
  const messageContainer = document.querySelector("#loginMessage");

  // Si ya está autenticado, redirigir según el rol
  const currentUser = getCurrentUser();
  if (currentUser) {
    redirectByRole(currentUser.role);
    return;
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Validar campos vacíos
    if (!email || !password) {
      showMessage(messageContainer, "Por favor complete todos los campos", "error");
      return;
    }

    // Mostrar mensaje de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Validando...";
    submitBtn.disabled = true;

    // Intentar login (ahora es async)
    const result = await login(email, password);

    // Restaurar botón
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (!result.success) {
      showMessage(messageContainer, result.message, "error");
      return;
    }

    // Redirigir según el rol del usuario
    redirectByRole(result.role);
  });
}

function redirectByRole(role) {
  if (role === "admin") {
    window.location.href = APP_CONFIG.routes.dashboard;
  } else {
    window.location.href = APP_CONFIG.routes.plants;
  }
}