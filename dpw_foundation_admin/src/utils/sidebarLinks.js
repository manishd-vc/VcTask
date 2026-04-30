// Navigation links configuration
// - Purpose: Defines the structure and metadata for the admin navigation menu
// - Contains: Top-level menu items and their respective submenus (if any)

import {
  BeneficiaryManagementIcon,
  CharityAdministratorIcon,
  CharityOperationIcon,
  DashboardIcon,
  DonorManagementIcon,
  FinanceManagementIcon,
  GrantManagementIcon,
  PartnerManagementIcon,
  ReportManagementIcon,
  SettingIcon,
  UserManagementIcon,
  VolunteerManagementIcon
} from 'src/components/icons';

const navLinks = [
  {
    id: 0, // Unique identifier for the navigation item
    title: 'Dashboard', // Display title for the navigation link
    slug: 'dashboard', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: [], // Permissions required to access this link
    path: '/admin/dashboard', // URL path for the navigation link
    icon: <DashboardIcon width={50} height={43} />
  },
  {
    id: 1, // Unique identifier for the navigation item
    title: 'User Management', // Display title for the navigation link
    slug: 'user-management', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: ['user_manage_view', 'user_manage_operations', 'role_manage_operations'], // Permissions required to access this link
    path: '/admin/user-management', // URL path for the navigation link
    icon: <UserManagementIcon width={44} height={57} />
  },
  {
    id: 2, // Unique identifier for the navigation item
    title: <>Charity Operations</>, // Multi-line display title for the navigation link
    slug: 'campaign', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: ['fund_manage_view', 'fund_manage_add'], // Permissions required to access this link
    icon: <CharityOperationIcon width={75} height={40} />,
    subMenu: [
      {
        id: 1, // Unique identifier for the submenu item
        title: 'Campaigns', // Display title for the submenu link
        slug: 'charity-operations/campaigns', // Unique slug for the route
        path: '/admin/charity-operations/campaigns', // URL path for the submenu link
        permission: ['fund_manage_view', 'fund_manage_add'] // Permissions required to access this submenu
      },
      {
        id: 2, // Unique identifier for the submenu item
        title: 'Projects', // Display title for the submenu link
        slug: 'charity-operations/projects', // Unique slug for the route
        path: '/admin/charity-operations/projects', // URL path for the submenu link
        permission: ['fund_manage_view', 'fund_manage_add'] // Permissions required to access this submenu
      },
      {
        id: 3, // Unique identifier for the submenu item
        title: 'Statistics', // Display title for the submenu link
        slug: 'charity-operations/statistics', // Unique slug for the route
        path: '/admin/charity-operations/statistics', // URL path for the submenu link
        permission: ['fund_manage_view', 'fund_manage_add'] // Permissions required to access this submenu
      }
    ]
  },
  {
    id: 3, // Unique identifier for the navigation item
    title: <>Charity approval Operations</>, // Multi-line display title for the navigation link
    slug: 'campaign', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: ['fund_manage_approve_reject', 'fund_manage_supervisor'], // Permissions required to access this link
    icon: <CharityAdministratorIcon width={57} height={47} />,
    subMenu: [
      {
        id: 1, // Unique identifier for the submenu item
        title: 'Campaigns Approvals', // Display title for the submenu link
        slug: 'charitable-administrator/campaigns-approvals', // Unique slug for the route
        path: '/admin/charitable-administrator/campaigns-approvals', // URL path for the submenu link
        permission: ['fund_manage_approve_reject'] // Permissions required to access this submenu
      },
      {
        id: 2, // Unique identifier for the submenu item
        title: 'Projects Approvals', // Display title for the submenu link
        slug: 'charitable-administrator/projects-approvals', // Unique slug for the route
        path: '/admin/charitable-administrator/projects-approvals', // URL path for the submenu link
        permission: ['fund_manage_approve_reject'] // Permissions required to access this submenu
      },
      {
        id: 3, // Unique identifier for the submenu item
        title: 'Campaign Supervision', // Display title for the submenu link
        slug: 'charitable-administrator/campaigns-supervisor', // Unique slug for the route
        path: '/admin/charitable-administrator/campaigns-supervisor', // URL path for the submenu link
        permission: ['fund_manage_supervisor'] // Permissions required to access this submenu
      },
      {
        id: 4, // Unique identifier for the submenu item
        title: 'Projects Supervision', // Display title for the submenu link
        slug: 'charitable-administrator/projects-supervisor', // Unique slug for the route
        path: '/admin/charitable-administrator/projects-supervisor', // URL path for the submenu link
        permission: ['fund_manage_supervisor'] // Permissions required to access this submenu
      }
    ]
  },
  {
    id: 4, // Unique identifier for the navigation item
    title: 'Donor Management', // Display title for the navigation link
    slug: 'donor', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: [
      'donor_manage_admin_view',
      'donor_manage_admin_operation',
      'donor_manage_assessment_view',
      'donor_manage_assessment_operation',
      'donor_manage_hod_view',
      'donor_manage_hod_operation'
    ], // Permissions required to access this link
    icon: <DonorManagementIcon width={90} height={50} />,
    subMenu: [
      {
        id: 1, // Unique identifier for the submenu item
        title: 'Donation Pledges', // Display title for the submenu link
        slug: 'donor-admin', // Unique slug for the route
        path: '/admin/donor-admin', // URL path for the submenu link
        permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      },
      {
        id: 2, // Unique identifier for the submenu item
        title: 'Donations', // Display title for the submenu link
        slug: 'donations', // Unique slug for the route
        path: '/admin/donations', // URL path for the submenu link
        permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      },
      // {
      //   id: 3, // Unique identifier for the submenu item
      //   title: 'All Donors', // Display title for the submenu link
      //   slug: 'all-donors', // Unique slug for the route
      //   path: '/admin/all-donors', // URL path for the submenu link
      //   permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      // },
      // {
      //   id: 4, // Unique identifier for the submenu item
      //   title: 'Donor Email Group', // Display title for the submenu link
      //   slug: 'donor-email-group', // Unique slug for the route
      //   path: '/admin/donor-email-group', // URL path for the submenu link
      //   permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      // },
      // {
      //   id: 5, // Unique identifier for the submenu item
      //   title: 'Donor SMS Group', // Display title for the submenu link
      //   slug: 'donor-sms-group', // Unique slug for the route
      //   path: '/admin/donor-sms-group', // URL path for the submenu link
      //   permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      // },
      {
        id: 6, // Unique identifier for the submenu item
        title: 'On Site Donation', // Display title for the submenu link
        slug: 'on-the-spot-donation', // Unique slug for the route
        path: '/admin/on-the-spot-donation', // URL path for the submenu link
        permission: ['donor_manage_admin_view', 'donor_manage_admin_operation'] // Permissions required to access this submenu
      },
      {
        id: 7, // Unique identifier for the submenu item
        title: 'Assessment Operations', // Display title for the submenu link
        slug: 'donor-assessment', // Unique slug for the route
        path: '/admin/donor-assessment', // URL path for the submenu link
        permission: ['donor_manage_assessment_view', 'donor_manage_assessment_operation'] // Permissions required to access this submenu
      },
      {
        id: 8, // Unique identifier for the submenu item
        title: 'HOD Approval', // Display title for the submenu link
        slug: 'donor-hod', // Unique slug for the route
        path: '/admin/donor-hod', // URL path for the submenu link
        permission: ['donor_manage_hod_view', 'donor_manage_hod_operation'] // Permissions required to access this submenu
      }
    ]
  },

  {
    id: 5,
    title: 'Grant Management',
    slug: 'grant-management',
    isSearch: true,
    permission: [
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
    ],
    icon: <GrantManagementIcon width={44} height={44} />,
    subMenu: [
      {
        id: 1, // Unique identifier for the submenu item
        title: 'Grant Requests', // Display title for the submenu link
        slug: 'grant-request', // Unique slug for the route
        path: '/admin/grant-request', // URL path for the submenu link
        permission: [
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
        ] // Permissions required to access this submenu
      }
    ]
  },
  {
    id: 6,
    title: 'Partner Management',
    slug: 'partner-management',
    isSearch: true,
    permission: [
      'partner_manage_view',
      'partner_manage',
      'partner_manage_security',
      'partner_manage_hod_first_level_review_approval',
      'partner_manage_compliance',
      'partner_manage_hod_second_level_review_approval',
      'partner_manage_admin_view',
      'partner_manage_admin_manage',
      'partner_manage_legal'
    ],
    icon: <PartnerManagementIcon width={80} height={56} />,
    subMenu: [
      {
        id: 1, // Unique identifier for the submenu item
        title: 'Partnership Requests', // Display title for the submenu link
        slug: 'partnership-request', // Unique slug for the route
        path: '/admin/partnership-request', // URL path for the submenu link
        permission: [
          'partner_manage_view',
          'partner_manage',
          'partner_manage_security',
          'partner_manage_hod_first_level_review_approval',
          'partner_manage_compliance',
          'partner_manage_hod_second_level_review_approval',
          'partner_manage_admin_view',
          'partner_manage_admin_manage',
          'partner_manage_legal'
        ] // Permissions required to access this submenu
      },
      {
        id: 2, // Unique identifier for the submenu item
        title: 'All Partners', // Display title for the submenu link
        slug: 'all-partners', // Unique slug for the route
        path: '/admin/all-partners', // URL path for the submenu link
        permission: ['partner_manage'] // Permissions required to access this submenu
      }
    ]
  },
  {
    id: 7,
    title: 'Volunteer Management',
    slug: 'volunteer-management',
    isSearch: true,
    permission: [
      'volunteer_campaign_view',
      'volunteer_campaign_manage',
      'volunteer_campaign_security',
      'volunteer_campaign_hod_first_level_review_approval',
      'volunteer_campaign_hod_second_level_review_approval'
    ],
    icon: <VolunteerManagementIcon width={48} height={57} />,
    subMenu: [
      {
        id: 1,
        title: 'Volunteer Campaigns',
        slug: 'volunteer-campaigns',
        path: '/admin/volunteer-campaigns',
        permission: [
          'volunteer_campaign_view',
          'volunteer_campaign_manage',
          'volunteer_campaign_security',
          'volunteer_campaign_hod_first_level_review_approval',
          'volunteer_campaign_hod_second_level_review_approval'
        ]
      },
      {
        id: 2,
        title: 'All Enrollments',
        slug: 'all-enrollments',
        path: '/admin/all-enrollments',
        permission: ['volunteer_campaign_manage']
      },
      {
        id: 3,
        title: 'All Volunteers',
        slug: 'all-volunteers',
        path: '/admin/all-volunteers',
        permission: ['volunteer_campaign_manage']
      }
    ]
  },
  {
    id: 8,
    title: 'Beneficiary Management',
    slug: 'beneficiary-management',
    isSearch: true,
    permission: [
      'contribution_view',
      'contribution_manage',
      'contribution_store_manager',
      'contribution_security',
      'contribution_hod_first_level_review_approval',
      'contribution_compliance',
      'contribution_hod_second_level_review_approval'
    ],
    icon: <BeneficiaryManagementIcon width={58} height={44} />,
    subMenu: [
      {
        id: 1,
        title: 'All Beneficiaries',
        slug: 'all-beneficiaries',
        path: '/admin/all-beneficiaries',
        permission: ['internal']
      },
      {
        id: 2,
        title: 'In-Kind Contribution Requests',
        slug: 'in-kind-contribution-requests',
        path: '/admin/in-kind-contribution-requests',
        permission: [
          'contribution_manage',
          'contribution_store_manager',
          'contribution_security',
          'contribution_hod_first_level_review_approval',
          'contribution_compliance',
          'contribution_hod_second_level_review_approval',
          'contribution_view'
        ]
      },
      {
        id: 3,
        title: 'All Projects',
        slug: 'all-projects',
        path: '/admin/all-projects',
        permission: ['internal']
      }
    ]
  },
  {
    id: 9,
    title: 'Finance Management',
    slug: 'finance',
    isSearch: true,
    permission: ['finance_manage_operations'],
    icon: <FinanceManagementIcon width={50} height={47} />,
    subMenu: [
      {
        id: 1,
        title: 'Donations',
        slug: 'finance/donations',
        path: '/admin/finance/donations',
        permission: ['finance_manage_operations']
      },
      {
        id: 2,
        title: 'Grant Requests',
        slug: 'finance/grant-request',
        path: '/admin/finance/grant-request',
        permission: ['finance_manage_operations']
      },
      {
        id: 3,
        title: 'In Kind Contribution Requests',
        slug: 'finance/in-kind-contribution-requests',
        path: '/admin/finance/in-kind-contribution-requests',
        permission: ['finance_manage_operations']
      }
    ]
  },
  {
    id: 10, // Unique identifier for the navigation item
    title: 'Settings / Configuration', // Display title for the navigation link
    slug: 'settings-configuration', // Unique slug for the route
    isSearch: true, // Indicates whether this link should appear in the search functionality
    permission: ['setting_configuration_admin_manage', 'setting_configuration_admin_view'], // Permissions required to access this link
    path: '/admin/settings-configuration', // URL path for the navigation link
    icon: <SettingIcon width={44} height={44} />
  },
  {
    id: 11,
    title: 'Reports and Analytics',
    slug: 'report-management',
    isSearch: true,
    icon: <ReportManagementIcon width={80} height={47} />,
    permission: ['internal'],
    subMenu: [
      {
        id: 1,
        title: 'Dynamic Reports',
        path: '/admin/report-management',
        slug: 'report-management',
        permission: [
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
        id: 2,
        title: 'Static Reports',
        path: '/admin/report-statistics',
        slug: 'report-statistics',
        permission: ['internal']
      }
    ]
  }
];

// Export the navigation links
// - Purpose: Makes the navigation configuration available for import in other files
export default navLinks;
