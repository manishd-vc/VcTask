import AllProjectsListing from 'src/components/_admin/all-projects';

// Meta information
export const metadata = {
  title: 'All Projects | DP World Foundation',
  description:
    'View and manage all charitable projects for DP World Foundation. Monitor project progress, target amounts, and achievements.',
  applicationName: 'DP World Charity Management Platform',
  authors: [{ name: 'DP World Foundation' }],
  keywords: [
    'All projects, charitable projects, project management, DP World Foundation, project tracking, fundraising projects, campaign management, project status, target amounts'
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png'
  }
};

/**
 * All Projects Page Component
 *
 * This page renders the admin interface for viewing all charitable projects,
 * allowing administrators to monitor project progress and manage project data.
 */
export default async function page() {
  return <AllProjectsListing />;
}
