/**
 * Maps donor status codes to corresponding color indicators.
 * Used for UI elements to represent the status visually.
 */
export const donorStatusColorSchema = {
  INTENT_PROVIDED: 'warning', // Indicates that the intent has been provided but not yet reviewed.
  REJECTED: 'error', // Indicates that the donor's status has been rejected.
  APPROVED: 'success' // Indicates that the donor's status has been approved.
};

/**
 * Maps donor status codes to descriptive text labels.
 * Used for displaying user-friendly status messages in the UI.
 */
export const donorStatusTextSchema = {
  INTENT_PROVIDED: 'Intent Provided', // Status when the donor has submitted their intent.
  REJECTED: 'Rejected', // Status when the donor is rejected.
  APPROVED: 'Approved' // Status when the donor is approved.
};

export const defaultCountry = 'AE';
export const preferredCountries = ['US', 'AE'];
