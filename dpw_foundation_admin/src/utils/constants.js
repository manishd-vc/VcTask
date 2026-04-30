export const defaultCountry = 'AE';
export const preferredCountries = ['US', 'AE'];
export const normalizePartners = (partners = []) =>
  partners.map(({ partnerId, userId, ...rest }) =>
    partnerId && userId ? { partnerId, userId } : { partnerId, userId, ...rest }
  );

export const extractFieldLabel = (message, path) => {
  const patterns = [/^(.*) is required/, /^(.*) must contain/];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1];
  }
  return path;
};

export const setFieldErrorIfEmpty = (fieldValue, fieldPath, errorObj) => {
  if (!fieldValue) {
    errorObj[fieldPath] = true;
  }
};
