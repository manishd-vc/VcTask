// Regular expression to validate email addresses
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Mapping of donor statuses to corresponding color codes
export const donorStatusColorSchema = {
  DOCUMENT_MORE_INFO_REQUIRED: 'info',
  DOCUMENT_REJECTED: 'error',
  AWAITING_DOCUMENT_ACCEPTANCE: 'warning',
  READY_TO_DONATE: 'success',
  DONATED: 'success',
  DONOR_MORE_INFO_REQUIRED: 'info',
  DONATION_PENDING: 'warning',
  FAILED: 'error',
  DONATION_INITIATIVE: 'success',
  PAYMENT_IN_PROGRESS: 'warning',
  DONOR_REJECTED: 'error',
  PLEDGE_APPROVED: 'warning',
  PLEDGE_REJECTED: 'error',
  AWAITING_DONOR_INFO: 'warning',
  AWAITING_DOCUMENT_APPROVAL: 'warning',
  ASSESSMENT_MORE_INFO_REQUIRED: 'info',
  AWAITING_DOCUMENT_CREATION: 'warning',
  ASSESSMENT_REJECTED: 'error',
  ASSESSMENT_IACAD_REQUEST: 'warning',
  ASSESSMENT_IACAD_APPROVED: 'warning',
  ASSESSMENT_IACAD_REJECTED: 'error',
  WITHDRAWN: 'error',
  AWAITING_APPROVAL: 'warning',
  AWAITING_PLEDGE_APPROVAL: 'warning',
  IN_PROGRESS_HOD1: 'warning'
};
// Color schema for Grant statuses
// - Purpose: Maps donor statuses to their corresponding color codes for UI representation
export const grantStatusColorSchema = {
  REJECTED_SEEKER: 'error',
  AWAITING_IACAD_APPROVAL: 'warning',
  AWAITING_HOD1_APPROVAL: 'warning',
  AWAITING_COMPLIANCE_APPROVAL: 'warning',
  AWAITING_HOD2_APPROVAL: 'warning',
  AWAITING_DOCUMENT_CREATION: 'warning',
  GRANT_APPROVED: 'success',
  INITIAL: 'info',
  DRAFT: 'warning',
  PENDING_FOR_ASSESSMENT: 'warning',
  AWAITING_DOC_HOD2_APPROVAL: 'warning',
  AWAITING_SEEKER_APPROVAL: 'warning',
  AWAITING_SECURITY_APPROVAL: 'warning',
  AWAITING_DOC_LEGAL_APPROVAL: 'warning',
  AWAITING_DOC_HOD1_APPROVAL: 'warning',
  IN_PROGRESS_LEGAL: 'warning',
  IN_PROGRESS_DOC_HOD1: 'warning',
  IN_PROGRESS_DOC_HOD2: 'warning',
  FEEDBACK_REQUESTED_SEEKER: 'info',
  FEEDBACK_REQUESTED: 'info',
  IN_PROGRESS_ASSESSMENT: 'warning',
  IN_PROGRESS_IACAD: 'warning',
  IN_PROGRESS_SECURITY: 'warning',
  IN_PROGRESS_HOD1: 'warning',
  IN_PROGRESS_COMPLIANCE: 'warning',
  IN_PROGRESS_HOD2: 'warning',
  IN_PROGRESS_DOC_CREATION: 'warning',
  IN_PROGRESS_SEEKER: 'warning',
  REJECTED: 'error',
  REJECTED_GRANT_REQUEST: 'error',
  REJECTED_IACAD: 'error',
  WITHDRAWN: 'error'
};

export const partnerStatusColorSchema = {
  FEEDBACK_REQUESTED_PARTNER: 'info',
  IN_PROGRESS_SECURITY: 'warning',
  DRAFT: 'warning',
  IN_PROGRESS_ASSESSMENT: 'warning',
  REJECTED_PARTNERSHIP_REQUEST: 'error',
  IN_PROGRESS_COMPLIANCE: 'warning',
  IN_PROGRESS_HOD2: 'warning',
  REJECTED: 'error',
  WITHDRAWN: 'error',
  REJECTED_DOC_REQUEST: 'error',
  ACTIVE: 'success',
  EXPIRE: 'error',
  COMPLETE: 'success',
  TERMINATE: 'error',
  IN_PROGRESS_HOD1: 'warning',
  IN_PROGRESS_DOC_CREATION: 'warning',
  IN_PROGRESS_LEGAL: 'warning',
  IN_PROGRESS_DOC_HOD1: 'warning',
  IN_PROGRESS_DOC_HOD2: 'warning',
  IN_PROGRESS_PARTNER: 'warning',
  APPROVED: 'success',
  REJECTED_PARTNER: 'error'
};
export const enrolmentStatusColorSchema = {
  REQUEST_SUBMITTED: 'warning',
  APPROVED: 'success',
  REGRETTED: 'error',
  DRAFT: 'warning',
  Active: 'success',
  EXPIRE: 'error',
  INACTIVE: 'error',
  ACTIVE: 'success',
  Inactive: 'error'
};
export const inKindContributionStatusColorSchema = {
  WITHDRAWN: 'error',
  CONTRIBUTION_REJECTED_REQUEST: 'error',
  DRAFT: 'warning',
  FEEDBACK_REQUESTED: 'warning',
  IN_PROGRESS_SECURITY: 'warning',
  IN_PROGRESS_APPROVAL: 'info',
  IN_PROGRESS_COMPLIANCE: 'info',
  IN_PROGRESS_HOD1: 'warning',
  IN_PROGRESS_HOD2: 'warning',
  COMPLETED: 'success',
  IN_PROGRESS_ASSESSMENT: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  FEEDBACK_SUBMITTED: 'warning'
};
export const getImageUrl = (id) => {
  if (id) {
    return id;
  } else {
    return '/images/default.png';
  }
};

export const getMatchingString = (items, searchValue, key, returnKey = 'label') => {
  if (!Array.isArray(items) || !searchValue) return '';
  const matchedItem = items.find((item) => item[key] === searchValue);
  return matchedItem?.[returnKey] || '';
};

export const defaultCountry = 'AE';
export const preferredCountries = ['US', 'AE'];
