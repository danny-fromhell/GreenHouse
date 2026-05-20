import { formatCurrency, formatNumber } from "../utils/utils.js";

export function renderDashboard(plants) {
  const app = document.querySelector("#dashboardApp");

  if (!app) return;

  const totalPlants = plants.length;
  const totalViews = plants.reduce((sum, plant) => sum + plant.views, 0);
  const totalSales = plants.reduce((sum, plant) => sum + plant.sales, 0);
  const estimatedRevenue = totalSales * 149;

  const popularPlants = [...plants]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  app.innerHTML = `
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <p>Green House</p>
      <nav>
        <a href="#">Overview</a>
        <a href="plants.html">Plantas</a>
        <a href="#">Ventas</a>
        <a href="#">Usuarios</a>
      </nav>
    </aside>

    <section class="dashboard-content">
      <h1>Dashboard</h1>
      <p>Bienvenido de nuevo, administrador</p>

      <div class="metrics-grid">
        <article class="metric-card">
          <span>Total Plantas</span>
          <strong>${formatNumber(totalPlants)}</strong>
        </article>

        <article class="metric-card">
          <span>Ventas Totales</span>
          <strong>${formatCurrency(estimatedRevenue)}</strong>
        </article>

        <article class="metric-card">
          <span>Visitas Totales</span>
          <strong>${formatNumber(totalViews)}</strong>
        </article>

        <article class="metric-card">
          <span>Usuarios Activos</span>
          <strong>2,345</strong>
        </article>
      </div>

      <div class="dashboard-grid">
        <article class="panel">
          <h2>Ventas Mensuales</h2>
          <div class="bar-chart">
            <span style="height:45%"></span>
            <span style="height:52%"></span>
            <span style="height:60%"></span>
            <span style="height:58%"></span>
            <span style="height:72%"></span>
            <span style="height:85%"></span>
          </div>
        </article>

        <article class="panel">
          <h2>Plantas más populares</h2>
          <ol class="popular-list">
            ${popularPlants
              .map(
                (plant) => `
                <li>
                  <strong>${plant.name}</strong>
                  <small>${formatNumber(plant.views)} visitas, ${plant.sales} ventas</small>
                </li>
              `
              )
              .join("")}
          </ol>
        </article>
      </div>
    </section>
  `;
}