import { APP_CONFIG } from "../config/config.js";
import { renderUsers } from "../views/users.view.js";

export async function initUsersPage() {

  try {

    let users = JSON.parse(
      localStorage.getItem("greenhouse_users")
    );

    if (!users) {

      const response = await fetch(
        APP_CONFIG.localData.users
      );

      const data = await response.json();

      users = data.users;

      localStorage.setItem(
        "greenhouse_users",
        JSON.stringify(users)
      );

    }

    renderUsers(users);
    setupAddUser(users);

  } catch (error) {

    console.error(error);

  }

}

function setupAddUser(users) {
  const addBtn = document.getElementById("addUserBtn");
  const form = document.getElementById("userFormContainer");
  const saveBtn = document.getElementById("saveUserBtn");

  if (!addBtn || !form || !saveBtn) return;

  addBtn.addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "block" : "none";
  });

  saveBtn.addEventListener("click", () => {
    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value.trim();

    if (!name || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "admin",
      created_at: new Date().toISOString().split("T")[0]
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem(
      "greenhouse_users",
      JSON.stringify(updatedUsers)
    );

    renderUsers(updatedUsers);

    form.style.display = "none";
  });
}