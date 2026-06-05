export function renderPlants(plants) {
  const container = document.querySelector("#plantsContainer");

  if (!container) return;

  if (!plants.length) {
    container.innerHTML = `<p class="empty-message">No se encontraron plantas.</p>`;
    return;
  }

  container.innerHTML = plants
    .map(
      (plant) => {
        const imageSrc = plant.image && plant.image !== "" && plant.image !== "undefined" 
          ? plant.image 
          : "./assets/img/plant-placeholder.jpg";
        
        return `
        <article class="plant-card">
          <div class="plant-image">
            <img 
              src="${imageSrc}" 
              alt="${plant.name || 'Planta'}"
              loading="lazy"
              onerror="this.onerror=null; this.src='./assets/img/plant-placeholder.jpg';"
            >
            <span>${plant.category || 'Planta'}</span>
          </div>

          <div class="plant-content">
            <h3>${escapeHtml(plant.name || 'Nombre no disponible')}</h3>
            <p class="scientific">${escapeHtml(plant.scientificName || 'No disponible')}</p>
            <p>${escapeHtml(plant.shortDescription || plant.description || 'Sin descripción disponible')}</p>

            <div class="plant-footer">
              <span class="difficulty">${escapeHtml(plant.difficulty || 'Moderado')}</span>
              <button class="btn-secondary" data-id="${plant.id}">
                Ver más
              </button>
            </div>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

export function renderPlantModal(plant) {
  const modal = document.querySelector("#plantModal");

  if (!modal || !plant) return;

  const specs = plant.specs;
  
  const imageSrc = plant.image && plant.image !== "" && plant.image !== "undefined" 
    ? plant.image 
    : "./assets/img/plant-placeholder.jpg";

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="closeModal">×</button>

      <img 
        src="${imageSrc}" 
        alt="${plant.name || 'Planta'}"
        onerror="this.onerror=null; this.src='./assets/img/plant-placeholder.jpg';"
      >

      <h2>${escapeHtml(plant.name || 'Nombre no disponible')}</h2>
      <p class="scientific">${escapeHtml(plant.scientificName || 'No disponible')}</p>
      <p>${escapeHtml(plant.description || 'Sin descripción disponible')}</p>

      <h3>Cuidados</h3>
      <p>${escapeHtml(plant.care || "Información de cuidados no disponible.")}</p>

      ${
        specs
          ? `
          <h3>Especificaciones</h3>
          <div class="plant-specs">
            <p>🔄 Ciclo: ${escapeHtml(specs.cycle || 'No especificado')}</p>
            <p>💧 Riego: ${escapeHtml(specs.watering || 'No especificado')}</p>
            <p>🗺️ Zona: ${escapeHtml(specs.hardiness || 'No especificado')}</p>
            <p>☀️ Luz: ${escapeHtml(specs.sunlight || 'No especificada')}</p>
            <p>🌲 Conos: ${escapeHtml(specs.cones || 'No')}</p>
            <p>🍃 Hojas: ${escapeHtml(specs.leaf || 'No')}</p>
            <p>🚀 Crecimiento: ${escapeHtml(specs.growthRate || 'No especificado')}</p>
            <p>🧑‍🌾 Cuidado: ${escapeHtml(specs.careLevel || 'No especificado')}</p>
          </div>
          `
          : ""
      }
    </div>
  `;

  modal.classList.add("active");

  const closeBtn = document.querySelector("#closeModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }
  
  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// Función auxiliar para escapar HTML y prevenir XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}