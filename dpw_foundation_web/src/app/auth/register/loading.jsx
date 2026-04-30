import React from 'react';

// components
import RegisterSkeleton from 'src/components/_main/skeletons/auth/register';

/**
 * Loading Component for Register Page
 *
 * This component is displayed while the register page is loading. It shows a skeleton loader to indicate that the
 * content is being loaded in the background.
 *
 * @returns {JSX.Element} The rendered skeleton loader for the register page.
 */
export default function Loading() {
  return <RegisterSkeleton />;
}
