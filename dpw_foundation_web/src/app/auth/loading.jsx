import React from 'react';
import ForgetPasswordSkeleton from 'src/components/_main/skeletons/auth/forget-password';

/**
 * Loading Component for the Forget Password Page
 *
 * This component renders a skeleton loader for the forget password page while the actual content is being loaded.
 * The `ForgetPasswordSkeleton` component is imported and used to create a loading state with a placeholder
 * that mimics the layout of the forget password page.
 */
export default function Loading() {
  return <ForgetPasswordSkeleton />;
}
