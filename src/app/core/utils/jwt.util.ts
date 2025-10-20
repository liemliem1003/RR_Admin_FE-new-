// src/app/utils/jwt.util.ts

export function decodeToken(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expiry = decoded.exp * 1000; // exp là Unix timestamp (seconds)
  return Date.now() > expiry;
}
