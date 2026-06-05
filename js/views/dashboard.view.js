import { formatNumber } from "../utils/utils.js";

export function renderDashboard(plants) {
  const app = document.querySelector("#dashboardApp");

  if (!app) return;

  const totalPlants = plants.length;
  const totalViews = plants.reduce((sum, plant) => sum + (plant.views || 0), 0);

  const popularPlants = [...plants]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  app.innerHTML = `
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <p>Green House</p>

      <nav>
        <a href="#" class="active">Overview</a>
        <a href="users.html">Usuarios</a>
        <a href="#" id="logoutBtnSidebar">Cerrar sesión</a>
      </nav>
    </aside>

    <section class="dashboard-content">
      <h1>Dashboard</h1>
      <p>Bienvenido de nuevo, <span id="userNameDisplay">administrador</span></p>

      <div id="dashboardError" class="error-container" style="display: none;"></div>

      <!-- Fila 1: Tarjetas principales -->
      <div class="metrics-grid">
        <article class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-seedling"></i>
          </div>
          <div class="stat-info">
            <span>Total Plantas</span>
            <strong class="stat-number" id="statTotalPlants">${formatNumber(totalPlants)}</strong>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-week"></i>
          </div>
          <div class="stat-info">
            <span>Visitas Semanales</span>
            <strong class="stat-number" id="statVisitasSemanales">0</strong>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-day"></i>
          </div>
          <div class="stat-info">
            <span>Visitas Diarias</span>
            <strong class="stat-number" id="statVisitasDiarias">0</strong>
          </div>
        </article>
      </div>

      <!-- Fila 2: Gráficas principales -->
      <div class="dashboard-grid">
        <article class="panel">
          <h2>📈 Usuarios Registrados (Últimos 6 meses)</h2>
          <canvas id="usersChart" style="height: 260px; width: 100%;"></canvas>
        </article>

        <article class="panel">
          <h2>🏆 Plantas más populares</h2>
          <div id="topPlantsList" class="popular-list">
            <div class="loading">Cargando datos...</div>
          </div>
        </article>
      </div>

      <!-- Fila 3: Top Horarios y Top Tipos de Plantas -->
      <div class="dashboard-grid">
        <article class="panel">
          <h2>⏰ Top 5 Horarios de Consultas</h2>
          <div id="topHorariosList" class="top-horarios-list">
            <div class="loading">Cargando datos...</div>
          </div>
        </article>

        <article class="panel">
          <h2>🌿 Top Tipos de Plantas más consultadas</h2>
          <div id="topTiposList" class="top-tipos-list">
            <div class="loading">Cargando datos...</div>
          </div>
        </article>
      </div>

      <!-- Fila 4: Gráfica de Tipos de Plantas -->
      <div class="full-width-panel">
        <article class="panel">
          <h2>📊 Distribución de consultas por tipo de planta</h2>
          <canvas id="tiposChart" style="height: 300px; width: 100%;"></canvas>
        </article>
      </div>
    </section>
  `;
}

// Función para actualizar las tarjetas de estadísticas
export function updateStatsCards(overview) {
  const totalPlantsEl = document.getElementById("statTotalPlants");
  const visitasSemanalesEl = document.getElementById("statVisitasSemanales");
  const visitasDiariasEl = document.getElementById("statVisitasDiarias");
  
  if (totalPlantsEl) totalPlantsEl.textContent = formatNumber(overview.total_plants || 0);
  if (visitasSemanalesEl) visitasSemanalesEl.textContent = formatNumber(overview.visitas_semanales || 0);
  if (visitasDiariasEl) visitasDiariasEl.textContent = formatNumber(overview.visitas_diarias || 0);
}

// Función para actualizar la lista de top plantas
export function updateTopPlantsList(topPlants) {
  const container = document.getElementById("topPlantsList");
  if (!container) return;
  
  if (topPlants && topPlants.length > 0) {
    container.innerHTML = topPlants.map(plant => `
      <li>
        <strong>${escapeHtml(plant.name)}</strong>
        <small>${formatNumber(plant.visits)} visitas, ${plant.sales} ventas</small>
      </li>
    `).join("");
  } else {
    container.innerHTML = '<div class="loading">No hay datos disponibles</div>';
  }
}

// Función para actualizar la lista de top horarios
export function updateTopHorariosList(topHorarios) {
  const container = document.getElementById("topHorariosList");
  if (!container) return;
  
  if (topHorarios && topHorarios.length > 0) {
    container.innerHTML = topHorarios.map(horario => `
      <li>
        <strong>${escapeHtml(horario.hora)}</strong>
        <small>${formatNumber(horario.visitas)} visitas</small>
      </li>
    `).join("");
  } else {
    container.innerHTML = '<div class="loading">No hay datos disponibles</div>';
  }
}

// Función para actualizar la lista de top tipos de plantas
export function updateTopTiposList(topTipos) {
  const container = document.getElementById("topTiposList");
  if (!container) return;
  
  if (topTipos && topTipos.length > 0) {
    container.innerHTML = topTipos.map(tipo => `
      <li>
        <strong>${escapeHtml(tipo.tipo)}</strong>
        <small>${formatNumber(tipo.consultas)} consultas</small>
      </li>
    `).join("");
  } else {
    container.innerHTML = '<div class="loading">No hay datos disponibles</div>';
  }
}

// Función para mostrar error en el dashboard
export function showDashboardError(message) {
  const errorContainer = document.getElementById("dashboardError");
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i>
        ${escapeHtml(message)}
      </div>
    `;
    errorContainer.style.display = "block";
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}