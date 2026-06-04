function base64url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateFakeJWT(user) {
  const header = base64url(JSON.stringify({
    alg: "HS256",
    typ: "JWT"
  }));

  const payload = base64url(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }));

  const signature = base64url(`greenhouse-signature-${user.id}`);

  return `${header}.${payload}.${signature}`;
}

export function decodeJWTPayload(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const paddedPayload = payload + "==".slice(0, (4 - payload.length % 4) % 4);

    return JSON.parse(
      decodeURIComponent(
        escape(
          atob(
            paddedPayload
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        )
      )
    );
  } catch (error) {
    console.error("Error al decodificar el JWT:", error);
    return null;
  }
}

export function isJWTExpired(token) {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    return true;
  }

  return Math.floor(Date.now() / 1000) > payload.exp;
}