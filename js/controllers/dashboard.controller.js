import { getPlants } from "../services/api.service.js";
import { isAuthenticated, getCurrentUser, isAdmin } from "../services/auth.service.js";
import { renderDashboard, updateStatsCards, updateTopPlantsList, updateTopHorariosList, updateTopTiposList, showDashboardError } from "../views/dashboard.view.js";
import { APP_CONFIG } from "../config/config.js";

export async function initDashboardPage() {
  if (!isAuthenticated()) {
    window.location.href = APP_CONFIG.routes.login;
    return;
  }
  
  if (!isAdmin()) {
    window.location.href = APP_CONFIG.routes.plants;
    return;
  }

  const currentUser = getCurrentUser();
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay && currentUser) {
    userNameDisplay.textContent = currentUser.name || currentUser.email;
  }

  const plants = await getPlants();
  renderDashboard(plants);
  
  await loadDashboardData();
}

async function loadDashboardData() {
  try {
    const response = await fetch(APP_CONFIG.localData.dashboardStats);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const dashboardData = await response.json();
    
    // Actualizar tarjetas de estadísticas
    updateStatsCards(dashboardData.overview);
    
    // Actualizar lista de plantas más populares
    updateTopPlantsList(dashboardData.top_plants);
    
    // Actualizar lista de top horarios
    updateTopHorariosList(dashboardData.overview.top_horarios);
    
    // Actualizar lista de top tipos de plantas
    updateTopTiposList(dashboardData.top_tipos_plantas);
    
    // Inicializar gráficas
    initUsersChart(dashboardData.user_registrations);
    initTiposChart(dashboardData.top_tipos_plantas);
    
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
    showDashboardError("Error al cargar los datos del dashboard: " + error.message);
  }
}

function initUsersChart(userRegistrations) {
  const ctx = document.getElementById("usersChart");
  if (!ctx) {
    console.error("No se encontró el canvas usersChart");
    return;
  }
  
  if (!userRegistrations || userRegistrations.length === 0) {
    console.error("No hay datos de registros de usuarios");
    return;
  }
  
  const months = userRegistrations.map(item => item.month);
  const counts = userRegistrations.map(item => item.count);
  
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está cargado");
    return;
  }
  
  let existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Usuarios Registrados",
        data: counts,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#4CAF50",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { callbacks: { label: (ctx) => `Usuarios: ${ctx.raw}` } }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Número de Usuarios" } },
        x: { title: { display: true, text: "Mes" } }
      }
    }
  });
}

function initTiposChart(topTipos) {
  const ctx = document.getElementById("tiposChart");
  if (!ctx) {
    console.error("No se encontró el canvas tiposChart");
    return;
  }
  
  if (!topTipos || topTipos.length === 0) {
    console.error("No hay datos de tipos de plantas");
    return;
  }
  
  const tipos = topTipos.map(item => item.tipo);
  const consultas = topTipos.map(item => item.consultas);
  
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está cargado");
    return;
  }
  
  let existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: tipos,
      datasets: [{
        label: "Número de consultas",
        data: consultas,
        backgroundColor: "rgba(76, 175, 80, 0.6)",
        borderColor: "#4CAF50",
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { callbacks: { label: (ctx) => `Consultas: ${ctx.raw}` } }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Número de consultas" } },
        x: { title: { display: true, text: "Tipo de planta" } }
      }
    }
  });
}