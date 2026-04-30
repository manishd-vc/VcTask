/**
 * Finds an object in an array by matching a specific label value.
 * @param {Array} data - The array of objects to search in.
 * @param {string} targetLabel - The label value to match.
 * @returns {Object | null} - The matched object if found, otherwise null.
 */
export const getLabelObject = (data, targetLabel) => {
  // Ensure the input is an array
  if (!Array.isArray(data)) {
    console.error('Input data should be an array.');
    return null;
  }

  // Search for the object with a matching label
  const matchedItem = data.find((item) => item.label === targetLabel);

  // Log a warning if no match is found
  if (!matchedItem) {
    console.warn(`No item found for label: ${targetLabel}`);
    return null;
  }

  // Return the matched object
  return matchedItem;
};
