'use client';

import { LinearProgress, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import CustomTabs from 'src/components/tabs/tabs';
import { checkPermissions } from 'src/utils/permissions';

// Lazy-loaded components for tabs
const UserListingTabs = lazy(() => import('../../_admin/users/userList'));
const RoleListingTabs = lazy(() => import('../../_admin/roles/roleList'));

/**
 * Array defining the tab configuration for the User Management page.
 * Each tab specifies its label, value, required permissions, and content.
 */
const tabsData = [
  {
    label: 'Internal Users',
    value: 'users',
    requiredPermissions: ['user_manage_view', 'user_manage_operations'],
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <UserListingTabs tableTitle={'All Users'} />
      </Suspense>
    )
  },
  {
    label: 'Role',
    value: 'roles',
    requiredPermissions: ['role_manage_operations', 'role_manage_view'],
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <RoleListingTabs tableTitle={'All Roles'} />
      </Suspense>
    )
  },
  {
    label: 'Archived Users',
    value: 'archivedUsers',
    requiredPermissions: ['user_manage_view', 'user_manage_operations'],
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <UserListingTabs tableTitle={'All Archived Users'} />
      </Suspense>
    )
  },
  {
    label: 'Archived Roles',
    value: 'archivedRoles',
    requiredPermissions: ['role_manage_operations', 'role_manage_view'],
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <RoleListingTabs tableTitle={'All Archived Roles'} />
      </Suspense>
    )
  },
  {
    label: 'External Users',
    value: 'externalUsers',
    requiredPermissions: ['user_manage_view', 'user_manage_operations'],
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <UserListingTabs tableTitle={'All External Users'} />
      </Suspense>
    )
  }
];

/**
 * UserManagement Component
 *
 * Renders the User Management page, including navigation tabs, breadcrumbs, and actions.
 * Filters tabs and actions based on the user's assigned permissions.
 *
 * @returns {JSX.Element} - The rendered UserManagement component.
 */
export default function UserManagement() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access URL query parameters
  const initialTab = searchParams.get('tab'); // Determine the initial active tab
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles); // Retrieve user roles from the Redux store

  /**
   * Determines the action button label based on the active tab and user permissions.
   *
   * @returns {string|null} - The label for the action button, or null if no permissions.
   */

  useEffect(() => {
    if (!initialTab) {
      const allowedTab = tabsData.find((tab) => checkPermissions(rolesAssign, tab.requiredPermissions));
      if (allowedTab) {
        router.replace(`/admin/user-management?tab=${allowedTab.value}`);
      } else {
        router.replace('/admin/user-management?tab=users');
      }
    }
  }, [initialTab, rolesAssign, router]);

  const renderAction = () => {
    if (initialTab === 'users' && checkPermissions(rolesAssign, ['user_manage_operations'])) {
      return 'Create New User';
    } else if (initialTab === 'roles' && checkPermissions(rolesAssign, ['role_manage_operations'])) {
      return 'Create New Role';
    }
    return null;
  };

  // Filter the available tabs based on user permissions
  const filteredTabsData = tabsData.filter((tab) => checkPermissions(rolesAssign, tab.requiredPermissions));

  return (
    <>
      {/* Breadcrumb navigation with optional action button */}
      <HeaderBreadcrumbs
        admin
        heading="User Management"
        action={{
          href: `${initialTab === 'users' ? '/admin/user-management/users/add' : '/admin/user-management/roles/add'} `,
          title: renderAction()
        }}
      />

      {/* Tab navigation with filtered data */}
      <CustomTabs tabs={filteredTabsData} />
    </>
  );
}
