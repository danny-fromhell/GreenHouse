// ============================================================================
// CRUD de perfiles de usuario utilizando Firestore.
// - Carga los perfiles desde Firestore.
// - Permite crear, editar y eliminar perfiles desde users.html.
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

// Caché de perfiles cargados
let usersCache = [];

// ID del perfil en edición. null = modo creación.
let editingId = null;

export async function initUsersPage() {
  try {
    await seedUsersIfEmpty(APP_CONFIG.localData.users);

    await refresh();
    setupForm();
  } catch (error) {
    console.error("Error al inicializar la página de usuarios:", error);
    alert("No se pudieron cargar los usuarios desde Firestore. Revisa la consola.");
  }
}

// Obtiene los perfiles desde Firestore y actualiza la vista.
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

  if (!name || !email) {
    alert("Completa nombre y correo electrónico.");
    return;
  }

  try {
    if (editingId) {
      await updateUser(editingId, {
        name,
        email
      });
    } else {
      const existing = await getUserByEmail(email);

      if (existing) {
        alert("Ya existe un usuario con ese correo.");
        return;
      }

      await createUser({
        name,
        email,
        role: "admin"
      });
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

  if (!user) {
    return;
  }

  editingId = id;

  const nameInput = document.getElementById("newName");
  const emailInput = document.getElementById("newEmail");

  if (nameInput) {
    nameInput.value = user.name || "";
  }

  if (emailInput) {
    emailInput.value = user.email || "";
  }

  const heading = document.getElementById("userFormTitle");
  const saveBtn = document.getElementById("saveUserBtn");

  if (heading) {
    heading.textContent = "Editar administrador";
  }

  if (saveBtn) {
    saveBtn.textContent = "Actualizar";
  }

  openModal();
}

async function handleDelete(id) {
  if (!confirm("¿Deseas eliminar este usuario?")) {
    return;
  }

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

  if (nameInput) {
    nameInput.value = "";
  }

  if (emailInput) {
    emailInput.value = "";
  }

  const heading = document.getElementById("userFormTitle");
  const saveBtn = document.getElementById("saveUserBtn");

  if (heading) {
    heading.textContent = "Nuevo administrador";
  }

  if (saveBtn) {
    saveBtn.textContent = "Guardar";
  }
}

function openModal() {
  const overlay = document.getElementById("userModalOverlay");

  if (overlay) {
    overlay.style.display = "flex";
  }
}

function closeModal() {
  const overlay = document.getElementById("userModalOverlay");

  if (overlay) {
    overlay.style.display = "none";
  }
}