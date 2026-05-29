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
          <img 
            src="${plant.image}" 
            alt="${plant.name}"
            onerror="this.onerror=null; this.src='./assets/img/plant-placeholder.jpg'; this.alt='Imagen no disponible por la API externa';"
          >
          <span>${plant.category}</span>
        </div>

        <div class="plant-content">
          <h3>${plant.name}</h3>
          <p class="scientific">${plant.scientificName}</p>
          <p>${plant.shortDescription || plant.description}</p>

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

  if (!modal || !plant) return;

  const specs = plant.specs;

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="closeModal">×</button>

      <img 
        src="${plant.image}" 
        alt="${plant.name}"
        onerror="this.onerror=null; this.src='./assets/img/plant-placeholder.jpg'; this.alt='Imagen no disponible por la API externa';"
      >

      <h2>${plant.name}</h2>
      <p class="scientific">${plant.scientificName}</p>
      <p>${plant.description}</p>

      <h3>Cuidados</h3>
      <p>${plant.care || "Información de cuidados no disponible."}</p>

      ${
        specs
          ? `
          <h3>Especificaciones</h3>
          <div class="plant-specs">
            <p>🔄 Cycle: ${specs.cycle}</p>
            <p>💧 Watering: ${specs.watering}</p>
            <p>🗺️ Hardiness Zone: ${specs.hardiness}</p>
            <p>☀️ Sun: ${specs.sunlight}</p>
            <p>🌲 Cones: ${specs.cones}</p>
            <p>🍃 Leaf: ${specs.leaf}</p>
            <p>🚀 Growth Rate: ${specs.growthRate}</p>
            <p>🧑‍🌾 Care Level: ${specs.careLevel}</p>
          </div>
          `
          : ""
      }
    </div>
  `;

  modal.classList.add("active");

  document.querySelector("#closeModal").addEventListener("click", () => {
    modal.classList.remove("active");
  });
}