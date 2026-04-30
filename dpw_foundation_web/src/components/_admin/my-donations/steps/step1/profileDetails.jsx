import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import ProfilePicture from 'src/components/_main/profile/profilePicture';
import DatePickers from 'src/components/datePicker';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { defaultCountry, preferredCountries } from 'src/utils/util';

// Basic Info Section Component
const BasicInfo = ({ data, donorType, profileImg, setProfileImg, handleSelectProfile, updateImage }) => (
  <>
    <Grid item xs={12}>
      <Typography variant="subtitle4" color={'text.black'} textTransform={'uppercase'}>
        Profile Details
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <ProfilePicture
        imageUrl={profileImg && typeof profileImg === 'object' ? URL.createObjectURL(profileImg) : profileImg}
        onChange={(event) => {
          const file = Array.from(event.target.files || []);
          handleSelectProfile(file);
          setProfileImg(file[0]);
        }}
        name="photoFileId"
        updateImage={updateImage}
      />
    </Grid>
    <Grid item xs={12}>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body3" color="text.secondary">
          User ID
        </Typography>
        <Typography variant="subtitle4" color="text.secondarydark">
          {data?.donationPledgeId || '-'}
        </Typography>
      </Stack>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body3" color="text.secondary">
          Registered As
        </Typography>
        <Typography variant="subtitle4" color="text.secondarydark">
          {donorType ? donorType : 'Individual'}
        </Typography>
      </Stack>
    </Grid>
  </>
);

// Contact Info Section Component
const ContactInfo = ({ data, donorType }) => (
  <>
    <Grid item xs={12} sm={6}>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body3" color="text.secondary">
          {donorType === 'Individual' ? 'First Name' : 'Organization Contact Person First Name'}
        </Typography>
        <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
          {data?.firstName || '-'}{' '}
        </Typography>
      </Stack>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body3" color="text.secondary">
          {donorType === 'Individual' ? 'Second Name' : 'Organization Contact Person Second Name'}
        </Typography>
        <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
          {data?.lastName || '-'}{' '}
        </Typography>
      </Stack>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body3" color="text.secondary">
          {donorType === 'Individual' ? 'Email ID' : 'Organization Contact Person Email ID'}
        </Typography>
        <Typography variant="subtitle4" color="text.secondarydark">
          {data?.email || '-'}
        </Typography>
      </Stack>
    </Grid>
  </>
);

