'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import AssociateProjectsModal from 'src/components/dialog/AssociateProjectsModal';
import { BackArrow, PrintIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import * as beneficiaryApi from 'src/services/beneficiary';
import ViewBeneficiaryRequestById from './view-request/all-beneficiaries/viewBeneficiaryRequestById';

export default function ViewAllBeneficiaries() {
  const router = useRouter();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const { isLoading, data: beneficiaryData } = useQuery(
    ['getVolunteerEnrollmentById', id],
    () => beneficiaryApi.getBeneficiaryDetails(id),
    {
      enabled: !!id
    }
  );

  const { data: apiData } = useQuery(['apiCallWhenOpen', id, open], () => beneficiaryApi.getAssosciatedProjects(id), {
    enabled: open && !!id
  });
  if (isLoading) {
    return <LoadingFallback />;
  }

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
          <Button
            type="button"
            variant="contained"
            color="inherit"
            sx={{ color: 'white', fontWeight: 'light' }}
            onClick={() => setOpen(true)}
          >
            Associate Projects
          </Button>
        </Stack>
      </Stack>
      <Typography variant="h5" color="primary.main" sx={{ mb: 4 }} textTransform={'uppercase'}>
        Beneficiary Profile
      </Typography>
      {open && (
        <AssociateProjectsModal
          open={open}
          onClose={() => setOpen(false)}
          beneficiaryData={beneficiaryData}
          listOfProjects={apiData}
        />
      )}
      <ViewBeneficiaryRequestById beneficiaryData={beneficiaryData} />
    </>
  );
}
