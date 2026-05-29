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

// Función mejorada para determinar la categoría de la planta (Interior/Exterior)
function getPlantCategory(plant) {
  // Si la API ya tiene indoor definido, usarlo
  if (plant.indoor === true) return "Interior";
  if (plant.indoor === false) return "Exterior";
  
  // Si no, determinar por otros campos
  const sunlight = plant.sunlight || [];
  const watering = plant.watering || "";
  const cycle = plant.cycle || "";
  const name = (plant.common_name || "").toLowerCase();
  const scientificName = (plant.scientific_name?.[0] || "").toLowerCase();
  
  // Palabras clave para plantas de interior
  const interiorKeywords = [
    "indoor", "houseplant", "interior", "sombra", "shade", 
    "low light", "poca luz", "apartment", "oficina",
    "monstera", "sansevieria", "pothos", "philodendron", "fern", "helecho",
    "calathea", "maranta", "peace lily", "lirio de paz", "spider plant",
    "zz plant", "dracaena", "ficus", "aloe", "cactus", "suculent"
  ];
  
  // Palabras clave para plantas de exterior
  const exteriorKeywords = [
    "outdoor", "exterior", "garden", "jardín", "full sun", "sol directo",
    "tree", "árbol", "shrub", "arbusto", "perennial", "perenne",
    "maple", "pine", "oak", "roble", "pino"
  ];
  
  // Verificar por nombre común y científico
  for (const keyword of interiorKeywords) {
    if (name.includes(keyword) || scientificName.includes(keyword)) {
      return "Interior";
    }
  }
  
  for (const keyword of exteriorKeywords) {
    if (name.includes(keyword) || scientificName.includes(keyword)) {
      return "Exterior";
    }
  }
  
  // Verificar por necesidades de luz
  if (sunlight.some(s => s.toLowerCase().includes("shade") || s.toLowerCase().includes("indirect"))) {
    return "Interior";
  }
  
  if (sunlight.some(s => s.toLowerCase().includes("full sun"))) {
    return "Exterior";
  }
  
  // Verificar por riego (plantas de interior suelen necesitar menos riego)
  if (watering.toLowerCase().includes("minimum") || watering.toLowerCase().includes("low")) {
    return "Interior";
  }
  
  // Default basado en ciclo
  if (cycle.toLowerCase().includes("perennial")) {
    return "Exterior";
  }
  
  return "Interior";
}

// Función para obtener tipo específico de planta
function getPlantType(plant) {
  const name = (plant.common_name || "").toLowerCase();
  const scientificName = (plant.scientific_name?.[0] || "").toLowerCase();
  
  if (name.includes("cactus") || scientificName.includes("cact")) return "Cactus";
  if (name.includes("succulent") || name.includes("suculenta")) return "Suculenta";
  if (name.includes("monstera")) return "Tropical";
  if (name.includes("fern") || name.includes("helecho")) return "Helecho";
  if (name.includes("orchid") || name.includes("orquídea")) return "Orquídea";
  if (name.includes("palm") || name.includes("palma")) return "Palma";
  if (name.includes("ficus")) return "Ficus";
  if (name.includes("sansevieria")) return "Sansevieria";
  if (name.includes("aloe")) return "Aloe";
  if (name.includes("pothos") || name.includes("potus")) return "Pothos";
  if (name.includes("philodendron")) return "Filodendro";
  if (name.includes("calathea")) return "Calatea";
  if (name.includes("maranta")) return "Maranta";
  if (name.includes("dracaena")) return "Dracaena";
  if (name.includes("peace lily") || name.includes("lirio")) return "Lirio de Paz";
  if (name.includes("zz plant")) return "ZZ Plant";
  if (name.includes("rose") || name.includes("rosa")) return "Rosa";
  if (name.includes("lavender") || name.includes("lavanda")) return "Lavanda";
  if (name.includes("mint") || name.includes("menta")) return "Aromática";
  if (name.includes("basil") || name.includes("albahaca")) return "Aromática";
  
  return "Otra";
}

// Función para obtener una imagen válida
function getValidImageUrl(plant) {
  const imageUrl = 
    plant.default_image?.original_url ||
    plant.default_image?.regular_url ||
    plant.default_image?.medium_url ||
    plant.default_image?.small_url ||
    plant.image_url ||
    null;
  
  const isValidApiUrl = imageUrl && 
    imageUrl !== "https://perenual.com/storage/image/undefined" &&
    !imageUrl.includes("undefined") &&
    imageUrl !== "" &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));
  
  if (isValidApiUrl) {
    return imageUrl;
  }
  
  return getPlaceholderImage(plant.common_name || plant.scientific_name?.[0]);
}

// Función para obtener placeholder según el nombre de la planta
function getPlaceholderImage(plantName) {
  const name = (plantName || "").toLowerCase();
  
  if (name.includes("monstera")) {
    return "https://images.unsplash.com/photo-1614594972925-0f6a7ab4b1a1?w=400&h=300&fit=crop";
  }
  if (name.includes("sansevieria") || name.includes("lengua") || name.includes("snake")) {
    return "https://images.unsplash.com/photo-1593482892290-f54927f9793a?w=400&h=300&fit=crop";
  }
  if (name.includes("cactus") || name.includes("succulent")) {
    return "https://images.unsplash.com/photo-1484046217100-ff954bbde24d?w=400&h=300&fit=crop";
  }
  if (name.includes("aloe")) {
    return "https://images.unsplash.com/photo-1578297345415-b28e5ac1abde?w=400&h=300&fit=crop";
  }
  if (name.includes("helecho") || name.includes("fern")) {
    return "https://images.unsplash.com/photo-1595411596798-1c92f3597c28?w=400&h=300&fit=crop";
  }
  if (name.includes("orquídea") || name.includes("orchid")) {
    return "https://images.unsplash.com/photo-1566125882500-7e10f709b023?w=400&h=300&fit=crop";
  }
  if (name.includes("palm")) {
    return "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=400&h=300&fit=crop";
  }
  if (name.includes("ficus") || name.includes("rubber")) {
    return "https://images.unsplash.com/photo-1602526836071-7ffc1e5dc7cf?w=400&h=300&fit=crop";
  }
  if (name.includes("rose")) {
    return "https://images.unsplash.com/photo-1496062031457-0d8e9c67f6dc?w=400&h=300&fit=crop";
  }
  
  return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop";
}

function mapBasicApiPlant(plant) {
  return {
    id: `api-${plant.id}`,
    apiId: plant.id,
    name: plant.common_name || "Nombre no disponible",
    scientificName: plant.scientific_name?.[0] || "Nombre científico no disponible",
    description: buildApiShortDescription(plant),
    shortDescription: buildApiShortDescription(plant),
    category: getPlantCategory(plant),
    type: getPlantType(plant),
    difficulty: getDifficultyLabel(plant.care_level, plant.watering),
    image: getValidImageUrl(plant),
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
    category: getPlantCategory(plant),
    type: getPlantType(plant),
    difficulty: getDifficultyLabel(plant.care_level, plant.watering),
    image: getValidImageUrl(plant),
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
  const scientificName = plant.scientific_name?.[0] || "especie ornamental";

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
  const scientificName = plant.scientific_name?.[0] || "nombre científico no disponible";
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