'use client';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import StatusActions from './StatusActions';

export default function PageHeader({
  refetch,
  handleCreateDocument,
  isLoading,
  isLetter,
  isSignDocument,
  handleFinalApproval,
  isFinalApprovalLoading
}) {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
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

        <StatusActions
          refetch={refetch}
          handleBack={() => router.back()}
          handleCreateDocument={handleCreateDocument}
          isLoading={isLoading}
          isLetter={isLetter}
          isSignDocument={isSignDocument}
          handleFinalApproval={handleFinalApproval}
          isFinalApprovalLoading={isFinalApprovalLoading}
        />
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 3 }}>
        view Grant Request - {grantRequestData?.grantUniqueId}
      </Typography>
    </>
  );
}
