// Importing required components from Material UI library for layout and typography
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePicture from 'src/components/_main/profile/profilePicture';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString } from 'src/utils/util';

// Helper function to get labels based on type
const getFieldLabels = (type) => ({
  email: type === 'Individual' ? 'Email ID' : 'Organization Contact Person Email ID',
  firstName: type === 'Individual' ? 'First Name' : 'Organization Contact Person First Name',
  lastName: type === 'Individual' ? 'Second Name' : 'Organization Contact Person Second Name',
  phone: type === 'Individual' ? 'Phone Number' : 'Organization Contact Person Phone Number',
  dobOrg: type === 'Individual' ? 'Date of Birth' : 'Organization Name',
  genderDesignation: type === 'Individual' ? 'Gender' : 'Organization Contact Person Designation',
  country: type === 'Individual' ? 'Country' : 'Organization Country Where Registered ',
  state: type === 'Individual' ? 'State/Province' : 'Organization State/Province Where Registered ',
  city: type === 'Individual' ? 'City' : 'Organization City Where Registered '
});

// Helper function to get date of birth or organization name based on type
const getDobOrOrgName = (data, type) => {
  if (type === 'Individual') {
    return data?.dob ? fDateWithLocale(data?.dob) : '-';
  }
  return data?.organizationDetails?.organizationName || '-';
};

// Helper function to get values based on type
const getFieldValues = (data, type) => ({
  dobOrg: getDobOrOrgName(data, type),
  genderDesignation:
    type === 'Individual'
      ? null // Will be handled separately with gender processing
      : data?.organizationDetails?.designation || '-'
});

// Helper function to check if user is DPW employee
const isDpwEmployee = (data) => data?.isDpwEmployee === 'true' || data?.isDpwEmployee === true;

// Custom hook for processing master data
const useProcessedMasterData = (data, masterData) => {
  const { data: getCountryList } = useQuery(['getCountry'], () => api.getCountry(), {
    enabled: !!data?.currentCountryOfResidence
  });
  const { data: stateListData } = useQuery(['getStates'], () => api.getStates(data?.currentCountryOfResidence), {
    enabled: !!data?.state
  });

  const genderList = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const gender = getMatchingString(genderList?.values, data?.gender, 'code');
  const country = getMatchingString(getCountryList, data?.currentCountryOfResidence, 'code');
  const state = getMatchingString(stateListData, data?.state, 'code');
  const preferredCommunicationsData = getLabelObject(masterData, 'dpw_foundation_user_prefer_comm');
  const preferredCommunication = getMatchingString(
    preferredCommunicationsData?.values,
    data?.preferredCommunication,
    'code'
  );

  return { gender, country, state, preferredCommunication };
};

// Step1View component which renders the donation form with various fields
const Step1View = ({ data, type = 'Individual' }) => {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const { profileData } = useSelector((state) => state.profile);
  const { gender, country, state, preferredCommunication } = useProcessedMasterData(data, masterData);
  const labels = getFieldLabels(type);
  const values = getFieldValues(data, type);
  const isEmployee = isDpwEmployee(data);
  const isIndividual = type === 'Individual';

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
    const payload = { ids: [fileId] };
    downloadAllDocuments(payload);
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" color={'text.black'} textTransform={'uppercase'}>
        Donor Information Form
      </Typography>
      {/* Grid container to organize each field of the donation form in a responsive layout */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle4" color="text.black" mt={3} component={'p'} textTransform="uppercase">
            Profile Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ProfilePicture imageUrl={profileData?.photoFileUrl} isView />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.userId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {type ? type : 'Individual'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.email}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.email || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.firstName}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {data?.firstName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.lastName}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {data?.lastName || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.phone}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.mobile || ''}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.dobOrg}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values.dobOrg}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.genderDesignation}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {isIndividual ? gender || '-' : values.genderDesignation}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.country}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {country || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.state}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {state || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {labels.city}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.city || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Mailing Address
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.mailingAddress || '-'}
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
                {data?.organizationDetails?.organizationRegistrationNumber || '-'}
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
              {preferredCommunication || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Emergency Contact Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.emergencyContactName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Emergency Contact Number
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.emergencyContactNumber || '-'}
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
                {data?.organizationDetails?.organizationInfo || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        <Grid item md={12}>
          <Typography variant="subtitle6" color="primary.main" my={3} component={'p'}>
            Identity Documents Details
          </Typography>

          {data?.documentDetails?.map((doc) => (
            <Box
              key={doc?.id}
              sx={{
                background: (theme) => theme.palette.grey[100],
                p: 2,
                mb: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Identity Document Type
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Document Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
                      {doc?.documentNumber || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Document Validity
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {doc?.documentValidity ? fDateWithLocale(doc?.documentValidity) : '-'}
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
                          {doc?.fileName}
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
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle4" textTransform={'uppercase'} color="primary.main" sx={{ pb: 3 }}>
            Additional Details
          </Typography>
        </Grid>

        {!isIndividual && (
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Organization Related Documents Attachments
              </Typography>
              <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
                {data?.orgAttachments &&
                  Array.from(data?.orgAttachments)?.map((file) => (
                    <Box key={`steps_${file?.id}`}>
                      <Typography component="div" variant="subtitle4" color="text.secondarydark">
                        <Box
                          component="span"
                          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={(e) => downloadMediaFile(e, file?.id)}
                        >
                          {file?.fileName || '-'}
                        </Box>
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            </Stack>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Donation Acknowledgement Preferences
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {preferredCommunication || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Subscribe to newsletter?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.communicationSubscription ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Is the donor is an employee of DP World group or its Sister Organizations?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.isDpwEmployee ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
        {isEmployee && (
          <>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {data?.employeeId}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {data?.employer || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Company Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                  {data?.companyName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Department Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                  {data?.department}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Is the donor a Govt. institution or an organization affiliated with Govt. in UAE?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.isGovAffiliate ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

Step1View.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    preferredCommunication: PropTypes.string,
    gender: PropTypes.string,
    landlineNumber: PropTypes.string,
    mobile: PropTypes.string,
    isEmployed: PropTypes.bool,
    occupation: PropTypes.string,
    employer: PropTypes.string,
    nationalIdValidity: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    passportNo: PropTypes.string,
    passportValidity: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    maritalStatus: PropTypes.string,
    spouseGuardianName: PropTypes.string,
    isSpouseGuardianEmployed: PropTypes.bool,
    nationality: PropTypes.string,
    currentCountryOfResidence: PropTypes.string,
    state: PropTypes.string,
    homeStatus: PropTypes.string,
    homeAddress: PropTypes.string,
    assistanceRequested: PropTypes.string
  }).isRequired,
  type: PropTypes.string,
  user: PropTypes.object
};

// Export the Step1View component to be used elsewhere in the application
export default Step1View;
