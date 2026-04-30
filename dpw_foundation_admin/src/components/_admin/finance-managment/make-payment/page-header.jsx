'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BackArrow, PrintIcon } from 'src/components/icons';

export default function PageHeader() {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const isPaymentValidated = useSelector((state) => state?.grant?.isPaymentValidated);
  const router = useRouter();

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 6
        }}
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
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton width="40px" height="40px">
            <PrintIcon />
          </IconButton>
          {isPaymentValidated && (
            <Button variant="contained" color="success">
              Make Payment
            </Button>
          )}
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 3 }}>
        view Grant Request - {grantRequestData?.grantUniqueId}
      </Typography>
    </>
  );
}
