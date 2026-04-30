'use client';

import { Box, Chip, Grid, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

MoreInfoView.propTypes = {};

export default function MoreInfoView({ message, attachment, fileName, chipLabel, spacing = true }) {
  const dispatch = useDispatch();

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

  return (
    <Grid item xs={12}>
      <Box sx={{ p: 3, mb: spacing ? 4 : 0, bgcolor: 'warning.main' }}>
        <Chip color="info" label={chipLabel || 'Need more information'} size="small" />
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
