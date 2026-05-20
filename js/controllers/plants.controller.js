import { getPlants, getPlantById } from "../services/api.service.js";
import { renderPlants, renderPlantModal } from "../views/plants.view.js";

let plantsData = [];

export async function initPlantsPage() {
  const searchInput = document.querySelector("#searchInput");
  const categoryFilter = document.querySelector("#categoryFilter");

  try {
    plantsData = await getPlants();
    renderPlants(plantsData);
    loadCategories(plantsData);
    addPlantCardEvents();

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
  } catch (error) {
    const container = document.querySelector("#plantsContainer");
    container.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

function loadCategories(plants) {
  const categoryFilter = document.querySelector("#categoryFilter");

  if (!categoryFilter) return;

  const categories = [...new Set(plants.map((plant) => plant.category))];

  categoryFilter.innerHTML = `
    <option value="all">Todas</option>
    ${categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("")}
  `;
}

function applyFilters() {
  const searchValue = document.querySelector("#searchInput").value.toLowerCase();
  const categoryValue = document.querySelector("#categoryFilter").value;

  const filteredPlants = plantsData.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchValue) ||
      plant.scientificName.toLowerCase().includes(searchValue) ||
      plant.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "all" || plant.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderPlants(filteredPlants);
  addPlantCardEvents();
}

function addPlantCardEvents() {
  document.querySelectorAll(".btn-secondary").forEach((button) => {
    button.addEventListener("click", async () => {
      const plant = await getPlantById(button.dataset.id);
      renderPlantModal(plant);
    });
  });
}