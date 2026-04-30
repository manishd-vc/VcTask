'use client';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';
import ProfilePicture from './ProfilePicture';
export default function ViewOrganizationProfile({ user }) {
  const dispatch = useDispatch();

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const { masterData } = useSelector((state) => state?.common);
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
        <Stack direction="row" spacing={4} mb={4}>
          <Typography textAlign="center" variant="h6" color="primary.main" textTransform="uppercase">
            Basic details
          </Typography>
        </Stack>
        <Grid container spacing={3}>
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
                Organization Contact Person Email ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.email}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Contact Person First Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {user?.firstName || ''}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Contact Person Second Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {user?.lastName || ''}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Contact Person Phone Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.mobile}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.organizationDetails?.organizationName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Contact Person Designation
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.organizationDetails?.designation || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Registration Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.organizationDetails?.organizationRegistrationNumber || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Country Where Registered
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {countryLabel || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization State Where Registered
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {stateLabel || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization City Where Registered
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
                Preferred Communication Mode
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', user?.preferredCommunication)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Description
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.organizationDetails?.organizationInfo || '-'}
              </Typography>
            </Stack>
          </Grid>
          {user?.documentDetails.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
                Identity Documents Details
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            {user?.documentDetails?.map((doc) => (
              <>
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
                        <Typography variant="subtitle4" color="text.secondarydark" component="p">
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
              </>
            ))}
          </Grid>
        </Grid>

        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" mb={3}>
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

        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3, pt: 2 }}>
          Donor Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Are you interested in Donation with DPW Foundation ?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.donationInterested ? 'Yes' : 'No'}
              </Typography>
            </Stack>
          </Grid>
          {user?.donationInterested === true && (
            <>
              <Grid item xs={12} sm={6}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    What type of donations would you like to contribute?
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {user?.contributionType}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Select donation acknowledgement preferences
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {user?.acknowledgementPreference}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Subscribe to newsletter?
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {user?.communicationSubscription ? 'Yes' : 'No'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </>
  );
}

// Add PropTypes
ViewOrganizationProfile.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    mobile: PropTypes.string,
    email: PropTypes.string,
    dob: PropTypes.string,
    accountType: PropTypes.string
  }).isRequired,
  setEdit: PropTypes.func
};
