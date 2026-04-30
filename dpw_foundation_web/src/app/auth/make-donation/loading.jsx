import React from 'react';
import ForgetPasswordSkeleton from 'src/components/_main/skeletons/auth/forget-password';

/**
 * Loading Component for Forget Password Page
 *
 * This component is displayed when the forget password page is loading. It renders a skeleton loading
 * component which provides a placeholder UI while the actual content is being fetched or loaded.
 *
 * @returns {JSX.Element} The rendered Loading component displaying the ForgetPasswordSkeleton
 */
export default function Loading() {
  return <ForgetPasswordSkeleton />;
}
