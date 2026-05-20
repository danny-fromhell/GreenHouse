export function renderPlants(plants) {
  const container = document.querySelector("#plantsContainer");

  if (!container) return;

  if (!plants.length) {
    container.innerHTML = `<p class="empty-message">No se encontraron plantas.</p>`;
    return;
  }

  container.innerHTML = plants
    .map(
      (plant) => `
      <article class="plant-card">
        <div class="plant-image">
          <img src="${plant.image}" alt="${plant.name}">
          <span>${plant.category}</span>
        </div>

        <div class="plant-content">
          <h3>${plant.name}</h3>
          <p class="scientific">${plant.scientificName}</p>
          <p>${plant.description}</p>

          <div class="plant-footer">
            <span class="difficulty">${plant.difficulty}</span>
            <button class="btn-secondary" data-id="${plant.id}">
              Ver más
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

export function renderPlantModal(plant) {
  const modal = document.querySelector("#plantModal");

  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="closeModal">×</button>
      <img src="${plant.image}" alt="${plant.name}">
      <h2>${plant.name}</h2>
      <p class="scientific">${plant.scientificName}</p>
      <p>${plant.description}</p>
      <h3>Cuidados</h3>
      <p>${plant.care}</p>
    </div>
  `;

  modal.classList.add("active");

  document.querySelector("#closeModal").addEventListener("click", () => {
    modal.classList.remove("active");
  });
}