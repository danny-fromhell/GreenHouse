// ============================================================================
//  Se hace todo el CRUD de usuarios usando Firestore (js/firebase/firestore.js).
//  - Carga los usuarios desde Firestore.
//  - Se pueden crear, editar y eliminar con el formulario de users.html.
// ============================================================================

import { APP_CONFIG } from "../config/config.js";
import { renderUsers } from "../views/users.view.js";
import {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUserById,
  seedUsersIfEmpty
} from "../firebase/firestore.js";

// Cache de los usuarios cargados (para prellenar el formulario al editar)
let usersCache = [];

// Id del usuario en edición. null = el formulario está en modo "crear".
let editingId = null;

export async function initUsersPage() {
  try {
    // Aqui si Firestore no tiene usuarios, los carga del JSON.
    await seedUsersIfEmpty(APP_CONFIG.localData.users);

    await refresh();
    setupForm();
  } catch (error) {
    console.error("Error al inicializar la página de usuarios:", error);
    alert("No se pudieron cargar los usuarios desde Firestore. Revisa la consola.");
  }
}

// Lee de Firestore y vuelve a generar la lista
async function refresh() {
  usersCache = await getUsers();

  renderUsers(usersCache, {
    onAdd: toggleForm,
    onEdit: handleEdit,
    onDelete: handleDelete
  });
}

function setupForm() {
  const saveBtn = document.getElementById("saveUserBtn");
  const cancelBtn = document.getElementById("cancelUserBtn");
  saveBtn?.addEventListener("click", handleSave);
  cancelBtn?.addEventListener("click", closeForm);
}

function toggleForm() {
  resetForm();
  openModal();
}

async function handleSave() {
  const name = document.getElementById("newName").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value.trim();

  if (!name || !email) {
    alert("Completa al menos nombre y email.");
    return;
  }

  try {
    if (editingId) {
      // Editar: solo actualizar los campos que se cambiaron (si se escribió una nueva contraseña, se actualiza, sino se mantiene la misma) 
      const changes = { name, email };
      if (password) changes.password = password;
      await updateUser(editingId, changes);
    } else {
      // Crear
      if (!password) {
        alert("La contraseña es obligatoria para un usuario nuevo.");
        return;
      }

      // Pa evitar emails duplicados
      const existing = await getUserByEmail(email);
      if (existing) {
        alert("Ya existe un usuario con ese email.");
        return;
      }

      await createUser({ name, email, password, role: "admin" });
    }

    closeForm();
    await refresh();
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    alert("No se pudo guardar el usuario. Revisa la consola.");
  }
}

function handleEdit(id) {
  const user = usersCache.find((u) => u.id === id);
  if (!user) return;

  editingId = id;

  document.getElementById("newName").value = user.name || "";
  document.getElementById("newEmail").value = user.email || "";
  document.getElementById("newPassword").value = "";

  const heading = document.getElementById("userFormTitle");
  const saveBtn = document.getElementById("saveUserBtn");
  const passwordInput = document.getElementById("newPassword");

  if (heading) heading.textContent = "Editar administrador";
  if (saveBtn) saveBtn.textContent = "Actualizar";
  if (passwordInput) passwordInput.placeholder = "Nueva contraseña";

  openModal();
}

async function handleDelete(id) {
  if (!confirm("¿Deseas eliminar este usuario?")) return;

  try {
    await deleteUserById(id);
    await refresh();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("No se pudo eliminar el usuario. Revisa la consola.");
  }
}

function closeForm() {
  closeModal();
  resetForm();
}

function resetForm() {
  editingId = null;

  const nameInput = document.getElementById("newName");
  const emailInput = document.getElementById("newEmail");
  const passwordInput = document.getElementById("newPassword");
  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (passwordInput) {
    passwordInput.value = "";
    passwordInput.placeholder = "Contraseña";
  }

  const heading = document.getElementById("userFormTitle");
  const saveBtn = document.getElementById("saveUserBtn");
  if (heading) heading.textContent = "Nuevo administrador";
  if (saveBtn) saveBtn.textContent = "Guardar";
}

function openModal() {
  const overlay = document.getElementById("userModalOverlay");
  if (overlay) overlay.style.display = "flex";
}

function closeModal() {
  const overlay = document.getElementById("userModalOverlay");
  if (overlay) overlay.style.display = "none";
}
