import jwt from "jsonwebtoken";

/**
 * @function generateAccessToken
 * @description Generates a JWT access token with a 1-h expiry.
 * @param {any} data - Payload to be signed inside the token (e.g., admin ID).
 * @returns {string} - JWT access token or error message if generation fails.
 */
export function generateAccessToken(data: any) {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
      expiresIn: "1h",
    });
    return token;
  } catch (e) {
    return "something went wrong while generating access token";
  }
}

/**
 * @function generateRefreshToken
 * @description Generates a JWT refresh token. Expiry defaults to 1 day,
 * or 30 days when rememberMe is true.
 * @param {any} data - Payload to be signed inside the token (e.g., user ID).
 * @param {boolean} rememberMe - Whether to extend the token's lifetime.
 * @returns {string} - JWT refresh token or error message if generation fails.
 */
export function generateRefreshToken(data: any, rememberMe: boolean = false) {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
      expiresIn: rememberMe ? "30d" : "1d",
    });
    return token;
  } catch (e) {
    return "something went wrong while generating refresh token";
  }
}