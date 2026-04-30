import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import AddCertificationDialog from 'src/components/dialog/AddCertificationDialog';
import AddSupportingDocumentDialog from 'src/components/dialog/AddSupportingDocumentDialog';
import VolunteerReleaseDialog from 'src/components/dialog/VolunteerReleaseDialog';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import SkillCertificationsTable from 'src/components/table/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/table/VolunteeringSupportDocumentsTable';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { defaultCountry, preferredCountries } from 'src/utils/constants';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { formatDateWithFallback } from 'src/utils/formatTime';
import DocumentSection from '../../grant-management/create-request/DocumentSection';

export default function EnrollVolunteerStep1() {
  const { values, getFieldProps, errors, touched, setFieldValue, handleBlur } = useFormikContext();
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openVolunteerReleaseDialog, setOpenVolunteerReleaseDialog] = useState(false);
  const { volunteerEnrollmentData, volunteerEnrollmentLoading } = useSelector((state) => state?.volunteer);
  const { masterData } = useSelector((state) => state?.common);
  const salutations = getLabelObject(masterData, 'dpw_foundation_user_salutation');
  const maritalStatusData = getLabelObject(masterData, 'dpw_foundation_user_marital_status');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const languageData = getLabelObject(masterData, 'dpwf_language');
  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const dispatch = useDispatch();
  const {
    accountType,
    email,
    firstName,
    lastName,
    phoneNumber,
    otherLanguage,
    volunteeringArea,
    salutation,
    dob,
    maritalStatus,
    gender,
    currentCountryOfResidence,
    state,
    city,
    mailingAddress,
    preferredCommunication,
    emergencyContactName,
    emergencyContactNumber,
    homeAddress,
    relationWithEmergencyContact,
    isDpwEmployee,
    employeeId,
    companyName,
    department,
    dlAvailability,
    carAvailability,
    homePhoneNumber,
    nativeLanguage
  } = volunteerEnrollmentData || {};
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.up('md'));

  const formatLabels = (masterData, category, items = [], fallback = '-') => {
    if (!Array.isArray(items) || items.length === 0) return fallback;

    const labels = items.map((item) => (item ? getLabelByCode(masterData, category, item.code) : null)).filter(Boolean);

    return labels.length ? labels.join(', ') : fallback;
  };

  const languageLabels = formatLabels(masterData, 'dpwf_language', otherLanguage);
  const volunteeringAreaLabels = formatLabels(masterData, 'dpw_foundation_user_volunteering', volunteeringArea);

  const { data: projectStateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on selected state
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  const { mutate: deleteSkillCertification } = useMutation(
    'deleteSkillCertification',
    (id) => volunteerApi.deleteSkillCertification(id),
    {
      onSuccess: (response, deletedId) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        // Remove from local state instead of refetching
        const updatedCertifications = values.skillCertifications.filter((cert) => cert.id !== deletedId);
        setFieldValue('skillCertifications', updatedCertifications);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: deleteVolunteeringSupportDocument } = useMutation(
    'deleteVolunteeringSupportDocument',
    (id) => volunteerApi.deleteVolunteeringSupportDocument(id),
    {
      onSuccess: (response, deletedId) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        // Remove from local state instead of refetching
        const updatedDocuments = values.volunteeringSupportDocuments.filter((doc) => doc.id !== deletedId);
        setFieldValue('volunteeringSupportDocuments', updatedDocuments);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const formatYesNo = (value) => (value ? 'Yes' : 'No');
  const formatBoolean = (value) => (value ? 'true' : 'false');
  const mapSelectedValues = (selectedItems = [], masterDataValues = []) => {
    if (!Array.isArray(selectedItems) || !Array.isArray(masterDataValues)) return [];

    return selectedItems.map((item) => masterDataValues.find((data) => data.code === item.code) || null);
  };

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        volunteer information form
      </Typography>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
        Profile details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {accountType || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Email ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {email || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {firstName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Second Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {lastName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {phoneNumber || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          {salutation && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Salutation
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_salutation', salutation) || ''}
              </Typography>
            </Stack>
          )}
          {!salutation && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.salutation && errors.salutation}>
              <TextFieldSelect
                id="salutation"
                label={
                  <>
                    Select Salutation 
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={salutations?.values}
                value={values?.salutation}
                error={touched.salutation && Boolean(errors.salutation)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {dob && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatDateWithFallback(dob)}
              </Typography>
            </Stack>
          )}
          {!dob && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.dob && errors.dob}>
              <DatePickers
                label={
                  <>
                    Select Date of Birth{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat={'dd-MM-yyyy'}
                onChange={(newFromDate) => {
                  setFieldValue('dob', newFromDate);
                }}
                maxDate={new Date()}
                value={values?.dob}
                handleClear={() => {
                  setFieldValue('dob', null);
                }}
                error={touched.dob && Boolean(errors.dob)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {maritalStatus && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Marital Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_marital_status', maritalStatus) || ''}
              </Typography>
            </Stack>
          )}
          {!maritalStatus && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <TextFieldSelect
                id="maritalStatus"
                label="Select Marital Status"
                getFieldProps={getFieldProps}
                itemsData={maritalStatusData?.values}
                value={values?.maritalStatus}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {gender && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_gender', gender) || ''}
              </Typography>
            </Stack>
          )}
          {!gender && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.gender && errors.gender}>
              <TextFieldSelect
                id="gender"
                label={
                  <>
                    Select Gender{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={genders?.values}
                value={values?.gender}
                error={touched.gender && Boolean(errors.gender)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {currentCountryOfResidence && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Country
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {country?.find((c) => c.code === values?.currentCountryOfResidence)?.label || ''}
              </Typography>
            </Stack>
          )}
          {!currentCountryOfResidence && (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
            >
              <TextFieldSelect
                id="currentCountryOfResidence"
                label={
                  <>
                    Select Country{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={country}
                error={touched.currentCountryOfResidence && Boolean(errors.currentCountryOfResidence)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {state && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                State
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {projectStateData?.find((s) => s.code === values?.state)?.label || ''}
              </Typography>
            </Stack>
          )}
          {!state && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.state && errors.state}>
              <TextFieldSelect
                id="state"
                label={
                  <>
                    Select State/Province{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={projectStateData}
                disabled={!values?.currentCountryOfResidence}
                error={touched.state && Boolean(errors.state)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {city && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                City
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {city || ''}
              </Typography>
            </Stack>
          )}{' '}
          {!city && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.city && errors.city}>
              <TextFieldSelect
                id="city"
                label={
                  <>
                    Select City{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                getFieldProps={getFieldProps}
                itemsData={citiesData}
                disabled={!values?.state}
                error={touched.city && Boolean(errors.city)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {mailingAddress && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Mailing Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {mailingAddress || ''}
              </Typography>
            </Stack>
          )}
          {!mailingAddress && (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.mailingAddress && errors.mailingAddress}
            >
              <TextField
                id="mailingAddress"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Mailing Address{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('mailingAddress')}
                error={touched.mailingAddress && Boolean(errors.mailingAddress)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {preferredCommunication && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Preferred Communication Mode
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', preferredCommunication) || '-'}
              </Typography>
            </Stack>
          )}
          {!preferredCommunication && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <TextFieldSelect
                id="preferredCommunication"
                label="Select Preferred Communication Mode"
                getFieldProps={getFieldProps}
                itemsData={preferredCommunications?.values}
                value={values?.preferredCommunication}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {emergencyContactName && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Contact Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {emergencyContactName || ''}
              </Typography>
            </Stack>
          )}
          {!emergencyContactName && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <TextField
                id="emergencyContactName"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label="Enter Emergency Contact Name"
                fullWidth
                {...getFieldProps('emergencyContactName')}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {emergencyContactNumber && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Contact Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {emergencyContactNumber || '-'}
              </Typography>
            </Stack>
          )}
          {!emergencyContactNumber && (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.emergencyContactNumber && errors.emergencyContactNumber}
            >
              <MuiTelInput
                label={
                  <>
                    Enter Emergency Contact Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                id="emergencyContactNumber"
                preferredCountries={preferredCountries}
                defaultCountry={defaultCountry}
                fullWidth
                value={values.emergencyContactNumber}
                onChange={(value) => {
                  const cleanedValue = value ? value.replace(/\s/g, '') : '';
                  setFieldValue('emergencyContactNumber', cleanedValue);
                }}
                onBlur={handleBlur('emergencyContactNumber')} // Make sure this is present
                variant="standard"
                error={touched.emergencyContactNumber && Boolean(errors.emergencyContactNumber)}
                sx={{
                  '& .MuiInputAdornment-root .MuiButtonBase-root': {
                    right: 6
                  }
                }}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {homeAddress && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Residential Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {homeAddress || '-'}
              </Typography>
            </Stack>
          )}
          {!homeAddress && (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading} error={touched.homeAddress && errors.homeAddress}>
              <TextField
                id="homeAddress"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Emergency Residential Address{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('homeAddress')}
                error={touched.homeAddress && Boolean(errors.homeAddress)}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {relationWithEmergencyContact && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Relation with Emergency Contact
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {relationWithEmergencyContact || '-'}
              </Typography>
            </Stack>
          )}
          {!relationWithEmergencyContact && (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.relationWithEmergencyContact && errors.relationWithEmergencyContact}
            >
              <TextField
                id="relationWithEmergencyContact"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                label={
                  <>
                    Enter Relation with Emergency Contact{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                fullWidth
                {...getFieldProps('relationWithEmergencyContact')}
                error={touched.relationWithEmergencyContact && errors.relationWithEmergencyContact}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
      </Grid>
      <Box sx={{ my: 3 }}>
        <DocumentSection entityId={volunteerEnrollmentData?.userId} />
      </Box>

      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        volunteering information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {isDpwEmployee && (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Is DPW Group Employee?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatYesNo(isDpwEmployee)}
              </Typography>
            </Stack>
          )}
          {!isDpwEmployee && (
            <FormControl component="fieldset">
              <FormLabel id="isDPWGroupEmployee-radio-buttons-group-label" sx={{ mb: 1 }}>
                <Typography variant="body3" color="text.secondary">
                  Is DPW Group Employee?
                </Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="isDPWGroupEmployee-radio-buttons-group-label"
                name="isDpwEmployee"
                value={formatBoolean(values?.isDpwEmployee)}
                onChange={(e) => {
                  setFieldValue('isDpwEmployee', e.target.value === 'true');
                  if (e.target.value === 'false') {
                    setFieldValue('employeeId', '');
                    setFieldValue('companyName', '');
                    setFieldValue('department', '');
                  }
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )}
          {values?.isDpwEmployee && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {employeeId ? (
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Employee ID
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {employeeId || ''}
                    </Typography>
                  </Stack>
                ) : (
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.employeeId && errors.employeeId}
                  >
                    <TextField
                      id="employeeId"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Enter Employee ID
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('employeeId')}
                      error={touched.employeeId && Boolean(errors.employeeId)}
                    />
                  </FieldWithSkeleton>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {companyName ? (
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Company Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {companyName || ''}
                    </Typography>
                  </Stack>
                ) : (
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.companyName && errors.companyName}
                  >
                    <TextField
                      id="companyName"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Enter Company
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('companyName')}
                      error={touched.companyName && Boolean(errors.companyName)}
                    />
                  </FieldWithSkeleton>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {department ? (
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {department || ''}
                    </Typography>
                  </Stack>
                ) : (
                  <FieldWithSkeleton
                    isLoading={volunteerEnrollmentLoading}
                    error={touched.department && errors.department}
                  >
                    <TextField
                      id="department"
                      variant="standard"
                      inputProps={{ maxLength: 256 }}
                      label={
                        <>
                          Enter Department
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      {...getFieldProps('department')}
                      error={touched.department && Boolean(errors.department)}
                    />
                  </FieldWithSkeleton>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {dlAvailability ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Have Driver License?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatYesNo(dlAvailability)}
              </Typography>
            </Stack>
          ) : (
            <FormControl component="fieldset">
              <FormLabel id="haveDriverLicense-radio-buttons-group-label" sx={{ mb: 1 }}>
                <Typography variant="body3" color="text.secondary">
                  Have Driver License?
                </Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="haveDriverLicense-radio-buttons-group-label"
                name="dlAvailability"
                value={formatBoolean(values?.dlAvailability)}
                onChange={(e) => {
                  setFieldValue('dlAvailability', e.target.value === 'true');
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {carAvailability ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Has Own Car?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatYesNo(carAvailability)}
              </Typography>
            </Stack>
          ) : (
            <FormControl component="fieldset">
              <FormLabel id="haveCar-radio-buttons-group-label" sx={{ mb: 1 }}>
                <Typography variant="body3" color="text.secondary">
                  Has Own Car?
                </Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="haveCar-radio-buttons-group-label"
                name="carAvailability"
                value={formatBoolean(values?.carAvailability)}
                onChange={(e) => {
                  setFieldValue('carAvailability', e.target.value === 'true');
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {homePhoneNumber ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Home Phone
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {homePhoneNumber || ''}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.homePhoneNumber && errors.homePhoneNumber}
            >
              <MuiTelInput
                label={
                  <>
                    Enter Home Phone{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                id="homePhoneNumber"
                preferredCountries={preferredCountries}
                defaultCountry={defaultCountry}
                fullWidth
                value={values.homePhoneNumber}
                variant="standard"
                onChange={(value) => {
                  const cleanedValue = value ? value.replace(/\s/g, '') : '';
                  setFieldValue('homePhoneNumber', cleanedValue);
                }}
                onBlur={handleBlur('homePhoneNumber')}
                error={touched.homePhoneNumber && Boolean(errors.homePhoneNumber)}
                sx={{
                  '& .MuiInputAdornment-root .MuiButtonBase-root': {
                    right: 6
                  }
                }}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {nativeLanguage ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Native Language
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpwf_language', nativeLanguage) || ''}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton
              isLoading={volunteerEnrollmentLoading}
              error={touched.nativeLanguage && errors.nativeLanguage}
            >
              <TextFieldSelect
                id="nativeLanguage"
                label={
                  <>
                    Select Native Language
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                value={values?.nativeLanguage}
                getFieldProps={getFieldProps}
                itemsData={languageData?.values}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {otherLanguage && otherLanguage.length > 0 ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Other Language Proficiency
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {languageLabels}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <Autocomplete
                multiple
                limitTags={2}
                options={languageData?.values || []}
                value={mapSelectedValues(values?.otherLanguage, languageData?.values)}
                onChange={(event, newValue) => {
                  setFieldValue(
                    'otherLanguage',
                    newValue.map((option) => ({ code: option?.code }))
                  );
                }}
                getOptionLabel={(option) => (option && option?.label) || ''}
                isOptionEqualToValue={(option, value) => option?.code === value?.code}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option?.label} {...getTagProps({ index })} key={option?.code || index} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Other Language Proficiency"
                    variant="standard"
                    error={touched.otherLanguage && Boolean(errors.otherLanguage)}
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
                renderOption={(props, item) => (
                  <li {...props} key={item.code}>
                    {item?.label}
                  </li>
                )}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {volunteeringArea && volunteeringArea.length > 0 ? (
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Volunteering Areas of Interest
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteeringAreaLabels}
              </Typography>
            </Stack>
          ) : (
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <Autocomplete
                multiple
                limitTags={2}
                options={userVolunteering?.values}
                value={mapSelectedValues(values?.volunteeringArea, userVolunteering?.values)}
                onChange={(event, newValue) => {
                  setFieldValue(
                    'volunteeringArea',
                    newValue.map((option) => ({ code: option?.code }))
                  );
                }}
                getOptionLabel={(option) => (option && option?.label) || ''}
                isOptionEqualToValue={(option, value) => option?.code === value?.code}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option?.label} {...getTagProps({ index })} key={option?.code || index} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<>Select Volunteering Areas of Interests</>}
                    variant="standard"
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
                renderOption={(props, item) => (
                  <li {...props} key={item.code}>
                    {item?.label}
                  </li>
                )}
              />
            </FieldWithSkeleton>
          )}
        </Grid>
        {volunteeringArea && volunteeringArea.map((item) => item.code === 'other').includes(true) && (
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={volunteerEnrollmentLoading}>
              <TextField
                id="otherVolunteeringArea"
                variant="standard"
                fullWidth
                label="Add area of Interest"
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('otherVolunteeringArea')}
                value={values?.otherVolunteeringArea}
                onChange={(e) => setFieldValue('otherVolunteeringArea', e.target.value)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        <Grid item xs={12} mt={3}>
          <SkillCertificationsTable
            data={values.skillCertifications}
            isEditable={true}
            onAdd={(certData) => {
              setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
            }}
            onEdit={(certData) => {
              const updatedCerts = values.skillCertifications.map((cert) =>
                cert?.id === certData.id ? certData : cert
              );
              setFieldValue('skillCertifications', updatedCerts);
            }}
            onDelete={(cert) => {
              if (cert?.id) {
                deleteSkillCertification(cert.id);
              }
            }}
            userData={volunteerEnrollmentData}
            isUser={false}
          />
          {openCertificationDialog && (
            <AddCertificationDialog
              open={openCertificationDialog}
              onClose={() => setOpenCertificationDialog(false)}
              userData={volunteerEnrollmentData}
              onSave={(certData) => {
                setFieldValue('skillCertifications', [...(values.skillCertifications || []), certData]);
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} mt={3}>
          <VolunteeringSupportDocumentsTable
            data={values.volunteeringSupportDocuments}
            isEditable={true}
            onAdd={(docData) => {
              setFieldValue('volunteeringSupportDocuments', [...(values.volunteeringSupportDocuments || []), docData]);
            }}
            onEdit={(docData) => {
              const updatedDocs = values.volunteeringSupportDocuments.map((doc) =>
                doc && doc.id === docData.id ? docData : doc
              );
              setFieldValue('volunteeringSupportDocuments', updatedDocs);
            }}
            onDelete={(doc) => {
              if (doc?.id) {
                deleteVolunteeringSupportDocument(doc.id);
              }
            }}
            userData={volunteerEnrollmentData}
            isUser={false}
          />

          {openDocumentDialog && (
            <AddSupportingDocumentDialog
              open={openDocumentDialog}
              onClose={() => setOpenDocumentDialog(false)}
              userData={volunteerEnrollmentData}
              onSave={(docData) => {
                setFieldValue('volunteeringSupportDocuments', [
                  ...(values.volunteeringSupportDocuments || []),
                  docData
                ]);
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.volunteerReleaseAccepted}
                onChange={(e) => {
                  if (!values.volunteerReleaseAccepted && e.target.checked) {
                    // open dialog first
                    setOpenVolunteerReleaseDialog(true);
                  } else {
                    // directly store boolean instead of string
                    setFieldValue('volunteerReleaseAccepted', e.target.checked);
                  }
                }}
              />
            }
            label="Volunteer Release and Undertaking"
          />
          {openVolunteerReleaseDialog && (
            <VolunteerReleaseDialog
              open={openVolunteerReleaseDialog}
              onClose={() => setOpenVolunteerReleaseDialog(false)}
              onAgree={() => {
                setFieldValue('volunteerReleaseAccepted', true);
                setOpenVolunteerReleaseDialog(false);
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
