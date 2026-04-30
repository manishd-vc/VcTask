'use client';
import { Button, Grid, Stack, useTheme } from '@mui/material';
import CommonStyle from 'src/components/common.styles';
import { BackArrow } from './icons';

export default function PageActions({ backButtonAction, children }) {
  const theme = useTheme();
  const styles = CommonStyle(theme);
  return (
    <>
      <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthxs}>
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={backButtonAction}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={8} sm={10} md={10} sx={styles.maxWidthxs}>
        <Stack justifyContent={{ xs: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
          {children}
        </Stack>
      </Grid>
    </>
  );
}
