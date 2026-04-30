import React from 'react';
import ResetPasswordSkeleton from 'src/components/_main/skeletons/auth/reset-password';

/**
 * Loading Component for ResetPassword Page
 *
 * This component is rendered while the ResetPassword page is loading. It uses a skeleton loader to indicate
 * to the user that the content is being fetched and will be available shortly.
 *
 * @returns {JSX.Element} The skeleton loader for the ResetPassword page.
 */
export default function Loading() {
  return <ResetPasswordSkeleton />;
}
