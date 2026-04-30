/**
 * Retrieves the label for a specific code within a given category.
 * @param {Array} data - The array of category objects to search within.
 * @param {string} targetCategory - The category label to search for.
 * @param {string | number} targetCode - The code to search for within the category.
 * @returns {string | null} The label for the matched code, or null if no match is found.
 */
export const getLabelByCode = (data, targetCategory, targetCode) => {
  const category = data.find((item) => item?.label === targetCategory);

  if (!category) {
    console.warn(`No category found for label: "${targetCategory}"`);
    return null;
  }

  const availableCodes = category.values?.map((item) => item.code) || [];

  if (!availableCodes.includes(targetCode)) {
    console.warn(`No value found for code: "${targetCode}". Available codes:`, availableCodes);
    return null;
  }

  return category.values.find((item) => item.code === targetCode)?.label || null;
};

// Color schema for campaign statuses
// - Purpose: Maps campaign statuses to their corresponding color codes for UI representation
export const approvalStatusColorSchema = {
  DRAFT: 'warning', // Campaign is in draft state
  PENDING_APPROVAL: 'warning', // Awaiting approval from a reviewer
  NEED_MORE_INFO: 'info', // Requires additional information
  REJECTED: 'error', // Campaign has been rejected
  APPROVED: 'success', // Campaign has been approved
  IACAD_REQUEST: 'warning', // Awaiting IACAD approval
  IACAD_APPROVED: 'success', // Approved by IACAD
  IACAD_REJECTED: 'error', // Rejected by IACAD
  COMPLETED: 'success', // Campaign has been completed
  ONGOING: 'success'
};
