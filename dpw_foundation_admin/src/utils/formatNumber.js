import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

const locale = 'en-US';

/**
 * Formats a number as currency using the locale and environment-defined base currency.
 * @param {number} number - The number to format as currency.
 * @returns {string} The formatted currency string.
 */
export function fCurrency(number) {
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: process.env.BASE_CURRENCY
  });

  return currency.format(number).slice(0, -1);
}

/**
 * Formats a number as a percentage.
 * @param {number} number - The number to format as a percentage.
 * @returns {string} The formatted percentage string.
 */
export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

/**
 * Formats a number with standard grouping and decimal notation.
 * @param {number} number - The number to format.
 * @returns {string} The formatted number string.
 */
export function fNumber(number) {
  return numeral(number).format();
}

/**
 * Formats a number as a shortened string with appropriate suffix (e.g., 'k', 'm', 'b').
 * @param {number} number - The number to shorten.
 * @returns {string} The shortened number string.
 */
export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

/**
 * Formats a number in bytes with a single decimal point and appropriate unit (e.g., 'kB', 'MB').
 * @param {number} number - The number to format as data size.
 * @returns {string} The formatted data size string.
 */
export function fData(number) {
  return numeral(number).format('0.0 b');
}

export const isValidNumber = (input) => {
  // Use regex to check if the input contains only digits (no letters or special characters)
  return /^\d+$/.test(input);
};

export const removeCommaSeparator = (input) => {
  // Ensure the input is a string
  const strInput = String(input).trim();

  // Check for invalid characters (anything other than digits and commas)
  if (/[^0-9,]/.test(strInput)) {
    return number;
  }

  // Check for misplaced commas or invalid formatting
  if (!/^\d{1,3}(,\d{3})*$/.test(strInput) && !/^\d+$/.test(strInput)) {
    return number;
  }

  // Remove commas and convert to a number
  const number = parseInt(strInput.replace(/,/g, ''), 10);

  // Return the parsed number
  return number;
};
