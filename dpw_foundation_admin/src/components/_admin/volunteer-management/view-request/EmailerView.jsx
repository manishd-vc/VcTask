import { Box, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { downloadFile } from 'src/utils/fileUtils';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';

export default function EmailerView() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const dispatch = useDispatch();
  const [emailData, setEmailData] = useState(null);

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

  const { mutate: getEmailerData } = useMutation(volunteerApi.getEmailerVolunteers, {
    onSuccess: (data) => {
      setEmailData(data);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  useEffect(() => {
    if (volunteerCampaignData?.id && volunteerCampaignData?.hasCampaignEmail) {
      getEmailerData(volunteerCampaignData.id);
    }
  }, [volunteerCampaignData?.id, volunteerCampaignData?.hasCampaignEmail]);

  return (
    <Paper sx={{ p: 3 }}>
      {volunteerCampaignData?.hasCampaignEmail ? (
        <>
          <Typography variant="h6" component="h6" color="primary.main" pb={2}>
            {emailData?.subject || 'Volunteer Campaign'}
          </Typography>
          <Box>
            {emailData?.bannerFile && (
              <MediaPreview
                src={emailData.bannerFile.preSignedUrl || ''}
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
      {volunteerCampaignData?.hasCampaignEmail && (
        <>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondarydark">
              {emailData?.body}
            </Typography>
          </Box>
          {Boolean(emailData?.attachments?.length) && (
            <Box sx={{ py: 1.5 }}>
              <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={2}>
                <Typography variant="subtitle1" color="text.secondary">
                  Attachments -
                </Typography>
                {emailData.attachments?.map((file) => (
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
          {Boolean(emailData?.attachments?.length) && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondarydark" component="p">
                Regards,
              </Typography>
              <Typography variant="subtitle1" color="text.secondarydark" component="p">
                Team DPWF
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
