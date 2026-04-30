'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BackArrow, PrintIcon } from 'src/components/icons';
import { checkPermissions } from 'src/utils/permissions';
import CompleteTerminatePartnership from './CompleteTerminatePartnership';
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
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const router = useRouter();
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const showCompleteTerminatePartnership =
    partnerRequestData?.assignTo === user?.userId && checkPermissions(rolesAssign, ['partner_manage']);

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
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
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems={'center'}
        >
          <IconButton width="40px" height="40px">
            <PrintIcon />
          </IconButton>
          {showCompleteTerminatePartnership && <CompleteTerminatePartnership />}
          <StatusActions
            refetch={refetch}
            handleBack={() => router.back()}
            isLoading={isLoading}
            handleCreateDocument={handleCreateDocument}
            isLetter={isLetter}
            isSignDocument={isSignDocument}
            handleFinalApproval={handleFinalApproval}
            isFinalApprovalLoading={isFinalApprovalLoading}
          />
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 5 }}>
        view Partnership Request - {partnerRequestData?.partnershipUniqueId}
      </Typography>
    </>
  );
}
