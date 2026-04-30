import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------
// Number and Currency Formatting Utility Functions
// These functions provide various ways to format numbers, percentages,
// currencies, and data sizes, using `numeral` and `Intl.NumberFormat`.
// ----------------------------------------------------------------------

const locale = 'en-US'; // Default locale for formatting

/**
 * Formats a number as a currency string using the browser's Intl API.
 * The currency type is determined by the environment variable `BASE_CURRENCY`.
 * @param {number} number - The value to format.
 * @returns {string} The formatted currency string (excluding the currency symbol).
 */
export function fCurrency(number) {
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: process.env.BASE_CURRENCY // e.g., 'USD', 'EUR', etc.
  });

  // Removes the currency symbol from the formatted string
  return currency.format(number).slice(0, -1);
}

/**
 * Formats a number as a percentage string (e.g., 0.25 -> "25.0%").
 * @param {number} number - The value to format.
 * @returns {string} The formatted percentage string.
 */
export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

/**
 * Formats a number with default numeral formatting (e.g., thousands separators).
 * @param {number} number - The value to format.
 * @returns {string} The formatted number string.
 */
export function fNumber(number) {
  return numeral(number).format();
}

/**
 * Shortens a large number using numeral's shorthand (e.g., 1000 -> "1k").
 * Removes trailing decimals for cleaner formatting (e.g., "1.00k" -> "1k").
 * @param {number} number - The value to format.
 * @returns {string} The shortened number string.
 */
export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

/**
 * Formats a number as a data size string in bytes (e.g., 1024 -> "1.0 b").
 * @param {number} number - The value to format.
 * @returns {string} The formatted data size string.
 */
export function fData(number) {
  return numeral(number).format('0.0 b');
}

export const removeCommas = (numberString) => {
  // Convert the input to a string if it's not already
  numberString = String(numberString);

  if (!numberString.includes(',')) {
    return numberString; // Return as is if no commas are found
  }
  return numberString.replace(/,/g, '');
};
