export function saveCache(key, data, duration) {
  const payload = {
    data,
    expiresAt: Date.now() + duration
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

export function getCache(key) {
  const rawData = localStorage.getItem(key);

  if (!rawData) return null;

  try {
    const payload = JSON.parse(rawData);

    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return payload.data;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

export function clearCache(key) {
  localStorage.removeItem(key);
}