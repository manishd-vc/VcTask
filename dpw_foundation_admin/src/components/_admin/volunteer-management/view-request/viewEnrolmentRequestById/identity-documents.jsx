'use client';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6, md: 4 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        color="text.secondarydark"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

const DocumentAttachmentField = ({ label, doc, gridProps = { xs: 12, sm: 6, md: 4 }, onDownload }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" component="p">
        {doc?.fileName ? (
          <Box
            component="span"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={(e) => onDownload(e, doc?.documentImageId)}
          >
            {doc.fileName}
          </Box>
        ) : (
          '-'
        )}
      </Typography>
    </Stack>
  </Grid>
);

export default function IdentityDocuments({ enrollmentData }) {
  const { documentDetails } = enrollmentData || {};
  const { masterData } = useSelector((state) => state?.common);
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = CommonStyle(theme);
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

  return (
    <Grid container mt={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Identity Documents Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {documentDetails?.length > 0 ? (
          documentDetails.map((doc) => {
            const fields = [
              {
                label: 'Identity Document Type',
                value: getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'
              },
              { label: 'Document Number', value: doc.documentNumber },
              { label: 'Document Validity', value: doc.documentValidity ? fDateWithLocale(doc.documentValidity) : '-' }
            ];

            return (
              <Box
                key={doc?.id || `doc-${doc?.documentType}-${doc?.documentNumber}`}
                sx={{
                  ...style.documentCard
                }}
              >
                <Grid container spacing={2}>
                  {fields?.map((field) => (
                    <FieldDisplay
                      key={`${doc?.id || doc?.documentNumber}-${field.label}`}
                      label={field?.label}
                      value={field?.value}
                      textTransform={field?.textTransform}
                      color={field?.color}
                      gridProps={field?.gridProps}
                    />
                  ))}
                  <DocumentAttachmentField
                    key={`${doc?.id || doc?.documentNumber}-attachment`}
                    label="Document Attachment"
                    doc={doc}
                    onDownload={downloadMediaFile}
                  />
                </Grid>
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              ...style.documentCard
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No identity documents details found
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
