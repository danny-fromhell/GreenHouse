import { login } from "../services/auth.service.js";
import { showMessage } from "../utils/utils.js";

export function initLoginPage() {
  const form = document.querySelector("#loginForm");
  const messageContainer = document.querySelector("#loginMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const result = login(email, password);

    if (!result.success) {
      showMessage(messageContainer, result.message, "error");
      return;
    }

    window.location.href = "dashboard.html";
  });
}