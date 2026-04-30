'use client';
import { useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import GetUserByEmail from 'src/components/get-user-by-email';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as grantManagementApi from 'src/services/grantManagement';

export default function EmailSection() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { setValues } = useFormikContext();

  const { mutate: intentGrantRequest } = useMutation(grantManagementApi.intentGrantRequest, {
    onSuccess: (response) => {
      router.push(`/admin/grant-request/create/${response?.id}`);
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

  const { isLoading: isCreateUserLoading } = useMutation(api.createNewPledge, {
    onSuccess: (response) => {
      const { message } = response;
      dispatch(setToastMessage({ message: message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

  const resetPledgeForm = (email = '') => {
    setValues({
      email: email,
      accountType: '',
      firstName: '',
      lastName: '',
      mobile: '',
      confirmEmail: '',
      donationType: '',
      campaignId: '',
      intentDescription: '',
      donationAmount: '',
      organizationName: '',
      organizationRegistrationNumber: ''
    });
  };

  return (
    <GetUserByEmail
      resetPledgeForm={resetPledgeForm}
      isCreateUserLoading={isCreateUserLoading}
      intentGrantRequest={intentGrantRequest}
    />
  );
}
