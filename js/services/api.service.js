import { APP_CONFIG } from "../config/config.js";
import { getCache, saveCache } from "./cache.js";

export async function getPlants() {
  const cachedPlants = getCache(APP_CONFIG.cacheKey);

  if (cachedPlants) {
    return cachedPlants;
  }

  const response = await fetch(
    `${APP_CONFIG.perenualApi.baseUrl}/species-list?key=${APP_CONFIG.perenualApi.apiKey}&page=1`
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar plantas desde Perenual.");
  }

  const data = await response.json();

  const plants = (data.data || [])
    .filter((plant) => plant.common_name)
    .slice(0, 12)
    .map(mapBasicApiPlant);

  saveCache(APP_CONFIG.cacheKey, plants, APP_CONFIG.cacheDuration);

  return plants;
}

export async function getPlantById(id) {
  return getApiPlantById(id);
}

export async function searchPlants(query) {
  const response = await fetch(
    `${APP_CONFIG.perenualApi.baseUrl}/species-list?key=${APP_CONFIG.perenualApi.apiKey}&q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("No se pudieron buscar plantas desde Perenual.");
  }

  const data = await response.json();

  return (data.data || [])
    .filter((plant) => plant.common_name)
    .slice(0, 12)
    .map(mapBasicApiPlant);
}

export async function getApiPlantById(apiId) {
  const cleanId = String(apiId).replace("api-", "");

  const response = await fetch(
    `${APP_CONFIG.perenualApi.baseUrl}/species/details/${cleanId}?key=${APP_CONFIG.perenualApi.apiKey}`
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar el detalle de la planta.");
  }

  const plant = await response.json();

  return mapDetailedApiPlant(plant);
}

function mapBasicApiPlant(plant) {
  return {
    id: `api-${plant.id}`,
    apiId: plant.id,
    name: plant.common_name || "Nombre no disponible",
    scientificName: plant.scientific_name?.[0] || "Nombre científico no disponible",
    description: buildApiShortDescription(plant),
    shortDescription: buildApiShortDescription(plant),
    category: plant.indoor === true ? "Interior" : "Exterior",
    difficulty: getDifficultyLabel(plant.care_level, plant.watering),
    image:
      plant.default_image?.regular_url ||
      plant.default_image?.medium_url ||
      "./assets/img/plant-placeholder.jpg",
    care:
      `Riego: ${translateWatering(plant.watering)}. ` +
      `Luz recomendada: ${translateSunlight(plant.sunlight)}.`,
    specs: {
      cycle: translateCycle(plant.cycle),
      watering: translateWatering(plant.watering),
      hardiness: plant.hardiness?.min || "No especificado",
      sunlight: translateSunlight(plant.sunlight),
      cones: plant.cones ? "Sí" : "No",
      leaf: plant.leaf ? "Sí" : "No",
      growthRate: translateGrowthRate(plant.growth_rate),
      careLevel: translateCareLevel(plant.care_level)
    }
  };
}

function mapDetailedApiPlant(plant) {
  return {
    id: `api-${plant.id}`,
    apiId: plant.id,
    name: plant.common_name || "Nombre no disponible",
    scientificName: plant.scientific_name?.[0] || "Nombre científico no disponible",
    description: buildApiDescription(plant),
    shortDescription: buildApiShortDescription(plant),
    category: plant.indoor === true ? "Interior" : "Exterior",
    difficulty: getDifficultyLabel(plant.care_level, plant.watering),
    image:
      plant.default_image?.regular_url ||
      plant.default_image?.medium_url ||
      "./assets/img/plant-placeholder.jpg",
    care:
      `Nivel de cuidado: ${translateCareLevel(plant.care_level)}. ` +
      `Riego: ${translateWatering(plant.watering)}. ` +
      `Luz: ${translateSunlight(plant.sunlight)}.`,
    specs: {
      cycle: translateCycle(plant.cycle),
      watering: translateWatering(plant.watering),
      hardiness: plant.hardiness?.min || "No especificado",
      sunlight: translateSunlight(plant.sunlight),
      cones: plant.cones ? "Sí" : "No",
      leaf: plant.leaf ? "Sí" : "No",
      growthRate: translateGrowthRate(plant.growth_rate),
      careLevel: translateCareLevel(plant.care_level)
    }
  };
}

function buildApiShortDescription(plant) {
  const name = plant.common_name || "Esta planta";
  const scientificName =
    plant.scientific_name?.[0] ||
    "especie ornamental";

  const cycle = translateCycle(plant.cycle).toLowerCase();
  const category = plant.indoor === true ? "interiores" : "jardines y exteriores";

  if (name.toLowerCase().includes("monstera")) {
    return `${scientificName}. Planta tropical apreciada por su follaje exuberante y valor decorativo.`;
  }

  if (
    name.toLowerCase().includes("fir") ||
    name.toLowerCase().includes("pine") ||
    name.toLowerCase().includes("spruce")
  ) {
    return `${scientificName}. Conífera ornamental de porte elegante, ideal para paisajismo y espacios amplios.`;
  }

  if (
    name.toLowerCase().includes("maple") ||
    scientificName.toLowerCase().includes("acer")
  ) {
    return `${scientificName}. Árbol ornamental apreciado por su follaje decorativo y cambios de color estacionales.`;
  }

  if (
    name.toLowerCase().includes("magnolia") ||
    scientificName.toLowerCase().includes("magnolia")
  ) {
    return `${scientificName}. Planta ornamental valorada por sus flores vistosas y presencia elegante en jardines.`;
  }

  if (
    name.toLowerCase().includes("cactus") ||
    name.toLowerCase().includes("succulent") ||
    scientificName.toLowerCase().includes("cact")
  ) {
    return `${scientificName}. Planta resistente de bajo mantenimiento, ideal para espacios secos o interiores luminosos.`;
  }

  if (
    name.toLowerCase().includes("fern") ||
    scientificName.toLowerCase().includes("pterid")
  ) {
    return `${scientificName}. Planta de follaje delicado, ideal para ambientes húmedos y espacios con luz indirecta.`;
  }

  return `${scientificName}. Planta de ciclo ${cycle}, ideal para ${category} y colecciones botánicas ornamentales.`;
}

function buildApiDescription(plant) {
  if (plant.description) {
    return plant.description;
  }

  const name = plant.common_name || "Esta planta";
  const scientificName =
    plant.scientific_name?.[0] ||
    "nombre científico no disponible";
  const cycle = translateCycle(plant.cycle).toLowerCase();
  const watering = translateWatering(plant.watering).toLowerCase();
  const sunlight = translateSunlight(plant.sunlight).toLowerCase();

  return `${name} (${scientificName}) es una especie registrada en la API de Perenual. Presenta un ciclo ${cycle}, requiere riego ${watering} y se recomienda ubicarla en condiciones de luz como ${sunlight}.`;
}

function getDifficultyLabel(careLevel, watering) {
  const value = `${careLevel || watering || ""}`.toLowerCase();

  if (value.includes("easy") || value.includes("minimum")) return "Fácil";
  if (value.includes("low")) return "Muy Fácil";
  if (
    value.includes("medium") ||
    value.includes("average") ||
    value.includes("moderate")
  ) return "Moderado";
  if (value.includes("high") || value.includes("frequent")) return "Difícil";

  return "Moderado";
}

function translateCycle(value) {
  const cycle = `${value || ""}`.toLowerCase();

  if (cycle.includes("perennial")) return "Perenne";
  if (cycle.includes("annual")) return "Anual";
  if (cycle.includes("biennial")) return "Bienal";

  return "No especificado";
}

function translateWatering(value) {
  const watering = `${value || ""}`.toLowerCase();

  if (watering.includes("minimum")) return "Muy bajo";
  if (watering.includes("average")) return "Moderado";
  if (watering.includes("frequent")) return "Frecuente";
  if (watering.includes("none")) return "Sin riego frecuente";

  return "No especificado";
}

function translateGrowthRate(value) {
  const growth = `${value || ""}`.toLowerCase();

  if (growth.includes("low")) return "Bajo";
  if (growth.includes("medium")) return "Medio";
  if (growth.includes("high")) return "Alto";

  return "No especificado";
}

function translateCareLevel(value) {
  const care = `${value || ""}`.toLowerCase();

  if (care.includes("easy")) return "Fácil";
  if (care.includes("medium")) return "Moderado";
  if (care.includes("hard")) return "Difícil";

  return "No especificado";
}

function translateSunlight(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "No especificada";
  }

  return values
    .map((value) => {
      const sunlight = `${value}`.toLowerCase();

      if (sunlight.includes("full sun")) return "sol directo";
      if (sunlight.includes("part shade")) return "sombra parcial";
      if (sunlight.includes("full shade")) return "sombra completa";
      if (sunlight.includes("filtered shade")) return "sombra filtrada";

      return value;
    })
    .join(", ");
}