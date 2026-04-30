'use client';

import { Box, Chip, Grid, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';

MoreInfo.propTypes = {};

export default function MoreInfo({ message, attachment, fileName, status }) {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const donationSatus = getLabelObject(masterData, 'dpw_foundation_donor_status');
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

  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };
  const titleStatus = donationSatus?.values?.find((item) => item.code === status)?.label || status;

  return (
    <Grid item xs={12}>
      <Box sx={{ p: 3, mb: 4, bgcolor: 'warning.main' }}>
        <Chip color="info" label={titleStatus} />
        <Typography variant="body2" color="text.black" sx={{ mt: 1.5 }}>
          {message}
        </Typography>
        {attachment && (
          <>
            <Typography component="p" variant="subtitle4" color="text.black" sx={{ pt: 2 }}>
              Download Attachment
            </Typography>
            <button
              onClick={(event) => {
                event.preventDefault();
                download(attachment);
              }}
              role="link"
              style={{
                textDecorationLine: 'underline',
                color: '#0F0F19',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left'
              }}
              tabIndex="0"
              aria-label="Download Attachment"
            >
              {fileName}
            </button>
          </>
        )}
      </Box>
    </Grid>
  );
}
