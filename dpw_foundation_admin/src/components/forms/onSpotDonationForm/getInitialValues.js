import { DEFAULT_PHONE_CODE, onSpotDonationOBJ } from 'src/utils/onSpotUtils';

export const getInitialValues = (donorData) => {
  const defaultString = (val) => val || '';

  return {
    campaignId: donorData?.campaignId || null,
    email: defaultString(donorData?.email),
    accountType: defaultString(donorData?.accountType?.toLowerCase()),
    donationType: defaultString(donorData?.donationType),
    firstName: defaultString(donorData?.firstName),
    lastName: defaultString(donorData?.lastName),
    mobile: donorData?.mobile || DEFAULT_PHONE_CODE,
    gender: defaultString(donorData?.gender),
    currentCountryOfResidence: defaultString(donorData?.currentCountryOfResidence),
    state: defaultString(donorData?.state),
    city: defaultString(donorData?.city),
    donationAmount: defaultString(donorData?.donationAmount),
    currency: defaultString(donorData?.currency),
    intentDescription: defaultString(donorData?.intentDescription),
    paymentThrough: donorData?.paymentThrough || onSpotDonationOBJ.paymentLink,
    paymentOption: defaultString(donorData?.paymentOption),
    documentDetails:
      Array.isArray(donorData?.documentDetails) && donorData.documentDetails.length > 0
        ? donorData.documentDetails.map((doc) => ({
            id: doc?.id || '',
            documentType: doc?.documentType || '',
            documentNumber: doc?.documentNumber || '',
            documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
            documentImageId: doc?.documentImageId || '',
            fileName: doc?.fileName || '',
            preSignedUrl: doc?.preSignedUrl || ''
          }))
        : []
  };
};
