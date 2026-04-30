'use client';
import { LinearProgress, Stack } from '@mui/material';

export default function LoadingFallback() {
  return (
    <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
      <LinearProgress />
    </Stack>
  );
}
