import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import MediaPreview from './_main/campaign/mediaPreview';
import FileUpload from './fileUpload';
import { DownloadLetterIcon } from './icons';

export default function DocumentPreview({
  title,
  isUploadSignature,
  buttonText,
  handleFileUploadChange,
  loading,
  content,
  signatureText,
  signatureUrl,
  isDownloading,
  onClickDownload
}) {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="h6" color="primary.main" textTransform={'uppercase'} mb={2} component={'p'}>
            {title}
          </Typography>
          <Tooltip title="Download Document">
            <IconButton width={40} height={40} onClick={onClickDownload} disabled={isDownloading}>
              <DownloadLetterIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box
          sx={{ p: '2rem' }}
          className="contentWrapper jodit-workplace"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Box>
      <Stack direction={{ xs: 'column' }} justifyContent={'space-between'} alignItems={'start'} sx={{ mt: 4 }}>
        <Box>
          {signatureUrl && (
            <MediaPreview src={signatureUrl} width={120} height={80} layout="intrinsic" isCloseIcon={false} />
          )}
          {isUploadSignature && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
              <FileUpload
                size="small"
                name={'userAgreementSignUrl'}
                buttonText={buttonText}
                onChange={handleFileUploadChange}
                disabled={loading}
                accept="image/*"
              />
              <Typography variant="subtitle4" component={'p'} sx={{ my: 2 }} color="text.secondarydark">
                {signatureText}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
