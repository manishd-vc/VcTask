import MyEnrolments from 'src/components/_admin/my-enrolments';

// Meta information
export const metadata = {
  title: 'DPW Foundation - Dashboard',
  description: 'Welcome to the DPW Foundation Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'DPW Foundation Dashboard',
  authors: 'DPW Foundation',
  keywords: 'dashboard, e-commerce, management, DPW Foundation',
  icons: {
    icon: '/favicon.png'
  }
};

/**
 * Dashboard Page Component
 *
 * This is a placeholder page for the DPW Foundation Dashboard. It currently
 * renders an empty fragment. The page can be extended to include various
 * dashboard-related features in the future.
 */
export default function page() {
  return <MyEnrolments />;
}
