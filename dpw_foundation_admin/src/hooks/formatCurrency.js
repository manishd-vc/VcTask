import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to format numbers as currency strings using the `Intl.NumberFormat` API.
 * The default currency is retrieved from the Redux store, but a custom currency can be provided.
 *
 * @param {string} [curr] - Optional custom currency code (e.g., "USD", "EUR").
 * @returns {Function} - A function to format numeric values as localized currency strings.
 */
export const useCurrencyFormatter = (curr) => {
  // Access the default currency from the Redux store's settings state
  const { currency } = useSelector((state) => state.settings);

  // State to store the currency formatter instance
  const [formatter, setFormatter] = useState(null);

  // Locale to use for currency formatting
  const locale = 'en-US';

  useEffect(() => {
    // Update the formatter whenever the currency or locale changes
    if (currency && locale) {
      const newFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr || currency // Use custom currency or fallback to default
      });
      setFormatter(newFormatter);
    }
  }, [currency, locale, curr]);

  /**
   * Formats a numeric value as a localized currency string.
   *
   * @param {number} number - The numeric value to format.
   * @returns {string} - The formatted currency string. If the formatter is not ready, returns the input number as is.
   */
  const formatCurrency = (number) => {
    if (!formatter) return number; // Return the number if formatter is not initialized
    return formatter.format(Number(number)).slice(0, -1); // Format and remove trailing symbol
  };

  return formatCurrency;
};
