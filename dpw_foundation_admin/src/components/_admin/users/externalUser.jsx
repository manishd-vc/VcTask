'use client';
import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { BackArrow, DeleteIconRed, ReActiveIcon, SuspendedIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';

// api
import { useState } from 'react';
import RestoreUser from 'src/components/dialog/restoreUser';
import SuspendDialog from 'src/components/dialog/suspend';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM, fDateTime, fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import ProfilePicture from './profilePicture';
import VolunteeringInformation from './VolunteeringInformation';

// Configuration object for labels based on account type
const LABEL_CONFIG = {
  organization: {
    emailId: 'Organization Contact Person Email ID',
    firstName: 'Organization Contact Person First Name',
    secondName: 'Organization Contact Person Second Name',
    phoneNumber: 'Organization Contact Person Phone Number',
    country: 'Organization Country Where Registered',
    state: 'Organization State Where Registered',
    city: 'Organization City Where Registered'
  },
  individual: {
    emailId: 'Email ID',
    firstName: 'First Name',
    secondName: 'Second Name',
    phoneNumber: 'Phone Number',
    country: 'Country',
    state: ' State/Province',
    city: ' City'
  }
};

const getLabel = (isOrganization, labelKey) => {
  const accountType = isOrganization ? 'organization' : 'individual';
  return LABEL_CONFIG[accountType][labelKey];
};

const formatBooleanAnswer = (value) => (value === true ? 'Yes' : 'No');

const InfoItem = ({ question, answer, colSize, showMoreButton, tooltipTitle }) => (
  <Grid item xs={12} md={colSize}>
    <Stack direction="column" gap={0.5}>
      <Typography variant="body3" color="text.secondary">
        {question}
      </Typography>
      <Typography
        variant="subtitle4"
        component="p"
        display="flex"
        flexWrap="wrap"
        color="text.secondarydark"
        sx={{ wordBreak: 'break-word' }}
      >
        {answer || '-'}&nbsp;
        {showMoreButton && (
          <Tooltip title={tooltipTitle || ''} arrow>
            <Typography variant="blueLink" color="text.blue">
              {`+${showMoreButton} more`}
            </Typography>
          </Tooltip>
        )}
      </Typography>
    </Stack>
  </Grid>
);

export default function ExternalUser() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const [isSuspended, setIsSuspended] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { masterData } = useSelector((state) => state?.common);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down('md'));
  const { data: userData, refetch } = useQuery(['getUser', params.id], () => api.getUserByAdmin(params.id), {
    enabled: !!params.id,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });
  // Fetching country data using a query
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  // Fetching state data based on the selected country
  const { data: projectStateData } = useQuery(
    ['getStates', userData?.currentCountryOfResidence],
    () => api.getStates(userData?.currentCountryOfResidence),
    {
      enabled: !!userData?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  const isOrganizationType = userData?.accountType === 'Organization';

  // Fetching city data based on the selected state
  const { data: citiesData } = useQuery(
    ['getCities', userData?.state],
    () => api.getCities(userData?.currentCountryOfResidence, userData?.state),
    {
      enabled: !!userData?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  // Fetching the label for the selected country, state, and city
  const countryLabel = country?.find((item) => item?.code === userData?.currentCountryOfResidence)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === userData?.state)?.label;
  const cityLabel = citiesData?.find((item) => item?.code === userData?.city)?.label;

  const handleCloseSuspend = () => {
    setIsSuspended(false);
  };
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
  const bankDetails = userData?.bankDetail || {};
  return (
    <Box position="relative">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        spacing={3}
      >
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <Stack
          flexDirection="row"
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          alignItems="center"
          gap={3}
          sx={{ width: '100%' }}
        >
          {checkPermissions(rolesAssign, ['user_manage_operations']) && userData?.status !== 'Deleted' && (
            <Tooltip title="Delete User" arrow>
              <IconButton style={{ mt: '24!important' }} onClick={() => setIsDeleted(true)}>
                <DeleteIconRed height={35} width={28} />
              </IconButton>
            </Tooltip>
          )}
          {checkPermissions(rolesAssign, ['user_manage_operations']) && userData?.status === 'Active' && (
            <Tooltip title="Suspend User" arrow>
              <IconButton onClick={() => setIsSuspended(true)}>
                <SuspendedIcon height={37} width={34} />
              </IconButton>
            </Tooltip>
          )}
          {checkPermissions(rolesAssign, ['user_manage_operations']) && userData?.status === 'Suspended' && (
            <Tooltip title="Un-Suspend User" arrow>
              <IconButton onClick={() => setIsActive(true)}>
                <ReActiveIcon height="32" width="34" />
              </IconButton>
            </Tooltip>
          )}

          <Button
            variant="outlined"
            onClick={() => router.push(`/admin/user-management/external-user/view/${params.id}/log`)}
            size="large"
            sx={{
              width: { xs: '48%', sm: 'auto' }
            }}
          >
            View Log
          </Button>
          {checkPermissions(rolesAssign, ['user_manage_operations']) && (
            <Button
              variant="outlined"
              onClick={() => router.push(`/admin/user-management/external-user/${params.id}`)}
              sx={{
                width: { xs: '48%', sm: 'auto' }
              }}
              disabled={userData?.status !== 'Active'}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={4} mb={4}>
        <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
          User’s profile
        </Typography>
      </Stack>
      {userData?.status === 'Suspended' && (
        <Box sx={{ p: 3, mb: 3, bgcolor: 'warning.main' }}>
          <Typography component="h5" variant="subtitle4" color="text.black">
            Suspension Reason
          </Typography>
          <Typography variant="body2" color="text.black">
            {userData?.reason || '-'}
          </Typography>
        </Box>
      )}
      {userData?.status === 'Deleted' && (
        <Box sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography component="h5" variant="subtitle4" color="text.white">
            Deleted Reason
          </Typography>
          <Typography variant="body2" color="text.white">
            {userData?.reason || '-'}
          </Typography>
        </Box>
      )}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <InfoItem colSize={3} question="Status" answer={userData?.status} />
          <InfoItem colSize={3} question="Record Created By" answer={userData?.createdByName} />
          <InfoItem
            colSize={3}
            question="Record Created On"
            answer={userData?.createdAt && fDateTime(userData?.createdAt)}
          />
          <InfoItem colSize={3} question="Record Updated By" answer={userData?.updatedByName} />
          <InfoItem
            colSize={3}
            question="Record Updated On"
            answer={userData?.contributedAs && fDateTime(userData?.updatedAt)}
          />
          <InfoItem
            colSize={3}
            question="Contributed As"
            answer={userData?.contributedAs?.join(', ') || '-'}
            tooltipTitle={userData?.contributedAs?.join(', ')}
          />
        </Grid>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
              basic details
            </Typography>
          </Grid>
          {/* Basic Information */}
          <Grid item xs={12}>
            <ProfilePicture imageUrl={userData?.photoFileUrl} isView />
          </Grid>
          <InfoItem colSize={6} question="Registered As" answer={userData?.accountType} />
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'emailId')} answer={userData?.email} />
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'firstName')} answer={userData?.firstName} />
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'secondName')} answer={userData?.lastName} />

          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'phoneNumber')} answer={userData?.mobile} />
          {isOrganizationType && (
            <>
              <InfoItem
                colSize={6}
                question="Organization Name"
                answer={userData?.organizationDetails?.organizationName}
              />
              <InfoItem
                colSize={6}
                question="Organization Contact Person Designation"
                answer={userData?.organizationDetails?.designation}
              />
              <InfoItem
                colSize={6}
                question="Organization Registration Number"
                answer={userData?.organizationDetails?.organizationRegistrationNumber}
              />
            </>
          )}
          {!isOrganizationType && (
            <>
              <InfoItem colSize={6} question="Salutation" answer={userData?.salutation} />
              <InfoItem colSize={6} question="Date of Birth" answer={userData?.dob && fDateWithLocale(userData?.dob)} />
            </>
          )}
          {!isOrganizationType && (
            <InfoItem
              colSize={6}
              question="Marital Status"
              answer={getLabelByCode(masterData, 'dpw_foundation_user_marital_status', userData?.maritalStatus)}
            />
          )}
          {!isOrganizationType && (
            <InfoItem
              colSize={6}
              question="Gender"
              answer={getLabelByCode(masterData, 'dpw_foundation_user_gender', userData?.gender)}
            />
          )}
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'country')} answer={countryLabel} />
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'state')} answer={stateLabel} />
          <InfoItem colSize={6} question={getLabel(isOrganizationType, 'city')} answer={cityLabel} />
          <InfoItem colSize={6} question="Mailing Address" answer={userData?.mailingAddress} />
          <InfoItem
            colSize={6}
            question="Preferred Communication Mode"
            answer={getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', userData?.preferredCommunication)}
          />
          {isOrganizationType && (
            <InfoItem
              colSize={6}
              question="Organization Description"
              answer={userData?.organizationDetails?.organizationInfo}
            />
          )}
          {!isOrganizationType && (
            <>
              <InfoItem colSize={6} question="Emergency Contact Name" answer={userData?.emergencyContactName} />
              <InfoItem colSize={6} question="Emergency Contact Number" answer={userData?.emergencyContactNumber} />
              <InfoItem colSize={6} question="Emergency Residential Address" answer={userData?.homeAddress} />
            </>
          )}
          {userData?.documentDetails.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
                Identity Documents Details
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            {userData?.documentDetails?.map((doc) => (
              <Box
                key={doc.id || doc.documentType}
                sx={{
                  backgroundColor: (theme) => theme.palette.grey[100],
                  padding: 2,
                  mb: 2
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Identity Document Type
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Document Number
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
                        {doc?.documentNumber || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
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
          </Grid>
        </Grid>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" mb={2}>
          Banking Information
        </Typography>
        <Grid container spacing={3}>
          <InfoItem colSize={6} question="Beneficiary Name" answer={bankDetails?.bankBeneficiaryName} />
          <InfoItem colSize={6} question="Bank Name" answer={bankDetails?.bankName} />
          <InfoItem colSize={6} question="Account Number" answer={bankDetails?.bankAccount} />
          <InfoItem colSize={6} question="IBAN" answer={bankDetails?.bankIban} />
          <InfoItem colSize={6} question="SWIFT Code" answer={bankDetails?.bankSwiftCode} />
        </Grid>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" my={2}>
          Grant Request Information
        </Typography>
        <InfoItem
          colSize={6}
          question="Is the user allowed to create a Grant Request?"
          answer={formatBooleanAnswer(userData?.allowGrantCreation)}
        />
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" sx={{ pb: 3, pt: 2 }}>
          Donor information
        </Typography>
        <Grid container spacing={2}>
          <InfoItem
            colSize={6}
            question="Are you interested in Donation with DPW Foundation?"
            answer={formatBooleanAnswer(userData?.donationInterested)}
          />
          {userData?.donationInterested === true && (
            <>
              <InfoItem
                colSize={6}
                question="What type of donations would you like to contribute?"
                answer={userData?.contributionType}
              />
              <InfoItem
                colSize={6}
                question="Donation Acknowledgement Preferences"
                answer={userData?.acknowledgementPreference}
              />
              <InfoItem
                colSize={6}
                question="Subscribe to Newsletter ?"
                answer={formatBooleanAnswer(userData?.communicationSubscription)}
              />
            </>
          )}
          {/* Volunteering Information */}
          <VolunteeringInformation userData={userData} />
        </Grid>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" my={2}>
          Beneficiary Information
        </Typography>
        <InfoItem
          colSize={6}
          question="Is the user allowed to create a In-Kind Contribution Request?"
          answer={formatBooleanAnswer(userData?.allowContributionCreation)}
        />
      </Paper>
      {isSuspended && (
        <Dialog aria-label="Suspend-user" onClose={() => setIsSuspended(false)} open={isSuspended} maxWidth={'sm'}>
          <SuspendDialog
            onClose={handleCloseSuspend}
            id={params.id}
            refetch={refetch}
            confirmText={'Are you sure you want to suspend this user ?'}
          />
        </Dialog>
      )}
      {isDeleted && (
        <Dialog aria-label="Delete-user" onClose={() => setIsDeleted(false)} open={isDeleted} maxWidth={'sm'}>
          <SuspendDialog
            onClose={() => setIsDeleted(false)}
            id={params.id}
            refetch={refetch}
            confirmText={'Are you sure you want to delete this user ?'}
            isDelete
          />
        </Dialog>
      )}

      {isActive && (
        <Dialog aria-label="Restore-external-user" onClose={() => setIsActive(false)} open={isActive} maxWidth={'sm'}>
          <RestoreUser onClose={() => setIsActive(false)} id={params.id} isExternalUser refetch={refetch} />
        </Dialog>
      )}
    </Box>
  );
}
