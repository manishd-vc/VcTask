'use server'; // Indicates that this module will run on the server side in Next.js

import { cookies } from 'next/headers'; // Import the cookies utility from Next.js headers

/**
 * Function to create a cookie with the specified name and token.
 * The cookie will expire in 1 day (maxAge = 1 day).
 *
 * @param {string} name - The name of the cookie.
 * @param {string} token - The token or value to store in the cookie.
 */
export async function createCookies(name, token) {
  // Calculate the timestamp for the expiration date (1 day from now)
  const OneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  // Set the cookie with the provided name, token, and expiration time
  await cookies().set(name, token, { maxAge: OneDay });
}

/**
 * Function to delete a cookie with the specified name.
 *
 * @param {string} name - The name of the cookie to delete.
 */
export async function deleteCookies(name) {
  // Delete the cookie by name
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function getToken(tokenName) {
  if (typeof window !== 'undefined') {
    let name = tokenName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (const c of ca) {
      let trimmed = c.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return '';
  }
  return '';
}
