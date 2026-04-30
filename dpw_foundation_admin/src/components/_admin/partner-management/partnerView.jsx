'use client';
import { Box, Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow, PrintIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';
import ProfilePicture from '../users/profilePicture';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack direction="column" gap={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        component="p"
        display="flex"
        flexWrap="wrap"
        color="text.secondarydark"
        sx={{ wordBreak: 'break-word' }}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function PartnerView() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const partnerId = params?.id;
  const { masterData } = useSelector((state) => state?.common);
  const { data: partnerData, isLoading } = useQuery(['getUser', partnerId], () => api.getUserByAdmin(partnerId), {
    enabled: !!partnerId,
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  const {
    firstName,
    lastName,
    email,
    mobile,
    mailingAddress,
    accountType,
    organizationDetails,
    photoFileUrl,
    documentDetails,
    bankDetail
  } = partnerData || {};

  const basicDetails = [
    { label: 'Registered As', value: accountType },
    { label: 'Organization Contact Person Email ID', value: email },
    { label: 'Organization Contact Person First Name', value: firstName, textTransform: 'capitalize' },
    { label: 'Organization Contact Person Second Name', value: lastName, textTransform: 'capitalize' },
    { label: 'Organization Contact Person Phone Number', value: mobile },
    { label: 'Organization Name', value: organizationDetails?.organizationName },
    { label: 'Organization Contact Person Designation', value: organizationDetails?.designation },
    { label: 'Organization Registration Number', value: organizationDetails?.organizationRegistrationNumber },
    { label: 'Organization Country Where Registered', value: organizationDetails?.organizationCountry },
    { label: 'Organization State Where Registered', value: organizationDetails?.organizationState },
    { label: 'Organization City Where Registered', value: organizationDetails?.organizationCity },
    { label: 'Mailing Address', value: mailingAddress },
    {
      label: 'Preferred Communication Mode',
      value: getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', partnerData?.preferredCommunication)
    },
    {
      label: 'Organization Description',
      value: organizationDetails?.organizationInfo
    }
  ];

  const bankDetails = [
    { label: 'Beneficiary Name', value: bankDetail?.bankBeneficiaryName },
    { label: 'Bank Name', value: bankDetail?.bankName },
    { label: 'Account Number', value: bankDetail?.bankAccount },
    { label: 'IBAN', value: bankDetail?.bankIban },
    { label: 'SWIFT Code', value: bankDetail?.bankSwiftCode }
  ];

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        spacing={3}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={handleBack}
          sx={{
            mb: 3,
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <IconButton width="40px" height="40px">
          <PrintIcon />
        </IconButton>
      </Stack>

      <HeaderBreadcrumbs heading={`view partner`} />
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
              basic details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ProfilePicture imageUrl={photoFileUrl} isView />
          </Grid>
          {basicDetails.map((field) => (
            <FieldDisplay
              key={field.label}
              label={field.label}
              value={field.value}
              textTransform={field.textTransform}
              gridProps={field.gridProps}
            />
          ))}
          {documentDetails.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
                Identity Documents Details
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            {documentDetails?.map((doc) => (
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
          {bankDetails.map((field) => (
            <FieldDisplay
              key={field.label}
              label={field.label}
              value={field.value}
              textTransform={field.textTransform}
              gridProps={field.gridProps}
            />
          ))}
        </Grid>
      </Paper>
    </>
  );
}
