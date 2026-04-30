'use client';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM, fDateWithLocale } from 'src/utils/formatTime';
import ProfilePicture from '../ProfilePicture';
import DonorInformation from './donorInformation';
import VolunteeringInformation from './volunteeringInformation';

export default function ViewIndividualProfile({ user }) {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  // Fetching state data based on the selected country
  const { data: projectStateData } = useQuery(
    ['getStates', user?.currentCountryOfResidence],
    () => api.getStates(user?.currentCountryOfResidence),
    {
      enabled: !!user?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching city data based on the selected state
  const { data: citiesData } = useQuery(
    ['getCities', user?.state],
    () => api.getCities(user?.currentCountryOfResidence, user?.state),
    {
      enabled: !!user?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  // Fetching the label for the selected country, state, and city

  const countryLabel = country?.find((item) => item?.code === user?.currentCountryOfResidence)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === user?.state)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === user?.city)?.label;

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
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
  const bankDetails = user?.bankDetail || {};
  return (
    <>
      <Typography variant="body2" color="text.secondarydark" component="p" mb={3} mt={'-16px'}>
        Complete Your Profile to Get the Most Out of Your Experience!
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
              basic details
            </Typography>
          </Grid>
          {/* this component for the user profile */}
          <Grid item xs={12} md={12}>
            <ProfilePicture imageUrl={user?.photoFileUrl} isView />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Registered As
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.accountType ? user?.accountType : 'Individual'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Email ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.email || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary" textTransform="capitalize">
                First Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.firstName || ''}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary" textTransform="capitalize">
                Second Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.lastName || ''}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.mobile || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Salutation
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.salutation || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.dob ? fDateWithLocale(user?.dob, false) : '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Marital Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_marital_status', user?.maritalStatus) || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_gender', user?.gender) || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Country
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {countryLabel || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                State/Province
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {stateLabel || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                City
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {cityLabel || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Mailing Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.mailingAddress || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Preffered Communication Mode
              </Typography>
              <Typography variant="subtitle4" component="p" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', user?.preferredCommunication) || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Identity Document Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {user?.documentType || '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Document Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {user?.documentNumber || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Document Validity
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {user?.documentValidity ? fDateWithLocale(user?.documentValidity, false) : '-'}
            </Typography>
          </Stack>
        </Grid> */}
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Contact Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.emergencyContactName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Contact Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.emergencyContactNumber || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Emergency Residential Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.homeAddress || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Relation with Emergency Contact
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.relationWithEmergencyContact || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {user?.documentDetails.length > 0 && (
          <Typography variant="subtitle6" component="h4" my={3} textTransform={'uppercase'} color="primary.main">
            Identity Documents Details
          </Typography>
        )}
        {user?.documentDetails?.map((doc) => (
          <Box
            key={doc?.id}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              padding: 2,
              mb: 2
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Identity Document Type
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Document Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
                    {doc?.documentNumber || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Document Validity
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {doc?.documentValidity ? fDateM(doc?.documentValidity, false) : '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Document Attachment
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {doc?.fileName ? (
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={(e) => downloadMediaFile(e, doc?.documentImageId)}
                      >
                        {doc.fileName}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" my={3}>
          Banking Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Beneficiary Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {bankDetails?.bankBeneficiaryName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Bank Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {bankDetails?.bankName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Account Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {bankDetails?.bankAccount || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                IBAN
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {bankDetails?.bankIban || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                SWIFT Code
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {bankDetails?.bankSwiftCode || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <DonorInformation user={user} />
        <VolunteeringInformation user={user} />
      </Paper>
    </>
  );
}

// Add PropTypes
ViewIndividualProfile.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    mobile: PropTypes.string,
    email: PropTypes.string,
    dob: PropTypes.string,
    accountType: PropTypes.string
  }).isRequired,
  setEdit: PropTypes.func
};
