export function renderUsers(users) {
  const container = document.getElementById("usersContainer");

  if (!container) return;

  container.innerHTML = `
  <section class="users-page">
    <div class="users-toolbar">
      <div>
        <h1>Usuarios</h1>
        <p>Administradores registrados en GreenHouse.</p>
      </div>

      <button class="btn-primary">
        + Agregar administrador
      </button>
    </div>

    <div class="users-summary">
      <div class="user-summary-card">
        <span>Total usuarios</span>
        <strong>${users.length}</strong>
      </div>

      <div class="user-summary-card">
        <span>Administradores</span>
        <strong>${users.filter(user => user.role === "admin").length}</strong>
      </div>

      <div class="user-summary-card">
        <span>Estado</span>
        <strong>Activo</strong>
      </div>
    </div>

    <div class="users-grid">
      ${users.map(user => {
        const initials = getInitials(user.name);

        return `
          <article class="user-card">
            <div class="user-card-header">
              <div class="user-avatar">${initials}</div>

              <div class="user-main-info">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
              </div>
            </div>

            <div class="user-card-body">
              <div>
                <span>Rol</span>
                <strong>${user.role}</strong>
              </div>

              <div>
                <span>Fecha de registro</span>
                <strong>${formatDate(user.created_at)}</strong>
              </div>
            </div>

            <div class="user-card-actions">
              <button class="btn-edit" data-id="${user.id}">
                Editar
              </button>

              <button class="btn-delete" data-id="${user.id}">
                Eliminar
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  </section>
`;

  const deleteButtons = container.querySelectorAll(".btn-delete");

  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const userId = Number(button.dataset.id);
      deleteUser(userId);
    });
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .map(word => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function deleteUser(userId) {
  const confirmDelete = confirm(
    "¿Deseas eliminar este usuario?"
  );

  if (!confirmDelete) return;

  const users = JSON.parse(
    localStorage.getItem("greenhouse_users")
  ) || [];

  const updatedUsers = users.filter(
    user => user.id !== userId
  );

  localStorage.setItem(
    "greenhouse_users",
    JSON.stringify(updatedUsers)
  );

  renderUsers(updatedUsers);
}