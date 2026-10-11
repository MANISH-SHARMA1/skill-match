"use client";
/**
 * @constant KEY_ACCESS_TOKEN
 * @description - LocalStorage key for storing JWT access token.
 */
export const KEY_ACCESS_TOKEN = "access_token";

/**
 * @constant REDIRECT_PATH
 * @description - Redirect path key to store the intended path before login.
 */
export const REDIRECT_PATH = "redirectPath";

/**
 * @function getItem
 * @description Safely retrieves an item from localStorage (only in browser).
 * @param {string} key - The key to retrieve.
 * @returns {string | null} - The stored value, or null if not found.
 */
export function getItem(key: string): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}

/**
 * @function setItem
 * @description Safely sets a value in localStorage (only in browser).
 * @param {string} key - The key which to store the value.
 * @param {string} value - The value to store.
 * @returns {void}
 */
export function setItem(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

/**
 * @function removeItem
 * @description Safely removes a key from localStorage (only in browser).
 * @param {string} key - The key to remove.
 * @returns {void}
 */
export function removeItem(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}
