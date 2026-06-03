export function renderUsers(users) {

  const container = document.getElementById("usersContainer");

  if (!container) return;

  container.innerHTML = `
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Fecha Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>

      ${users.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.created_at}</td>

          <td>
            <button class="btn-delete" data-id="${user.id}">
              Eliminar
            </button>
          </td>
        </tr>
      `).join("")}

      </tbody>
    </table>
  `;

  const deleteButtons =
    container.querySelectorAll(".btn-delete");

  deleteButtons.forEach(button => {

    button.addEventListener("click", () => {

      const userId = Number(
        button.dataset.id
      );

      deleteUser(userId);

    });

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