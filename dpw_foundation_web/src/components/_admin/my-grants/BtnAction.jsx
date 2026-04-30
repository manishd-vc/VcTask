'use client';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { BackArrow } from 'src/components/icons';
import CancelDialog from '../my-donations/cancelDialog';

export default function BtnActions({
  onSubmit,
  handleSaveAsDraft,
  isSaveAsDraftLoading = false,
  isMainSubmitLoading = false,
  openCancelDialog,
  setOpenCancelDialog,
  handleProceed,
  handleClose
}) {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={4} sm={2} md={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => setOpenCancelDialog(true)}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={8} sm={10} md={10}>
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
          flexDirection="row"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={() => setOpenCancelDialog(true)}
            disabled={isSaveAsDraftLoading || isMainSubmitLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="outlined"
            color="inherit"
            onClick={handleSaveAsDraft}
            loading={isSaveAsDraftLoading}
          >
            Save as Draft
          </LoadingButton>
          <LoadingButton type="button" variant="contained" onClick={onSubmit} loading={isMainSubmitLoading}>
            Submit
          </LoadingButton>
        </Stack>
      </Grid>
      <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
    </Grid>
  );
}
