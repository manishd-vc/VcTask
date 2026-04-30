'use client';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { fDateWithLocale } from 'src/utils/formatTime';

import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getMatchingString, labelPaymentThrough } from 'src/utils/onSpotUtils';
/**
 * ViewDonorInfo component
 *
 * Displays details about the donor record, including donor status,
 * created by, created on, updated by, and updated on. Each field is displayed in a grid layout.
 *
 * @component
 */
export default function ViewDonorDetails({ donorData, documentTypesData, genders }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = CommonStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry(), {
    enabled: !!donorData?.currentCountryOfResidence
  });
  const { data: projectStateData } = useQuery(
    ['getStates'],
    () => api.getStates(donorData?.currentCountryOfResidence),
    {
      enabled: !!donorData?.state
    }
  );
  const fCurrency = useCurrencyFormatter(donorData?.currency);
  const countryData = getMatchingString(country, donorData?.currentCountryOfResidence, 'code');
  const stateData = getMatchingString(projectStateData, donorData?.state, 'code');
  const genderData = getMatchingString(genders?.values, donorData?.gender, 'code');

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

  const renderTypography = (label, value) => (
    <Stack direction="column" gap={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Stack>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
            Donor Information Form
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {donorData?.accountType || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Email ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {donorData?.email || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('First Name', donorData?.firstName)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Second Name', donorData?.lastName)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Email ID', donorData?.email)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Phone Number', donorData?.mobile)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Gender', genderData)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Country', countryData)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('State/Province', stateData)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('City', donorData?.city)}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {renderTypography('Donation Amount Pledge', `${fCurrency(donorData?.donationAmount) || ''}`)}
        </Grid>
        <Grid item xs={12}>
          {renderTypography('Purpose of Donation', donorData?.intentDescription)}
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              Identity Documents Details
            </Typography>
          </Stack>
          {donorData?.documentDetails?.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                ...style.documentCard,
                mt: 2
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  {renderTypography(
                    'Identity Document Type',
                    getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderTypography('Document Number', doc.documentNumber)}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderTypography('Document Validity', doc.documentValidity && fDateWithLocale(doc.documentValidity))}
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      File Name
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
        <Grid item xs={12} sm={12} lg={12} mt={1}>
          {renderTypography('Payment Through', labelPaymentThrough[donorData?.paymentThrough])}
        </Grid>
        {donorData?.paymentOption ? (
          <Grid item xs={12} sm={12} lg={12}>
            {renderTypography('Payment Option', donorData?.paymentOption)}
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </Paper>
  );
}

ViewDonorDetails.propTypes = {
  donorData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    gender: PropTypes.string,
    currentCountryOfResidence: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    donationAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    intentDescription: PropTypes.string,
    documentDetails: PropTypes.arrayOf(
      PropTypes.shape({
        documentNumber: PropTypes.string,
        documentValidity: PropTypes.string,
        fileName: PropTypes.string,
        documentType: PropTypes.string,
        documentImageId: PropTypes.string
      })
    ),
    paymentThrough: PropTypes.string,
    paymentOption: PropTypes.string
  }),
  genders: PropTypes.object,
  documentTypesData: PropTypes.shape({
    values: PropTypes.array
  })
};

ViewDonorDetails.defaultProps = {
  donorData: {},
  documentTypesData: { values: [] }
};
