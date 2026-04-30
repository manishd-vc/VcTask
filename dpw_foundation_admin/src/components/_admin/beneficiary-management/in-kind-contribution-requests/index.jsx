'use client';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
const InKindContributionRequestsComponent = React.lazy(() => import('./InKindContributionRequests'));
export default function InKindContributionRequestsMain() {
  const router = useRouter();
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
      </Stack>
      <HeaderBreadcrumbs heading="In-Kind Contribution Requests" />
      <Suspense fallback={<LoadingFallback />}>
        <InKindContributionRequestsComponent />
      </Suspense>
    </>
  );
}
