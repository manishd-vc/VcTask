import { Button, Grid, Stack } from '@mui/material';

export default function ApprovalPanel({ handleClickOpenMoreInfo, handleClickOpenReject, handleClickOpenApproval }) {
  return (
    <Grid item xs={12} md={10}>
      <Stack justifyContent={{ sm: 'flex-start', md: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
        <Button
          variant="contained"
          color="warning"
          onClick={handleClickOpenMoreInfo}
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        >
          Need more info
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleClickOpenReject}
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleClickOpenApproval}
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        >
          Accept and proceed with donation payment
        </Button>
      </Stack>
    </Grid>
  );
}
