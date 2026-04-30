import { useSelector } from 'react-redux'; // Import useSelector hook from Redux to access the global state

/**
 * Custom hook to convert currency based on the current rate stored in Redux.
 * @returns {Function} - A function that takes a number and returns the converted currency value.
 */
export const useCurrencyConvert = () => {
  // Access the exchange rate from the Redux state (specifically from `settings` slice).
  const { rate } = useSelector((state) => state.settings);

  /**
   * Convert the given number to the target currency using the exchange rate.
   * @param {number} number - The amount to be converted.
   * @returns {number} - The converted currency value rounded to one decimal place.
   */
  const convertCurrency = (number) => {
    return Number((number * rate).toFixed(1)); // Multiply the number by the rate and round to 1 decimal place
  };

  return convertCurrency; // Return the conversion function
};
