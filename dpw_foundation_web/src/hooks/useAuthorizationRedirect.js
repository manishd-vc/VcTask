'use client';
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';

export const useAuthorizationRedirect = ({
  condition,
  redirectTo,
  message = 'You are not authorized to access this page',
  title = 'Unauthorized',
  variant = 'warning',
  deps = []
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (condition) {
      dispatch(
        setToastMessage({
          message,
          variant,
          title
        })
      );
      router.push(redirectTo);
    }
  }, deps);
};
