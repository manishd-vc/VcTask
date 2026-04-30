/**
 * Extracts an object from an array based on a matching label.
 * @param {Array} data - The array of objects to search within.
 * @param {string} targetLabel - The label to search for in the objects.
 * @returns {Object | null} The object with the matching label, or null if not found.
 */
export const getLabelObject = (data, targetLabel) => {
  if (!Array.isArray(data)) {
    return null;
  }

  const matchedItem = data.find((item) => item.label === targetLabel);

  if (!matchedItem) {
    console.warn(`No item found for label: ${targetLabel}`);
    return null;
  }

  return matchedItem;
};
