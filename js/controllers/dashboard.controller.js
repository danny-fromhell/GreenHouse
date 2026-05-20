import { getPlants } from "../services/api.service.js";
import { isAuthenticated } from "../services/auth.service.js";
import { renderDashboard } from "../views/dashboard.view.js";

export async function initDashboardPage() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  const plants = await getPlants();
  renderDashboard(plants);
}