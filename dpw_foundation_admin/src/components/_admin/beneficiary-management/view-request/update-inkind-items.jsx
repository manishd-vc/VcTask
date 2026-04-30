'use client';
import { Button, LinearProgress, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import InKindItemsRow from 'src/components/table/rows/inKindItemsRow';
import Table from 'src/components/table/table';
import { setInKindContributionRequestData } from 'src/redux/slices/beneficiary';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';

const LoadingFallback = () => (
  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
    <LinearProgress />
  </Stack>
);

const TABLE_HEAD = [
  { id: 'itemCode', label: 'Item Code', alignRight: false, sort: false },
  { id: 'itemName', label: 'Item Name', alignRight: false, sort: false },
  { id: 'itemDescription', label: 'Item Description', alignRight: false, sort: false },
  { id: 'requiredUnit', label: 'Required Unit', alignRight: false, sort: false },
  { id: 'requiredNumber', label: 'Required Number', alignRight: false, sort: false },
  { id: 'unitRate', label: 'Unit Rate', alignRight: false, sort: false },
  { id: 'lineValue', label: 'Line Value', alignRight: false, sort: false },
  { id: 'category', label: 'Category', alignRight: false, sort: false },
  { id: 'issuesQuantity', label: 'Issues Quantity', alignRight: false, sort: false },
  { id: 'actualValueOfInKind', label: 'Actual Value of InKind', alignRight: false, sort: false },
  { id: 'itemIssuanceStatus', label: 'Item Issuance Status', alignRight: false, sort: false },
  { id: '', label: 'Action', alignRight: true }
];

// Component definition moved outside render
const InKindItemsRowWrapper = (props) => {
  return <InKindItemsRow {...props} />;
};

export default function UpdateInKindItems() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { beneficiaryUserDetails, inKindContributionRequestData } = useSelector((state) => state?.beneficiary);

  const { mutate: submitInKind, isLoading: isSubmitting } = useMutation(beneficiaryApi.submitInKindContribution, {
    onSuccess: (data) => {
      dispatch(
        setToastMessage({ message: data?.message || 'InKind contribution submitted successfully', variant: 'success' })
      );
      router.back();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleSubmit = () => {
    submitInKind(id);
  };

  const { refetch } = useQuery(
    ['inKindContributionRequest', beneficiaryApi.getInKindContributionRequestById, id],
    () => beneficiaryApi.getInKindContributionRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setInKindContributionRequestData(data));
      }
    }
  );

  // Use contributionItems from either source
  const contributionItems =
    inKindContributionRequestData?.contributionItems || beneficiaryUserDetails?.contributionItems || [];

  const tableRows = {
    count: 1,
    data: contributionItems,
    totalElements: contributionItems.length
  };

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
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          Submit
        </Button>
      </Stack>
      <HeaderBreadcrumbs heading="UPDATE IN-KIND ISSUED DETAILS" />
      <Suspense fallback={<LoadingFallback />}>
        <Table
          headData={TABLE_HEAD}
          data={tableRows}
          isLoading={false}
          row={InKindItemsRowWrapper}
          refetch={refetch}
          totalCountText="In-Kind Items"
          allCount={tableRows?.totalElements}
          isSearch={false}
          isDatePicker={false}
          isExport={false}
          isPagination={false}
        />
      </Suspense>
    </>
  );
}
