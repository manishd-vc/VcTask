import { Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString } from 'src/utils/onSpotUtils';
import ProfilePicture from '../../../users/profilePicture';
import AdditionalDetails from './additionalDetails';
import DocumentDetails from './documentDetails';

const DonationForm = ({ isViewOnly }) => {
  const { masterData } = useSelector((state) => state?.common);
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const dispatch = useDispatch();
  const {
    photoUrl,
    email,
    accountType,
    mobile,
    dob,
    gender,
    firstName,
    lastName,
    state,
    city,
    mailingAddress,
    preferredCommunication,
    emergencyContactName,
    emergencyContactNumber,
    currentCountryOfResidence,
    organizationDetails,
    userId
  } = getDonorAdminData || {};

  const isIndividual = accountType === 'Individual';
  const { data: country } = useQuery(['getCountry'], () => api.getCountry(), {
    enabled: !!currentCountryOfResidence
  });
  const { data: stateListData } = useQuery(['getStates'], () => api.getStates(currentCountryOfResidence), {
    enabled: !!state
  });

  const genderData = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const donorGender = getMatchingString(genderData?.values, gender, 'code');
  const countryData = getMatchingString(country, currentCountryOfResidence, 'code');
  const stateData = getMatchingString(stateListData, state, 'code');
  const preferredCommunicationData = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const preferredCommunicationMode = getMatchingString(
    preferredCommunicationData?.values,
    preferredCommunication,
    'code'
  );

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black">
        Donor Information Form{' '}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle4" color="text.black" mt={3} component={'p'} textTransform="uppercase">
            Profile Details
          </Typography>
        </Grid>
        {/* Profile Image */}
        <Grid item xs={12}>
          <ProfilePicture imageUrl={photoUrl} isView={isViewOnly} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {userId ?? '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {accountType ?? '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'Email ID' : 'Organization Contact Person Email ID'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {email ?? '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'First Name' : 'Organization Contact Person First Name'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {firstName ?? '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'Second Name' : 'Organization Contact Person Second Name'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {lastName ?? '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'Phone Number' : 'Organization Contact Person Phone Number'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {mobile ?? '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'Date of Birth' : 'Organization Name'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {isIndividual ? (dob && fDateWithLocale(dob)) || '-' : organizationDetails?.organizationName || '-'}
            </Typography>
          </Stack>
        </Grid>
        {!isIndividual && (
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Contact Person Designation
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {organizationDetails?.designation || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        {isIndividual && (
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {donorGender || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'Country' : 'Organization Country Where Registered'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {countryData || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'State/Province' : 'Organization State/Province Where Registered'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {stateData || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {isIndividual ? 'City' : 'Organization City Where Registered'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {city || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Mailing Address
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {mailingAddress || '-'}
            </Typography>
          </Stack>
        </Grid>
        {!isIndividual && (
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Registration Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {organizationDetails?.organizationRegistrationNumber || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Preferred Communication Mode
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {preferredCommunicationMode || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Emergency Contact Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {emergencyContactName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Emergency Contact Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {emergencyContactNumber || '-'}
            </Typography>
          </Stack>
        </Grid>
        {!isIndividual && (
          <Grid item xs={12}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Description
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {organizationDetails?.organizationInfo || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        <DocumentDetails downloadMediaFile={downloadMediaFile} />
        <AdditionalDetails downloadMediaFile={downloadMediaFile} />
      </Grid>
    </Paper>
  );
};

DonationForm.propTypes = {
  isViewOnly: PropTypes.bool
};

export default DonationForm;
