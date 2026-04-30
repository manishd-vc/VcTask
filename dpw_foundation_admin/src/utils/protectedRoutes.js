// Protected routes configuration
// - Purpose: Defines the routes that require specific permissions to access
// - Structure: Each route specifies its path and the required permissions

const protectedRoutes = [
  {
    path: '/admin/dashboard', // Path to user management page
    requiredPermissions: [] // Permission required to view this page
  },
  {
    path: '/admin/user-management', // Path to user management page
    requiredPermissions: ['user_manage_view', 'user_manage_operations', 'role_manage_operations'] // Permission required to view this page
  },
  {
    path: '/admin/user-management/users/add', // Path to add a new user
    requiredPermissions: ['user_manage_operations'] // Permission required to add a user
  },
  {
    path: '/admin/user-management/users/:id', // Path to edit a specific user
    requiredPermissions: ['user_manage_operations'] // Permission required to edit a user
  },
  {
    path: '/admin/user-management/users/view/:id', // Path to view a specific user's details
    requiredPermissions: ['user_manage_view', 'user_manage_operations'] // Permission required to view user details
  },
  {
    path: '/admin/user-management/roles', // Path to role management page
    requiredPermissions: ['role_manage_operations', 'role_manage_view']
  },
  {
    path: '/admin/user-management/roles/add', // Path to add a new role
    requiredPermissions: ['role_manage_operations'] // Permission required to add a role
  },
  {
    path: '/admin/user-management/roles/:id', // Path to edit a specific role
    requiredPermissions: ['role_manage_operations'] // Permission required to edit a role
  },
  {
    path: '/admin/user-management/users/log-history/:id', // Path to view a user's log history
    requiredPermissions: ['user_manage_view', 'user_manage_operations'] // Permission required to view log history
  },
  {
    path: '/admin/user-management/external-user/view/:id', // Path to view a specific external user
    requiredPermissions: ['user_manage_view', 'user_manage_operations'] // Permission required to view external users
  },
  {
    path: '/admin/user-management/external-user/view/:id/log', // Path to view a specific external user
    requiredPermissions: ['user_manage_view', 'user_manage_operations'] // Permission required to view external users
  },
  {
    path: '/admin/user-management/external-user/:id', // Path to view a specific external user
    requiredPermissions: ['user_manage_operations'] // Permission required to view external users
  },
  {
    path: '/admin/charity-operations/campaigns', // Path to campaign management page
    requiredPermissions: ['fund_manage_view', 'fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  {
    path: '/admin/charity-operations/campaigns/:id/edit', // Path to campaign management page
    requiredPermissions: ['fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  {
    path: '/admin/charity-operations/campaigns/add/:id', // Path to campaign management page
    requiredPermissions: ['fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  {
    path: '/admin/charity-operations/projects', // Path to campaign management page
    requiredPermissions: ['fund_manage_view', 'fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  {
    path: '/admin/charity-operations/statistics', // Path to campaign management page
    requiredPermissions: ['fund_manage_view', 'fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  {
    path: '/admin/charity-operations/projects/add/:id', // Path to campaign management page
    requiredPermissions: ['fund_manage_add'] // Permissions required to view, add, or edit campaigns
  },
  // Approvals and Operations
  {
    path: '/admin/charitable-administrator/campaigns-approvals',
    requiredPermissions: ['fund_manage_approve_reject']
  },
  {
    path: '/admin/charitable-administrator/campaigns-approvals/:id/approve',
    requiredPermissions: ['fund_manage_approve_reject']
  },
  {
    path: '/admin/charitable-administrator/projects-approvals',
    requiredPermissions: ['fund_manage_approve_reject']
  },
  {
    path: '/admin/charitable-administrator/projects-approvals/:id/approve',
    requiredPermissions: ['fund_manage_approve_reject']
  },
  //Supervisor Operations
  {
    path: '/admin/charitable-administrator/campaigns-supervisor', // Path to campaign approval page
    requiredPermissions: ['fund_manage_supervisor'] // Permission required to approve/reject campaigns
  },
  {
    path: '/admin/charitable-administrator/projects-supervisor', // Path to campaign approval page
    requiredPermissions: ['fund_manage_supervisor'] // Permission required to approve/reject campaigns
  },
  {
    path: '/admin/charitable-administrator/campaigns-supervisor/:id/view', // Path to campaign approval page
    requiredPermissions: ['fund_manage_supervisor'] // Permission required to approve/reject campaigns
  },
  {
    path: '/admin/charitable-administrator/projects-supervisor/:id/view', // Path to campaign approval page
    requiredPermissions: ['fund_manage_supervisor'] // Permission required to approve/reject campaigns
  },
  //Donor Operations
  {
    path: '/admin/donor-admin', // Path to campaign approval page
    requiredPermissions: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permission required to approve/reject campaigns
  },
  {
    path: '/admin/donor-assessment', // Path to campaign approval page
    requiredPermissions: ['donor_manage_assessment_view', 'donor_manage_assessment_operation'] // Permission required to approve/reject campaigns
  },
  {
    path: '/admin/donor-hod', // Path to campaign approval page
    requiredPermissions: ['donor_manage_hod_view', 'donor_manage_hod_operation'] // Permission required to approve/reject campaigns
  },

  //Grant Management
  {
    path: '/admin/grant-request',
    requiredPermissions: [
      'grant_manage_security_operations',
      'grant_manage_grant_view',
      'grant_manage',
      'grant_manage_hod_first_level_review_approval',
      'grant_manage_hod_second_level_review_approval',
      'grant_manage_admin_manage',
      'grant_manage_legal_operations',
      'grant_manage_compliance_operations',
      'grant_manage_iacad_operations',
      'grant_manage_admin_view'
    ]
  },
  {
    path: '/admin/grant-request/:id',
    requiredPermissions: ['grant_manage']
  },
  {
    path: '/admin/grant-request/:id/view',
    requiredPermissions: [
      'grant_manage_security_operations',
      'grant_manage_grant_view',
      'grant_manage',
      'grant_manage_hod_first_level_review_approval',
      'grant_manage_hod_second_level_review_approval',
      'grant_manage_admin_manage',
      'grant_manage_legal_operations',
      'grant_manage_compliance_operations',
      'grant_manage_iacad_operations',
      'grant_manage_admin_view'
    ]
  },
  {
    path: '/admin/grant-request/:id/sign-document',
    requiredPermissions: [
      'grant_manage_hod_first_level_review_approval',
      'grant_manage_hod_second_level_review_approval',
      'grant_manage_legal_operations',
      'grant_manage_admin_manage'
    ]
  },
  {
    path: '/admin/grant-request/:id/letter',
    requiredPermissions: ['grant_manage_admin_manage']
  },
  {
    path: '/admin/grant-request/:id/create',
    requiredPermissions: ['grant_manage']
  },

  //Partner Management
  {
    path: '/admin/partnership-request',
    requiredPermissions: [
      'partner_manage_view',
      'partner_manage',
      'partner_manage_security',
      'partner_manage_hod_first_level_review_approval',
      'partner_manage_compliance',
      'partner_manage_hod_second_level_review_approval',
      'partner_manage_admin_view',
      'partner_manage_admin_manage',
      'partner_manage_legal'
    ]
  },
  {
    path: '/admin/partnership-request/:id',
    requiredPermissions: ['partner_manage']
  },
  {
    path: '/admin/partnership-request/:id/view',
    requiredPermissions: [
      'partner_manage_view',
      'partner_manage',
      'partner_manage_security',
      'partner_manage_hod_first_level_review_approval',
      'partner_manage_compliance',
      'partner_manage_hod_second_level_review_approval',
      'partner_manage_admin_view',
      'partner_manage_admin_manage',
      'partner_manage_legal'
    ]
  },
  {
    path: '/admin/partnership-request/:id/sign-document',
    requiredPermissions: [
      'partner_manage_hod_first_level_review_approval',
      'partner_manage_hod_second_level_review_approval',
      'partner_manage_legal',
      'partner_manage_admin_manage'
    ]
  },
  {
    path: '/admin/partnership-request/:id/letter',
    requiredPermissions: ['partner_manage_admin_manage']
  },
  {
    path: '/admin/partnership-request/:id/create',
    requiredPermissions: ['partner_manage']
  },
  {
    path: '/admin/all-partners',
    requiredPermissions: ['partner_manage']
  },
  {
    path: '/admin/all-partners/:id',
    requiredPermissions: ['partner_manage']
  },
  {
    path: '/admin/all-partners/:id/contact-details',
    requiredPermissions: ['partner_manage']
  },

  //volunteer campaign management
  {
    path: '/admin/volunteer-campaigns',
    requiredPermissions: [
      'volunteer_campaign_view',
      'volunteer_campaign_manage',
      'volunteer_campaign_security',
      'volunteer_campaign_hod_first_level_review_approval',
      'volunteer_campaign_hod_second_level_review_approval'
    ]
  },
  {
    path: '/admin/volunteer-campaigns/create/:id',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/volunteer-campaigns/:id',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/volunteer-campaigns/:id/view',
    requiredPermissions: [
      'volunteer_campaign_view',
      'volunteer_campaign_manage',
      'volunteer_campaign_security',
      'volunteer_campaign_hod_first_level_review_approval',
      'volunteer_campaign_hod_second_level_review_approval'
    ]
  },
  {
    path: '/admin/volunteer-campaigns/:id/complete',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-volunteers',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-volunteers/create',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-volunteers/:id',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-volunteers/:id/view',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-enrollments',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-enrollments/:id/view',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/all-enrollments/:id/log-activity',
    requiredPermissions: ['volunteer_campaign_manage']
  },
  {
    path: '/admin/report-management',
    requiredPermissions: [
      'report_analytics_fundraising_campaign',
      'report_analytics_charitable_project',
      'report_analytics_donor_management',
      'report_analytics_grant_management',
      'report_analytics_partner_management',
      'report_analytics_volunteer_management',
      'report_analytics_beneficiary_management',
      'report_analytics_finance_management'
    ]
  },
  {
    path: '/admin/report-management/add',
    requiredPermissions: [
      'report_analytics_fundraising_campaign',
      'report_analytics_charitable_project',
      'report_analytics_donor_management',
      'report_analytics_grant_management',
      'report_analytics_partner_management',
      'report_analytics_volunteer_management',
      'report_analytics_beneficiary_management',
      'report_analytics_finance_management'
    ]
  },
  {
    path: '/admin/report-management/:id/edit',
    requiredPermissions: [
      'report_analytics_fundraising_campaign',
      'report_analytics_charitable_project',
      'report_analytics_donor_management',
      'report_analytics_grant_management',
      'report_analytics_partner_management',
      'report_analytics_volunteer_management',
      'report_analytics_beneficiary_management',
      'report_analytics_finance_management'
    ]
  },
  {
    path: '/admin/finance/donations',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/donations/:id/view',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/grant-request',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/grant-request/:id/view',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/grant-request/:id/make-payment',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/in-kind-contribution-requests',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/in-kind-contribution-requests/:id/view',
    requiredPermissions: ['finance_manage_operations']
  },
  {
    path: '/admin/finance/in-kind-contribution-requests/:id/make-payment',
    requiredPermissions: ['finance_manage_operations']
  }
];

// Export the protected routes
// - Purpose: Makes the protected routes configuration available for import in other files
export default protectedRoutes;
