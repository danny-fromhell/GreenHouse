import { APP_CONFIG } from "../config/config.js";
import { getCache, saveCache } from "./cache.js";

export async function getPlants() {
  const cachedPlants = getCache(APP_CONFIG.cacheKey);

  if (cachedPlants) {
    return cachedPlants;
  }

  const response = await fetch(APP_CONFIG.plantDataUrl);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las plantas.");
  }

  const plants = await response.json();

  saveCache(APP_CONFIG.cacheKey, plants, APP_CONFIG.cacheDuration);

  return plants;
}

export async function getPlantById(id) {
  const plants = await getPlants();
  return plants.find((plant) => Number(plant.id) === Number(id));
}