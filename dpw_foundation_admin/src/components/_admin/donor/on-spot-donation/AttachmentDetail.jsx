import { Box, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function AttachmentDetail({ documentDetails, downloadMediaFile }) {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Stack>
        <Typography variant="body3" color="text.secondary">
          File Name
        </Typography>
        {documentDetails &&
          Array.from(documentDetails)?.map((file) => (
            <Box key={file?.id}>
              <Typography component="div" variant="subtitle4" color="text.secondarydark" mt={1}>
                <Box
                  component="span"
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={(event) => downloadMediaFile(event, file?.documentImageId)}
                >
                  {file?.fileName}
                </Box>
              </Typography>
            </Box>
          ))}
      </Stack>
    </Grid>
  );
}

AttachmentDetail.propTypes = {
  documentDetails: PropTypes.object,
  downloadMediaFile: PropTypes.func
};
