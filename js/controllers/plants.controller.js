import { getPlants, getPlantById, searchPlants } from "../services/api.service.js";
import { renderPlants, renderPlantModal } from "../views/plants.view.js";

let plantsData = [];
let currentPlants = [];

export async function initPlantsPage() {
  const searchInput = document.querySelector("#searchInput");
  const categoryFilter = document.querySelector("#categoryFilter");

  try {
    plantsData = await getPlants();
    currentPlants = plantsData;

    renderPlants(currentPlants);
    loadCategories(currentPlants);
    addPlantCardEvents();

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
  } catch (error) {
    const container = document.querySelector("#plantsContainer");

    if (container) {
      container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
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

async function applyFilters() {
  const searchValue = document.querySelector("#searchInput").value.toLowerCase().trim();
  const categoryValue = document.querySelector("#categoryFilter").value;

  if (searchValue.length >= 3) {
    try {
      currentPlants = await searchPlants(searchValue);

      const filteredApiPlants = currentPlants.filter((plant) => {
        return categoryValue === "all" || plant.category === categoryValue;
      });

      renderPlants(filteredApiPlants);
      currentPlants = filteredApiPlants;
      addPlantCardEvents();
      return;
    } catch (error) {
      console.error(error);
    }
  }

  currentPlants = plantsData.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchValue) ||
      plant.scientificName.toLowerCase().includes(searchValue) ||
      plant.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "all" || plant.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderPlants(currentPlants);
  addPlantCardEvents();
}

function addPlantCardEvents() {
  document.querySelectorAll(".btn-secondary").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const plant = await getPlantById(id);

      if (plant) {
        renderPlantModal(plant);
      }
    });
  });
}