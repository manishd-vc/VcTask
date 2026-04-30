'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { BackArrow, PrintIcon } from 'src/components/icons';

export default function PageHeader({ data }) {
  const router = useRouter();

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent={'space-between'}
        mb={{ xs: 3, sm: 3 }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
        >
          <IconButton onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 4 }}>
        view Enrolment Request - {data?.enrollmentNumericId}
      </Typography>
    </>
  );
}
