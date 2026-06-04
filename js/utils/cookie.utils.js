export function setCookie(name, value, maxAge = 3600) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

export function getCookie(name) {
  const key = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();

    if (cookie.startsWith(key)) {
      return decodeURIComponent(cookie.substring(key.length));
    }
  }

  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
}