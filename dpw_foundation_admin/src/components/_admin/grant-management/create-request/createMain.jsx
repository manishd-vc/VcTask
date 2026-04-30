'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import GetUserByEmail from 'src/components/get-user-by-email';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { resetStep } from 'src/redux/slices/stepper';
import * as grantManagementApi from 'src/services/grantManagement';
import BtnActions from './BtnActions';

export default function CreateMain() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/grant-request`);
  };
  const { mutate: intentGrantRequest, isSuccess } = useMutation(grantManagementApi.intentGrantRequest, {
    onSuccess: (response) => {
      router.push(`/admin/grant-request/${response?.id}`);
      dispatch(resetStep());
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });
  return (
    <>
      <BtnActions
        isDisabled
        handleClose={handleClose}
        handleProceed={handleProceed}
        setOpenCancelDialog={setOpenCancelDialog}
        openCancelDialog={openCancelDialog}
      />
      <HeaderBreadcrumbs heading="Create Grant Request" />
      <GetUserByEmail type="GRANT_ADMIN" intentGrantRequest={intentGrantRequest} isResetForm={isSuccess} />
    </>
  );
}
