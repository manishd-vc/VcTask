'use client';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, useTheme } from '@mui/material';
import CommonStyle, { buttonResponsiveStyle } from 'src/components/common.styles';
import { BackArrow } from 'src/components/icons';
import CancelDialog from '../../campaign/cancelDialog';

export default function BtnActions({
  isDisabled = false,
  onSubmit,
  handleSaveAsDraft,
  isLoading = false,
  isSaveAsDraftLoading = false,
  isMainSubmitLoading = false,
  openCancelDialog,
  setOpenCancelDialog,
  handleProceed,
  handleClose,
  hideSaveAsDraftBtn = false
}) {
  const theme = useTheme();
  const styles = CommonStyle(theme);
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthsm}>
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
      {!isDisabled && (
        <Grid item xs={8} sm={10} md={10} sx={styles.maxWidthsm}>
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
              sx={buttonResponsiveStyle('35%')}
              onClick={() => setOpenCancelDialog(true)}
              disabled={isSaveAsDraftLoading || isMainSubmitLoading}
            >
              Cancel
            </Button>
            {!hideSaveAsDraftBtn ? (
              <LoadingButton
                type="button"
                variant="outlined"
                color="inherit"
                sx={buttonResponsiveStyle('40%')}
                disabled={isDisabled}
                onClick={handleSaveAsDraft}
                loading={isSaveAsDraftLoading}
              >
                Save as Draft
              </LoadingButton>
            ) : (
              ''
            )}
            <LoadingButton
              type="button"
              variant="contained"
              sx={buttonResponsiveStyle('25%')}
              disabled={isDisabled}
              onClick={onSubmit}
              loading={isMainSubmitLoading}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Grid>
      )}
      <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
    </Grid>
  );
}
