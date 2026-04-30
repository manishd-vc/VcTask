import { useSelector } from 'react-redux';

/**
 * Custom hook to convert a given number into a different currency using the current exchange rate.
 * The exchange rate is retrieved from the Redux store's `settings` state.
 *
 * @returns {Function} - A function that accepts a number and returns the converted value.
 */
export const useCurrencyConvert = () => {
  // Access the exchange rate from the Redux store's settings state
  const { rate } = useSelector((state) => state.settings);

  /**
   * Converts a numeric value to a new currency using the exchange rate.
   *
   * @param {number} number - The numeric value to convert.
   * @returns {number} - The converted value, rounded to one decimal place.
   */
  const convertCurrency = (number) => {
    return Number((number * rate).toFixed(1));
  };

  return convertCurrency;
};
