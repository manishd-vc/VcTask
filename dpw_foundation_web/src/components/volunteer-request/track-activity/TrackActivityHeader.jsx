import { Button, IconButton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { BackArrow, PrintIcon } from 'src/components/icons';

export default function TrackActivityHeader() {
  const router = useRouter();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
      <Button
        variant="text"
        color="primary"
        startIcon={<BackArrow />}
        onClick={() => router.back()}
        sx={{ '&:hover': { textDecoration: 'none' } }}
      >
        Back
      </Button>
      <IconButton onClick={() => window.print()}>
        <PrintIcon />
      </IconButton>
    </Stack>
  );
}
