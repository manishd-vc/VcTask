import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook that formats numbers into currency format based on the selected currency.
 * It uses the currency from Redux store and optionally, a different currency passed as a parameter.
 *
 * @param {string} curr - The currency to format the number with (optional, defaults to Redux store value).
 * @returns {function} formatCurrency - A function that formats a given number into the selected currency format.
 */
export const useCurrencyFormatter = (curr) => {
  const { currency } = useSelector((state) => state.settings); // Access the currency setting from Redux store

  const [formatter, setFormatter] = useState(null); // State to store the currency formatter
  const locale = 'en-US'; // Locale used for number formatting, typically 'en-US'

  useEffect(() => {
    // If currency and locale are available, create a new currency formatter
    if (currency && locale) {
      const newFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr || currency // Use the passed currency or fallback to Redux store value
      });
      setFormatter(newFormatter); // Update the formatter state with the new formatter
    }
  }, [currency, locale, curr]); // Re-run the effect when currency, locale, or curr change

  /**
   * Format a number into the selected currency format.
   *
   * @param {number} number - The number to be formatted.
   * @returns {string} - The formatted currency string.
   */
  const formatCurrency = (number) => {
    if (!formatter) return number; // Return the number as is if the formatter is not yet available
    return formatter.format(Number(number)).slice(0, -1); // Format the number and remove the trailing symbol
  };

  return formatCurrency; // Return the formatting function
};
