'use client'; // Indicates this file is a client-side component in Next.js

// mui imports
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import DashboardMenu from './dashboardMenu';
// Dashboard component renders an empty Box for now.
Dashboard.propTypes = {}; // Defines prop types (empty in this case)

/**
 * Dashboard component serves as a placeholder for the dashboard UI.
 * Currently, it renders an empty Box component from MUI.
 *
 * @returns {JSX.Element} The Dashboard component, which currently renders an empty Box.
 */
export default function Dashboard() {
  return (
    <>
      <HeaderBreadcrumbs admin heading="Dashboard" />
      <DashboardMenu />
    </>
  );
}