// Organization Fields Component
const OrganizationFields = ({ isLoading, touched, errors, getFieldProps }) => (
  <>
    <Grid item xs={12} sm={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.organizationName && errors.organizationName}>
        <TextField
          id="organizationName"
          variant="standard"
          inputProps={{ maxLength: 256 }}
          label={
            <>
              Enter Organization Name
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          fullWidth
          {...getFieldProps('organizationName')}
          error={Boolean(touched.organizationName && errors.organizationName)}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={12}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.organizationInfo && errors.organizationInfo}>
        <TextField
          id="organizationInfo"
          variant="standard"
          inputProps={{ maxLength: 256 }}
          label={
            <>
              Enter Organization Description (Please describe briefly what activities your organization perform in the
              field of charity )
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          fullWidth
          {...getFieldProps('organizationInfo')}
          error={Boolean(touched.organizationInfo && errors.organizationInfo)}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.designation && errors.designation}>
        <TextField
          id="designation"
          variant="standard"
          inputProps={{ maxLength: 256 }}
          label={
            <>
              Enter Contact Person Designation
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          fullWidth
          {...getFieldProps('designation')}
          error={Boolean(touched.designation && errors.designation)}
        />
      </FieldWithSkeleton>
    </Grid>
  </>
);

// Individual Fields Component
const IndividualFields = ({ isLoading, touched, errors, getFieldProps, values, setFieldValue, genders }) => (
  <>
    <Grid item xs={12} md={6}>
      <FieldWithSkeleton isLoading={isLoading}>
        <DatePickers
          label={'Select Date of Birth'}
          inputFormat={'yyyy-MM-dd'}
          onChange={(newFromDate) => {
            setFieldValue('dob', newFromDate);
          }}
          value={values?.dob}
          handleClear={() => {
            setFieldValue('dob', null);
          }}
          maxDate={new Date()}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.gender && errors.gender}>
        <TextFieldSelect
          id="gender"
          label={
            <>
              Select Gender
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          getFieldProps={getFieldProps}
          itemsData={genders?.values || []}
          value={values?.gender}
          error={Boolean(touched.gender && errors.gender)}
          sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
        />
      </FieldWithSkeleton>
    </Grid>
  </>
);

// Location Fields Component
const LocationFields = ({ isLoading, touched, errors, getFieldProps, country, stateData, citiesData, donorType }) => (
  <>
    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton
        isLoading={isLoading}
        error={touched.currentCountryOfResidence && errors.currentCountryOfResidence}
      >
        <TextFieldSelect
          id="currentCountryOfResidence"
          label={
            <>
              {donorType === 'Individual' ? 'Select Country' : 'Select Org. Country Where Registered'}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          getFieldProps={getFieldProps}
          itemsData={country}
          error={Boolean(touched.currentCountryOfResidence && errors.currentCountryOfResidence)}
          sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.state && errors.state}>
        <TextFieldSelect
          id="state"
          label={
            <>
              {donorType === 'Individual' ? 'Select State/Province' : 'Select Organization State/Province'}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          getFieldProps={getFieldProps}
          itemsData={stateData}
          error={Boolean(touched.state && errors.state)}
          sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.city && errors.city}>
        <TextFieldSelect
          id="city"
          label={
            <>
              {donorType === 'Individual' ? 'Select City' : 'Select Organization City'}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          getFieldProps={getFieldProps}
          itemsData={citiesData}
          error={Boolean(touched.city && errors.city)}
          sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
        />
      </FieldWithSkeleton>
    </Grid>
  </>
);

// Additional Fields Component
const AdditionalFields = ({
  isLoading,
  touched,
  errors,
  getFieldProps,
  values,
  setFieldValue,
  preferredCommunications,
  donorType
}) => (
  <>
    <Grid item xs={12} sm={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.mailingAddress && errors.mailingAddress}>
        <TextField
          id="mailingAddress"
          variant="standard"
          inputProps={{ maxLength: 256 }}
          label={
            <>
              Enter Mailing Address
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          fullWidth
          {...getFieldProps('mailingAddress')}
          error={Boolean(touched.mailingAddress && errors.mailingAddress)}
        />
      </FieldWithSkeleton>
    </Grid>

    {donorType !== 'Individual' && (
      <Grid item xs={12} sm={6}>
        <FieldWithSkeleton
          isLoading={isLoading}
          error={touched.organizationRegistrationNumber && errors.organizationRegistrationNumber}
        >
          <TextField
            id="organizationRegistrationNumber"
            variant="standard"
            inputProps={{ maxLength: 256 }}
            label={
              <>
                Enter Organization Registration Number
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            fullWidth
            {...getFieldProps('organizationRegistrationNumber')}
            error={Boolean(touched.organizationRegistrationNumber && errors.organizationRegistrationNumber)}
          />
        </FieldWithSkeleton>
      </Grid>
    )}

    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.preferredCommunication && errors.preferredCommunication}>
        <TextFieldSelect
          id="preferredCommunication"
          label={
            <>
              Select Preferred Communication Mode
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          getFieldProps={getFieldProps}
          itemsData={preferredCommunications?.values}
          value={values?.preferredCommunication}
          error={Boolean(touched.preferredCommunication && errors.preferredCommunication)}
          sx={{ '.MuiFormLabel-root': { paddingRight: { xs: '60px', md: 0 } } }}
        />
      </FieldWithSkeleton>
    </Grid>

    <Grid item xs={12} sm={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.emergencyContactName && errors.emergencyContactName}>
        <TextField
          id="emergencyContactName"
          variant="standard"
          inputProps={{ maxLength: 256 }}
          label={<>Enter Emergency Contact Name</>}
          fullWidth
          {...getFieldProps('emergencyContactName')}
          error={Boolean(touched.emergencyContactName && errors.emergencyContactName)}
        />
      </FieldWithSkeleton>
    </Grid>
    <Grid item xs={12} sm={6} lg={6}>
      <FieldWithSkeleton isLoading={isLoading} error={touched.emergencyContactNumber && errors.emergencyContactNumber}>
        <MuiTelInput
          label={
            <>
              Emergency Contact Number
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          id="phone"
          preferredCountries={preferredCountries}
          defaultCountry={defaultCountry}
          fullWidth
          value={values.emergencyContactNumber}
          variant="standard"
          onChange={(value) => {
            setFieldValue('emergencyContactNumber', value);
          }}
          error={Boolean(touched.emergencyContactNumber && errors.emergencyContactNumber)}
          helperText={touched.emergencyContactNumber && errors.emergencyContactNumber}
          sx={{
            '& .MuiInputAdornment-root .MuiButtonBase-root': {
              right: 6
            }
          }}
        />
      </FieldWithSkeleton>
    </Grid>
  </>
);

// Phone Input Component
const PhoneInput = ({ isLoading, touched, errors, values, setFieldValue, donorType }) => (
  <Grid item xs={12} sm={6} lg={6}>
    <FieldWithSkeleton isLoading={isLoading} error={touched.mobile && errors.mobile}>
      <MuiTelInput
        label={
          <>
            {donorType === 'Individual' ? 'Mobile' : 'Organization Contact Person Number'}
            <Box component="span" sx={{ color: 'error.main' }}>
              *
            </Box>
          </>
        }
        id="phone"
        preferredCountries={preferredCountries}
        defaultCountry={defaultCountry}
        fullWidth
        value={values.mobile}
        variant="standard"
        onChange={(value) => {
          setFieldValue('mobile', value);
        }}
        error={Boolean(touched.mobile && errors.mobile)}
        helperText={touched.mobile && errors.mobile}
        sx={{
          '& .MuiInputAdornment-root .MuiButtonBase-root': {
            right: 6
          }
        }}
      />
    </FieldWithSkeleton>
  </Grid>
);

export default function ProfileDetails({ isLoading, data, donorType, profileImg, setProfileImg }) {
  const dispatch = useDispatch();
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);

  const [updateImage, setUpdateImage] = React.useState(false);

  // Get master data
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const preferredCommunications = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');

  // API queries
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const { data: stateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence,
      refetchOnWindowFocus: false
    }
  );
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state,
      refetchOnWindowFocus: false
    }
  );

  // Profile photo upload mutation
  const { mutate: uploadProfile } = useMutation('uploadProfile', api.uploadProfilePhoto, {
    onSuccess: (response) => {
      setUpdateImage(!updateImage);
      dispatch(setToastMessage({ message: response?.message, title: 'Success' }));
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response.data.message || error.response.data.detail,
          variant: 'error',
          title: 'Error'
        })
      );
    }
  });

  const handleSelectProfile = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadProfile,
      entityId: data?.createdBy,
      setToastMessage,
      dispatch
    });
  };

  // Effect to update profile image when user data changes
  React.useEffect(() => {
    if (data?.photoFileUrl) {
      setProfileImg(data?.photoFileUrl);
    }
  }, [data?.photoFileUrl, setProfileImg]);

  const commonProps = {
    isLoading,
    touched,
    errors,
    getFieldProps,
    values,
    setFieldValue,
    donorType
  };

  return (
    <>
      <BasicInfo
        data={data}
        donorType={donorType}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        handleSelectProfile={handleSelectProfile}
        updateImage={updateImage}
      />
      <ContactInfo data={data} donorType={donorType} />
      <PhoneInput {...commonProps} />
      {donorType !== 'Individual' ? (
        <OrganizationFields {...commonProps} />
      ) : (
        <IndividualFields {...commonProps} genders={genders} />
      )}
      <LocationFields {...commonProps} country={country} stateData={stateData} citiesData={citiesData} />
      <AdditionalFields {...commonProps} preferredCommunications={preferredCommunications} />
    </>
  );
}
