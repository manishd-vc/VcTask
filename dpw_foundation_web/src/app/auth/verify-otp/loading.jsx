import React from 'react';
import VerifyPasswordSkeleton from 'src/components/_main/skeletons/auth/verifyOtp';

/**
 * Loading Component for VerifyPassword Page
 *
 * This component is rendered while the VerifyPassword page is loading. It uses a skeleton loader to indicate
 * to the user that the content is being fetched and will be available shortly.
 *
 * @returns {JSX.Element} The skeleton loader for the VerifyPassword page.
 */
export default function Loading() {
  return <VerifyPasswordSkeleton />;
}
