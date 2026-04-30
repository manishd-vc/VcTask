'use server';

import { cookies } from 'next/headers';

/**
 * Sets a cookie with the specified name and token, expiring in 1 day.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} token - The value to store in the cookie.
 * @returns {Promise<void>} - Resolves when the cookie is set.
 */
export async function createCookies(name, token) {
  // Define the maximum age for the cookie (1 day in milliseconds)
  const OneDay = 24 * 60 * 60 * 1000;

  const cookieStore = await cookies(); // ✅ Await cookies()

  cookieStore.set(name, token, { maxAge: OneDay });
}

/**
 * Deletes a cookie with the specified name.
 *
 * @param {string} name - The name of the cookie to delete.
 * @returns {Promise<void>} - Resolves when the cookie is deleted.
 */
export async function deleteCookies(name) {
  // Delete the cookie with the specified name
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
