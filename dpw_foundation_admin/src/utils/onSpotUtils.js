export const DEFAULT_PHONE_CODE = '+971';

const PAYMENT_METHODS = {
  ON_SITE: 'On Site Payment',
  LINK: 'PAYMENT-LINK'
};

const DONATION_TYPE = {
  EVENT_SPECIFIC: 'EVENT_SPECIFIC'
};

export const defaultFormValues = {
  campaignId: null,
  accountType: '',
  donationType: '',
  donationAmount: '',
  currency: '',
  intentDescription: '',
  documentType: '',
  documentNumber: '',
  documentValidity: null,
  paymentThrough: PAYMENT_METHODS.LINK,
  paymentOption: '',
  documentDetails: [],
  email: '',
  firstName: '',
  lastName: '',
  mobile: DEFAULT_PHONE_CODE,
  gender: '',
  currentCountryOfResidence: '',
  state: '',
  city: ''
};
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const onSpotDonationOBJ = {
  paymentLink: PAYMENT_METHODS.LINK,
  eventSpecific: DONATION_TYPE.EVENT_SPECIFIC,
  onSitePayment: PAYMENT_METHODS.ON_SITE
};

export const RADIO_OPTIONS = [
  { value: PAYMENT_METHODS.LINK, label: 'Payment Link to Donor' },
  { value: PAYMENT_METHODS.ON_SITE, label: 'On-Site Payment' }
];

export const RADIO_ONSITE_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Online', label: 'Online' }
];

export const labelPaymentThrough = {
  [PAYMENT_METHODS.LINK]: 'Payment-Link',
  [PAYMENT_METHODS.ON_SITE]: 'On Site Payment'
};

export const getMatchingString = (items, searchValue, key, returnKey = 'label') => {
  if (!Array.isArray(items) || !searchValue) return '';
  const matchedItem = items.find((item) => item[key] === searchValue);
  return matchedItem?.[returnKey] || '';
};
