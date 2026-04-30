import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { downloadFile } from 'src/utils/fileUtils';
import MediaPreview from './mediaPreview';

export default function PreviewEmail() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const { mutate: downloadMedia } = useMutation('downloadMedia', api.downloadMedia, {
    onSuccess: ({ data, headers }, fileId) => {
      const contentDisposition = headers.get('content-disposition');
      let filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || fileId;
      downloadFile(data, filename, headers);
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  return (
    <Paper sx={{ p: 3 }}>
      {campaignUpdateData?.hasCampaignEmail ? (
        <>
          <Typography variant="h6" component="h6" color="primary.main" pb={2}>
            Pledge a Donation- {values?.subject || '-'}
          </Typography>
          <Box>
            {values.bannerImage && (
              <MediaPreview
                src={values.bannerImage.preSignedUrl || ''}
                name={'preview'}
                width={973}
                height={440}
                layout="responsive"
                isCloseIcon={false}
                style={{ objectFit: 'cover' }}
              />
            )}
          </Box>
        </>
      ) : (
        <Typography variant="body2" component="p" color="text.secondary" sx={{ pb: 3 }}>
          No emailer attached
        </Typography>
      )}
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondarydark">
          {values?.body}
        </Typography>
      </Box>
      {Boolean(values.attachments?.length) && (
        <Box sx={{ py: 1.5 }}>
          <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={2}>
            <Typography variant="subtitle1" color="text.secondary">
              Attachments -
            </Typography>
            {values.attachments?.map((file) => (
              <Box key={file?.id}>
                <Typography component="span" variant="body2" color="text.blue">
                  <Box
                    component="span"
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => downloadMedia(file?.id)}
                  >
                    {file?.fileName}
                  </Box>
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      <Box sx={{ py: 1.5 }}>
        <Button
          variant="contained"
          color="primary"
          type="button"
          // onClick={() => window.open(values?.emailLinkOne || '#', '_blank')}
        >
          {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Donate Now' : 'View Project Details'}
        </Button>
      </Box>
      {Boolean(values.attachments?.length) && (
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondarydark" component="p">
            Regards,
          </Typography>
          <Typography variant="subtitle1" color="text.secondarydark" component="p">
            Team DPWF
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
