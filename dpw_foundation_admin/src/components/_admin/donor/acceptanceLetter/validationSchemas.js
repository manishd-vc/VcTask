import { isValidPhoneNumber } from 'libphonenumber-js';
import * as Yup from 'yup';

const phoneValidation = (label, isRequired = true) => {
  let schema = Yup.string().test('is-valid-phone', `Please enter a valid ${label}`, function (value) {
    if (!value) return true;
    try {
      const isValid = isValidPhoneNumber(value);
      if (!isValid) {
        return this.createError({
          message: `The ${label} is not valid.`
        });
      }
      return true;
    } catch (error) {
      return this.createError({
        message: 'Invalid phone number format.'
      });
    }
  });

  if (isRequired) {
    schema = schema.required(`${label} is required`);
  }

  return schema;
};

const commonFields = {
  documentDetails: Yup.array().of(
    Yup.object().shape({
      documentType: Yup.string()
        .required('Document type is required')
        .test('unique-documentType', 'Each document type must be unique', function (value) {
          const { options } = this;
          const { documentDetails } = options.context;
          const duplicates = documentDetails.filter((doc) => doc.documentType === value);
          return duplicates.length <= 1;
        }),
      documentNumber: Yup.string().required('Document number is required'),
      documentValidity: Yup.date()
        .nullable()
        .typeError('Please Enter a Valid Date')
        .required('Document validity is required')
    })
  ),
  mobile: phoneValidation('Mobile number', true),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  currentCountryOfResidence: Yup.string().required('Country of residence is required'),
  donationAmount: Yup.string().required('Donation amount is required'),
  donationCurrency: Yup.string().required('Donation currency is required'),
  donationMethod: Yup.string().required('Donation type is required'),
  isTaxReceiptRequired: Yup.string().required('Tax recepit is required'),
  isActivityUpdateRequired: Yup.string().required('Activity updated is required'),
  mailingAddress: Yup.string().required('Mailing Address is required'),
  preferredCommunication: Yup.string().required('Preferred Communication is required')
};

export const getValidationSchema = (isAdvanced, isDpwEmployee, donorType) => {
  const individualDonor = donorType === 'Individual';

  const advance =
    isAdvanced === 'yes'
      ? {
          occupation: Yup.string().required('Occupation are required')
          // employer: Yup.string().required('Employer is required')
        }
      : {};

  const dpwEmp =
    isDpwEmployee === 'yes'
      ? {
          employeeId: Yup.string().required('EmployeeId are required'),
          // employer: Yup.string().required('Employer is required'),
          companyName: Yup.string().required('Company Name is required'),
          department: Yup.string().required('Department is required')
        }
      : {};

  const conditionalFields = {
    ...commonFields,
    dob: individualDonor ? Yup.string().required('DOB is required') : Yup.string(),
    gender: individualDonor ? Yup.string().required('Gender is required') : Yup.string(),
    organizationName: !individualDonor ? Yup.string().required('Organization Name is required') : Yup.string(),
    organizationInfo: !individualDonor ? Yup.string().required('Organization Info is required') : Yup.string(),
    emergencyContactNumber: phoneValidation('emergency contact number', individualDonor),
    designation: !individualDonor ? Yup.string().required('Designation is required') : Yup.string(),
    organizationRegistrationNumber: !individualDonor
      ? Yup.string().required('Organization Registration Number is required')
      : Yup.string(),
    userPaymentChannel: !individualDonor ? Yup.string().required('Payment Through is required') : Yup.string()
  };

  return Yup.object({
    ...conditionalFields,
    ...advance,
    ...dpwEmp
  });
};

export const step1Field = [
  'passportAttachments',
  'mobile',
  'dob',
  'gender',
  'currentCountryOfResidence',
  'state',
  'city',
  'mailingAddress',
  'preferredCommunication',
  'emergencyContactNumber',
  'acknowledgementPreference',
  'isDpwEmployee',
  'isGovAffiliate'
];

export const orgFields = [
  'passportAttachments',
  'mobile',
  'organizationName',
  'organizationInfo',
  'designation',
  'currentCountryOfResidence',
  'state',
  'city',
  'mailingAddress',
  'organizationRegistrationNumber',
  'preferredCommunication',
  'userPaymentChannel',
  'acknowledgementPreference',
  'isDpwEmployee',
  'isGovAffiliate'
];

export const step2Field = [
  'donationAmount',
  'donationCurrency',
  'donationType',
  'userPaymentChannel',
  'isConsentProvided'
];
