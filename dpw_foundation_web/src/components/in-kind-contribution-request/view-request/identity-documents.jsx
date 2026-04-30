import { Box, Grid, Link, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

const FieldDisplay = ({ label, value, gridProps = { xs: 12, sm: 6, md: 4 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark">
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function IdentityDocuments() {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const styles = CommonStyle(theme);

  const { documentDetails } = inKindContributionRequestData || {};

  const renderDocumentFields = (doc) => {
    const { documentType, documentNumber, documentValidity, fileName, preSignedUrl } = doc || {};

    const fields = [
      {
        label: 'Identity Document Type',
        value: documentType ? getLabelByCode(masterData, 'dpw_foundation_user_identity', documentType) : '-'
      },
      { label: 'Document Number', value: documentNumber || '-' },
      { label: 'Document Validity', value: documentValidity ? fDateWithLocale(documentValidity) : '-' }
    ];

    return (
      <Box key={doc?.id} sx={styles.documentCard}>
        <Grid container spacing={2}>
          {fields?.map((field) => (
            <FieldDisplay key={field?.label} label={field?.label} value={field?.value} />
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Document Attachment
              </Typography>
              {preSignedUrl ? (
                <Link
                  href={preSignedUrl}
                  variant="body2"
                  underline="hover"
                  sx={{ '&&': { color: 'black', fontWeight: 400 } }}
                >
                  {fileName || '-'}
                </Link>
              ) : (
                <Typography variant="subtitle4" color="text.secondarydark">
                  {fileName || '-'}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Identity Documents Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {documentDetails?.length > 0 ? (
          <Stack spacing={2}>{documentDetails?.map((doc) => renderDocumentFields(doc))}</Stack>
        ) : (
          <Box sx={{ bgcolor: 'backgrounds.light', p: 4, width: '100%' }}>
            <Typography color="secondary.darker">No Identity Documents Details</Typography>
          </Box>
        )}
      </Grid>
    </>
  );
}
