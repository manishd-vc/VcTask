'use client';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6, md: 4 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function IdentityDocuments({ enrollmentData }) {
  const { documentDetails } = enrollmentData || {};
  const { masterData } = useSelector((state) => state?.common);
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = {
    ...CommonStyle(theme)
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
    const payload = { ids: [fileId] };
    downloadAllDocuments(payload);
  };

  const renderDocumentFields = (doc) => {
    const { documentType, documentNumber, documentValidity, fileName, documentImageId } = doc || {};

    const fields = [
      {
        label: 'Identity Document Type',
        value: getLabelByCode(masterData, 'dpw_foundation_user_identity', documentType) || '-'
      },
      { label: 'Document Number', value: documentNumber || '-' },
      { label: 'Document Validity', value: documentValidity ? fDateWithLocale(documentValidity) : '-' }
    ];

    return (
      <Box
        key={doc?.id}
        sx={{
          ...styles.documentCard
        }}
      >
        <Grid container spacing={2}>
          {fields?.map((field) => (
            <FieldDisplay
              key={field?.label}
              label={field?.label}
              value={field?.value}
              gridProps={{ xs: 12, sm: 6, md: 4 }}
            />
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Document Attachment
              </Typography>
              {fileName ? (
                <Typography
                  variant="subtitle4"
                  color="text.secondarydark"
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={(e) => downloadMediaFile(e, documentImageId)}
                >
                  {fileName}
                </Typography>
              ) : (
                <Typography variant="subtitle4" color="text.secondarydark">
                  -
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Identity Documents Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {documentDetails?.length > 0 ? (
          documentDetails?.map((doc) => renderDocumentFields(doc))
        ) : (
          <Box
            sx={{
              ...styles.documentCard
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No Identity Documents Details
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
