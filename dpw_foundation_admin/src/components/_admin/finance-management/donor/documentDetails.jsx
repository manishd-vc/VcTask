import { Box, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function DocumentDetails({ downloadMediaFile }) {
  const { masterData } = useSelector((state) => state?.common);
  const { financeDonationData } = useSelector((state) => state?.finance);
  const { documentDetails } = financeDonationData || {};
  return (
    <Grid item xs={12}>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Identity Documents Details
        </Typography>
      </Stack>
      {documentDetails?.map((doc) => (
        <Box sx={{ background: (theme) => theme.palette.grey[100], p: 2, mt: 2 }} key={doc?.id}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Identity Document Type
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getLabelByCode(masterData, 'dpw_foundation_user_identity', doc?.documentType) || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Document Number
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark" sx={{ wordWrap: 'break-word' }}>
                  {doc?.documentNumber || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Document Validity
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {(doc?.documentValidity && fDateWithLocale(doc?.documentValidity)) || '-'}
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
  );
}

DocumentDetails.propTypes = {
  downloadMediaFile: PropTypes.func.isRequired
};