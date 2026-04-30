import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';
/**
 * Retrieves the token from the browser's cookies.
 * @returns {string} The token if found, or an empty string if not found.
 */
export const getToken = () => {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (const c of ca) {
      let trimmed = c.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return '';
  }
  return '';
};

/**
 * Logs in the user using the provided credentials.
 * @param {object} payload - The login credentials.
 * @param {string} payload.username - The user's username.
 * @param {string} payload.password - The user's password.
 * @returns {Promise<object>} The response data containing the login result.
 */
export const login = async (payload) => {
  const { data } = await http.post(`/user/signin`, payload);
  return data;
};

export const logOutApi = async () => {
  const { data } = await http.post(`/user/sign-out`);
  return data;
};
/**
 * Sends a request to resend OTP for password recovery.
 * @param {object} payload - The email or phone number to send OTP to.
 * @param {string} payload.identifier - The user's email or phone number.
 * @returns {Promise<object>} The response data confirming the OTP request.
 */
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/user/forgot-password`, payload);
  return data;
};

/**
 * Verifies the OTP entered by the user for password recovery.
 * @param {object} payload - The OTP verification data.
 * @param {string} payload.otp - The OTP entered by the user.
 * @returns {Promise<object>} The response data confirming the OTP verification.
 */
export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/user/verify-otp`, payload);
  return data;
};

/**
 * Resets the profile data using the given token.
 * @param {string} token - The token used to reset the profile.
 * @returns {Promise<object>} The response data confirming the reset action.
 */
export const resetProfileData = async (token) => {
  const { data } = await http.get('/user/reset-profile/' + token);
  return data;
};

/**
 * Requests password recovery by sending a reset link to the user's email.
 * @param {object} payload - The request data containing the user's email or phone number.
 * @param {string} payload.identifier - The user's email or phone number for recovery.
 * @returns {Promise<object>} The response data confirming the request.
 */
export const forgetPassword = async (payload) => {
  const { data } = await http.post('/user/forgot-password', payload);
  return data;
};

/**
 * Resets the user's password using the provided token and new password.
 * @param {object} payload - The new password and token.
 * @param {string} payload.password - The new password.
 * @param {string} payload.token - The token used to reset the password.
 * @returns {Promise<object>} The response data confirming the password reset.
 */
export const resetPassword = async ({ password, token }) => {
  const { data } = await http.post('/user/reset-password', {
    password: password,
    token: token
  });
  return data;
};

/**
 * Logs out the admin user.
 * @returns {Promise<object>} The response data confirming the logout action.
 */
export const logOutAdmin = async () => {
  const { data } = await http.get('/user/logout');
  return data;
};

/**
 * Fetches campaigns managed by admins with pagination and filters.
 * @param {number} page - The page number for pagination.
 * @param {string} search - The search keyword for filtering campaigns.
 * @param {string} type - The type of campaign (e.g., "active", "closed").
 * @param {string} status - The status of the campaign (e.g., "approved", "rejected").
 * @param {string} fromDate - The start date for filtering campaigns.
 * @param {string} toDate - The end date for filtering campaigns.
 * @param {number} size - The number of results per page (default is 10).
 * @returns {Promise<object>} The response data containing the paginated campaigns.
 */
export const getCampaignByAdminsByAdmin = async (page, search, type, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(`/campaign/pagination?sort=&page=${page - 1}&size=${size}`, {
    keyword: search,
    campaignType: type,
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate,
      toDate: toDate
    },
    datePattern: getLocaleDateString(true)
  });
  return response;
};

/**
 * Fetches notifications with pagination.
 * @param {object} obj - The request payload for fetching notifications.
 * @returns {Promise<object>} The response data containing the paginated notifications.
 */
export const fetchNotifications = async (obj) => {
  try {
    const { data } = await http.post(`/campaign/notifications/pagination`, obj);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error; // or handle error as needed
  }
};

/**
 * Fetches campaign approval data with pagination and filters.
 * @param {number} page - The page number for pagination.
 * @param {number} size - The number of results per page.
 * @param {string} search - The search keyword for filtering campaigns.
 * @param {string} type - The type of campaign (e.g., "active", "closed").
 * @param {string} status - The status of the campaign (e.g., "approved", "rejected").
 * @param {string} fromDate - The start date for filtering campaigns.
 * @param {string} toDate - The end date for filtering campaigns.
 * @returns {Promise<object>} The response data containing the paginated campaign approvals.
 */
export const getCampaignApprovalByAdminsByAdmin = async ({
  page,
  size,
  search,
  type,
  status,
  fromDate,
  toDate,
  apiPath = 'approval'
}) => {
  const { data: response } = await http.post(`/campaign/${apiPath}/pagination?sort=&page=${page - 1}&size=${size}`, {
    keyword: search,
    campaignType: type,
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate,
      toDate: toDate
    }
  });
  return response;
};

/**
 * Fetches purchase order data for a specific campaign with pagination and filters.
 * @param {number} page - The page number for pagination.
 * @param {string} search - The search keyword for filtering purchase orders.
 * @param {string} campaignId - The campaign ID to filter purchase orders by.
 * @param {string} fromDate - The start date for filtering purchase orders.
 * @param {string} toDate - The end date for filtering purchase orders.
 * @returns {Promise<object>} The response data containing the paginated purchase orders.
 */
export const getCampaignPOByAdminsByAdmin = async (page, search, campaignId, fromDate, toDate) => {
  const { data: response } = await http.post(`/campaign/purhcase-order/pagination?sort=&page=${page - 1}&size=100`, {
    keyword: search,
    campaignId: campaignId,
    poDate: {
      fromDate: fromDate,
      toDate: toDate
    }
  });
  return response;
};

/**
 * Deletes a campaign by the given slug.
 * @param {string} slug - The unique identifier of the campaign to be deleted.
 * @returns {Promise<object>} The response data confirming the deletion of the campaign.
 */
export const deleteCampaignByAdmin = async (slug) => {
  const { data } = await http.delete(`/campaign/delete/${slug}`);
  return data;
};

/**
 * Deletes a purchase order by the given slug.
 * @param {string} slug - The unique identifier of the purchase order to be deleted.
 * @returns {Promise<object>} The response data confirming the deletion of the purchase order.
 */
export const deletePOByAdmin = async (slug) => {
  const { data } = await http.delete(`/campaign/purhcase-order/delete/${slug}`);
  return data;
};

/**
 * Deletes a campaign by the given slug.
 * @param {string} slug - The unique identifier of the campaign to be deleted.
 * @returns {Promise<object>} The response data confirming the deletion of the campaign.
 */
export const getApprovalTree = async (slug) => {
  const { data } = await http.post(`/campaign/campaign-status-list?entityId=${slug}`, {});
  return data;
};

/**
 * Assigns a campaign to an admin for approval.
 * @param {string} slug - The unique identifier of the campaign to be assigned.
 * @returns {Promise<object>} The response data confirming the campaign assignment.
 */
export const assignCampaignByAdmin = async ({ slug }) => {
  const { data } = await http.put(`/campaign/approval/${slug}/assign`, {});
  return data;
};

/**
 * Requests more information for a campaign approval.
 * @param {object} payload - The request data containing campaign slug, content, and optional fileId.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.content - The content requesting more information.
 * @param {string} [payload.fileId] - The optional file ID related to the request.
 * @returns {Promise<object>} The response data confirming the request for more information.
 */
export const needInfoCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/more-info`, {
    approvalStatus: 'NEED_MORE_INFO',
    content: payload.content,
    fileId: payload?.fileId
  });
  return data;
};

/**
 * Rejects a campaign for approval.
 * @param {object} payload - The rejection data containing campaign slug and content.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.content - The content explaining the rejection.
 * @returns {Promise<object>} The response data confirming the campaign rejection.
 */
export const rejectCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/reject`, {
    approvalStatus: 'REJECTED',
    content: payload.content
  });
  return data;
};

/**
 * Approves a campaign for approval.
 * @param {object} payload - The approval data containing campaign slug, status, and content.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.status - The status of the approval (e.g., 'approved').
 * @param {string} payload.content - The content of the approval.
 * @returns {Promise<object>} The response data confirming the campaign approval.
 */
export const approveCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/approved`, {
    approvalStatus: payload.status,
    content: payload.content
  });
  return data;
};

/**
 * Assigns a campaign to a specific user for approval.
 * @param {object} payload - The assignment data containing campaign slug, userId, status, and content.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.userId - The ID of the user the campaign is being assigned to.
 * @param {string} payload.status - The approval status for the assignment.
 * @param {string} payload.content - The content for the assignment.
 * @returns {Promise<object>} The response data confirming the assignment.
 */
export const assignToCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/assign-to/${payload.userId}`, {
    approvalStatus: payload.status,
    content: payload.content
  });
  return data;
};

/**
 * Adds a purchase order to a campaign.
 * @param {object} payload - The purchase order data.
 * @param {string} payload.campaignId - The campaign ID the purchase order belongs to.
 * @param {string} payload.poNumber - The purchase order number.
 * @param {number} payload.poQuantity - The quantity in the purchase order.
 * @param {number} payload.poValue - The value of the purchase order.
 * @param {string} payload.poDescription - A description of the purchase order.
 * @param {string} payload.poItem - The items included in the purchase order.
 * @param {string} payload.poDate - The date of the purchase order.
 * @param {string[]} payload.fileIds - The IDs of any related files.
 * @returns {Promise<object>} The response data confirming the creation of the purchase order.
 */
export const addPOCampaignByAdmin = async (payload) => {
  const { data } = await http.post(`/campaign/purhcase-order/create/${payload.campaignId}`, {
    id: null,
    poNumber: payload.poNumber,
    poQuantity: payload.poQuantity,
    poValue: payload.poValue,
    poDescription: payload.poDescription,
    poItem: payload.poItem,
    poDate: payload.poDate,
    fileIds: payload.fileIds
  });
  return data;
};

/**
 * Approves a campaign's iacad request by admin.
 * @param {object} payload - The iacad approval data.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.iacadRequestId - The iacad request ID.
 * @param {string} payload.iacadPermitId - The iacad permit ID.
 * @param {string} payload.approvalStatus - The approval status (e.g., 'approved').
 * @param {string} payload.responseDate - The response date for the iacad approval.
 * @returns {Promise<object>} The response data confirming the iacad approval.
 */
export const iacadApproveCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/iacad/approval`, {
    iacadRequestId: payload.iacadRequestId,
    iacadPermitId: payload.iacadPermitId,
    approvalStatus: payload.approvalStatus,
    responseDate: payload.responseDate
  });
  return data;
};

/**
 * Updates the AFE number for a campaign approval.
 * @param {object} payload - The AFE update data.
 * @param {string} payload.slug - The unique identifier of the campaign.
 * @param {string} payload.aefNumber - The AFE number to be assigned.
 * @param {number} payload.fundsRequired - The required funds.
 * @param {number} payload.fundsAlloted - The allotted funds.
 * @returns {Promise<object>} The response data confirming the AFE update.
 */
export const afeNumberCampaignByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/approval/${payload.slug}/afe`, {
    aefNumber: payload.aefNumber,
    fundsRequired: payload.fundsRequired,
    fundsAlloted: payload.fundsAlloted
  });
  return data;
};

/**
 * Fetches user data with pagination and filters.
 * @param {object} params - The pagination and filter parameters.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.rows - The number of rows per page.
 * @param {string} params.search - The search keyword for filtering users.
 * @param {string} params.role - The role of the user.
 * @param {string} params.status - The status of the user.
 * @param {string} params.fromDate - The start date for filtering users.
 * @param {string} params.toDate - The end date for filtering users.
 * @returns {Promise<object>} The response data containing the paginated users.
 */
export const getUserByAdminsByAdmin = async ({
  page,
  rows,
  search,
  role,
  status,
  fromDate,
  toDate,
  isExternal = false
}) => {
  const ext = isExternal ? `/user/ext/pagination` : '/user/pagination';
  const { data: response } = await http.get(
    `${ext}?keyword=${search}&page=${page - 1}&size=${rows}&role=${role || ''}&status=${status || ''}&fromDate=${fromDate}&toDate=${toDate}&datePattern=${getLocaleDateString()} `
  );
  return response;
};

/**
 * Fetches data of a specific user by their ID.
 * @param {string} id - The unique identifier of the user.
 * @returns {Promise<object>} The response data containing the user's information.
 */
export const getUserByAdmin = async (id) => {
  const { data: response } = await http.get(`/user/${id}`);
  return response?.data;
};

/**
 * Fetches all available roles for users.
 * @param {string} skipId - The ID to skip when fetching roles (optional).
 * @returns {Promise<object>} The response data containing the available roles.
 */
export const getAllRoles = async (skipId = '') => {
  const { data: response } = await http.get(`/user/role/all?skipId=${skipId || ''}`);
  return response;
};

/**
 * Adds a new user by admin.
 * @param {object} payload - The data of the user to be added.
 * @returns {Promise<object>} The response data confirming the user creation.
 */
export const addUserByAdmin = async (payload) => {
  const { data } = await http.post('/user/create', payload);
  return data;
};

/**
 * Updates an existing user by admin.
 * @param {object} payload - The data of the user to be updated.
 * @returns {Promise<object>} The response data confirming the user update.
 */
export const updateUserByAdmin = async (payload) => {
  const { data } = await http.put('/user/update/' + payload.id, payload);
  return data;
};

/**
 * Fetches the login history of a user with pagination.
 * @param {string} id - The unique identifier of the user.
 * @param {number} page - The page number for pagination.
 * @param {string} sort - The sorting criteria for the logs.
 * @returns {Promise<object>} The response data containing the user's login history.
 */
export const getUserLogHistory = async (id, page, sort) => {
  const { data: response } = await http.get(
    `user/login-audit/user/${id}/pagination?page=${page - 1 || 0}&size=10&sort=${sort || ''}`
  );
  return response;
};

/**
 * Fetches the login history of a user with pagination.
 * @param {string} id - The unique identifier of the user.
 * @param {number} page - The page number for pagination.
 * @param {string} sort - The sorting criteria for the logs.
 * @returns {Promise<object>} The response data containing the user's login history.
 */
export const getExtUserLogHistory = async ({ id, page, rows, sort }) => {
  const { data: response } = await http.get(
    `user/login-audit/ext/user/${id}/logs?page=${page - 1 || 0}&size=${rows || 10}&sort=${sort || ''}`
  );
  return response;
};

export const getIntUserLogHistory = async ({ id, page, rows, sort }) => {
  const { data: response } = await http.get(
    `user/login-audit/user/${id}/logs?page=${page - 1 || 0}&size=${rows || 10}&sort=${sort || ''}`
  );
  return response;
};

/**
 * Deletes a back office user by admin.
 * @param {object} payload - The data containing the user to be deleted.
 * @returns {Promise<object>} The response data confirming the deletion of the user.
 */
export const deleteBackOfficeUser = async (payload) => {
  const { data } = await http.delete(`/user/delete`, { data: payload });
  return data;
};

// Roles

/**
 * Retrieves a paginated list of user roles with sorting options.
 *
 * @param {Object} payload - The request payload containing page, rows, sort, and other filters.
 * @param {number} payload.page - The current page number.
 * @param {number} payload.rows - The number of rows per page.
 * @param {string} payload.sort - The sorting criteria (optional).
 * @param {Object} payload.payload - The additional filter parameters.
 * @returns {Promise<Object>} - The response containing the list of user roles.
 */
export const getUserRoles = async (payload) => {
  const { data: response } = await http.post(
    `user/role/pagination?page=${payload?.page - 1 || 0}&size=${payload.rows}&sort=${payload?.sort || 'name'}`,
    payload?.payload
  );
  return response;
};

/**
 * Fetches a list of user modules.
 *
 * @returns {Promise<Array>} - The list of user modules.
 */
export const getUserModule = async () => {
  const { data } = await http.get(`/user/module`);
  return data?.data || [];
};

/**
 * Creates a new user role.
 *
 * @param {Object} payload - The data for creating a new role.
 * @returns {Promise<Object>} - The response containing the created role data.
 */
export const createNewRoles = async (payload) => {
  const { data } = await http.post(`/user/role/create`, payload);
  return data;
};

/**
 * Retrieves a specific user role by its ID.
 *
 * @param {string} id - The ID of the role to fetch.
 * @returns {Promise<Object>} - The response containing the role data.
 */
export const getRoles = async (id) => {
  const { data } = await http.get(`/user/role/${id}`);
  return data?.data;
};

/**
 * Fetches a list of approver users based on a search keyword.
 *
 * @param {string} keyword - The keyword to search for approver users.
 * @returns {Promise<Object>} - The list of approver users matching the search.
 */
export const getApproverUsersList = async (keyword) => {
  const { data } = await http.get(`/user/access-wise/autosearch?page=0&status=Active&size=500&keyword=${keyword}`);
  return data;
};

/**
 * Retrieves a list of users matching the provided keyword.
 *
 * @param {string} keyword - The keyword to search for users.
 * @returns {Promise<Object>} - The list of users matching the keyword.
 */
export const getUsersList = async (keyword) => {
  const { data } = await http.get(`/user/autosearch?page=0&size=10000&keyword=${keyword}`);
  return data;
};

/**
 * Updates an existing user role by its ID.
 *
 * @param {Object} payload - The data to update the role.
 * @param {string} payload.id - The ID of the role to update.
 * @returns {Promise<Object>} - The response containing the updated role data.
 */
export const updateRole = async (payload) => {
  const { data } = await http.put(`/user/role/update/${payload.id}`, payload);
  return data;
};

/**
 * Retrieves a list of assigned roles/functions.
 *
 * @returns {Promise<Object>} - The response containing the list of assigned roles/functions.
 */
export const assignRoles = async () => {
  const { data } = await http.get(`/user/assignedfunctions`);
  return data;
};

/**
 * Deletes a specific user role by its ID.
 *
 * @param {Object} params - The parameters for the delete request.
 * @param {string} params.id - The ID of the role to delete.
 * @param {Object} params.payload - The payload containing additional data for deletion.
 * @returns {Promise<Object>} - The response confirming the deletion.
 */
export const deleteRoles = async ({ id, payload }) => {
  const { data } = await http.post(`/user/role/delete/${id}`, payload);
  return data;
};

/**
 * Restores a previously deleted role by its ID.
 *
 * @param {Object} params - The parameters for restoring the role.
 * @param {string} params.id - The ID of the role to restore.
 * @returns {Promise<Object>} - The response confirming the restoration.
 */
export const restoreRoles = async ({ id }) => {
  const { data } = await http.post(`/user/role/restore/${id}`);
  return data;
};

/**
 * Retrieves a list of roles matching a given ID.
 *
 * @param {string} id - The ID to match roles against.
 * @returns {Promise<Object>} - The list of roles matching the ID.
 */
export const getRoleMatchingList = async (id) => {
  const { data } = await http.get(`/user/role-matching/${id}`);
  return data?.data;
};

/**
 * Restores a deleted user by their ID.
 *
 * @param {Object} params - The parameters for restoring the user.
 * @param {string} params.id - The ID of the user to restore.
 * @returns {Promise<Object>} - The response confirming the restoration.
 */
export const restoreUser = async ({ id }) => {
  const { data } = await http.patch(`/user/restore-user/${id}`);
  return data;
};

// --- brand

/**
 * Updates a user's role by admin.
 *
 * @param {string} id - The ID of the user whose role needs to be updated.
 * @returns {Promise<Object>} - The response confirming the update.
 */
export const updateUserRoleByAdmin = async (id) => {
  const { data: response } = await http.post(`/admin/users/role/${id}`);
  return response;
};

/**
 * Edits a payment by admin.
 *
 * @param {Object} payload - The payload containing payment details to update.
 * @param {string} pid - The ID of the payment to be updated.
 * @returns {Promise<Object>} - The response with the updated payment information.
 */
export const editPaymentByAdmin = async ({ pid, ...payload }) => {
  const { data } = await http.put(`/admin/payments/${pid}`, { ...payload });
  return data;
};

/**
 * Creates a new payment by admin.
 *
 * @param {Object} payload - The data for creating a new payment.
 * @returns {Promise<Object>} - The response containing the created payment data.
 */
export const createPaymentByAdmin = async ({ ...payload }) => {
  const { data } = await http.post(`/admin/payments`, { ...payload });
  return data;
};

/**
 * Retrieves a product by its slug.
 *
 * @param {string} slug - The slug of the product to retrieve.
 * @returns {Promise<Object>} - The response containing the product data.
 */
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`/products/${slug}`);
  return data;
};

/**
 * Retrieves a list of invoices for a user.
 *
 * @param {number} page - The page number for paginated invoices.
 * @returns {Promise<Object>} - The response containing the list of invoices.
 */
export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`/users/invoice${page}`);
  return response;
};
// User Profile & Authentication

/**
 * Updates the user profile with new data.
 *
 * @param {Object} payload - The data to update the user profile.
 * @returns {Promise<Object>} - The response containing the updated profile data.
 */
export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/users/profile`, payload);
  return data;
};

/**
 * Changes the user's password.
 *
 * @param {Object} payload - The data containing the current and new password.
 * @returns {Promise<Object>} - The response confirming the password change.
 */
export const changePassword = async ({ ...payload }) => {
  const { data } = await http.post(`/user/change-password`, payload);
  return data;
};

// Search & Filters

/**
 * Performs a search with the given parameters.
 *
 * @param {Object} payload - The search parameters.
 * @returns {Promise<Object>} - The response containing the search results.
 */
export const search = async (payload) => {
  const { data } = await http.post(`/search`, payload);
  return data;
};

/**
 * Retrieves available search filters.
 *
 * @returns {Promise<Object>} - The response containing search filter options.
 */
export const getSearchFilters = async () => {
  const { data } = await http.get(`/search-filters`);
  return data;
};

// Invoices

/**
 * Retrieves a list of user invoices.
 *
 * @returns {Promise<Object>} - The response containing the invoices.
 */
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};

// File Management

/**
 * Deletes a file by its ID.
 *
 * @param {string} id - The ID of the file to delete.
 * @returns {Promise<Object>} - The response confirming the file deletion.
 */
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`/delete-file/${id}`);
  return data;
};

// Newsletter

/**
 * Sends a newsletter with the provided payload.
 *
 * @param {Object} payload - The data for sending the newsletter.
 * @returns {Promise<Object>} - The response confirming the newsletter was sent.
 */
export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};

// Wishlist

/**
 * Retrieves the user's wishlist.
 *
 * @returns {Promise<Object>} - The response containing the wishlist.
 */
export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};

// Product Comparison

/**
 * Compares a list of products.
 *
 * @param {Array} products - The list of products to compare.
 * @returns {Promise<Object>} - The response containing the comparison results.
 */
export const getCompareProducts = async (products) => {
  const { data } = await http.post(`/compare/products`, { products });
  return data;
};

// User Profile

/**
 * Retrieves the user profile.
 *
 * @returns {Promise<Object>} - The response containing the user profile data.
 */
export const getProfile = async () => {
  const { data } = await http.get(`/user/profile`);
  return data;
};

// Categories

/**
 * Retrieves all available categories.
 *
 * @returns {Promise<Object>} - The response containing the list of categories.
 */
export const getAllCategories = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};

// Shops

/**
 * Retrieves a list of home shops with a limit of 5 results.
 *
 * @returns {Promise<Object>} - The response containing the list of shops.
 */
export const getHomeShops = async () => {
  const { data } = await http.get(`/shops?limit=5`);
  return data;
};

/**
 * Adds a new shop for the user.
 *
 * @param {Object} payload - The data for creating the new shop.
 * @returns {Promise<Object>} - The response containing the created shop data.
 */
export const addShopByUser = async (payload) => {
  const { data } = await http.post(`/shops`, {
    ...payload
  });
  return data;
};

/**
 * Retrieves a list of available currencies.
 *
 * @returns {Promise<Object>} - The response containing the list of currencies.
 */
export const getCurrencies = async () => {
  const { data } = await http.get(`/currencies`);
  return data;
};

/**
 * Follows a shop by its ID.
 *
 * @param {string} shopId - The ID of the shop to follow.
 * @returns {Promise<Object>} - The response confirming that the shop has been followed.
 */
export const followShop = async (shopId) => {
  const { data } = await http.put(`/shops/${shopId}/follow`);
  return data;
};

// Campaign Management

/**
 * Creates a new campaign.
 *
 * @param {Object} payload - The data for creating the campaign.
 * @returns {Promise<Object>} - The response containing the created campaign data.
 */
export const createNewCampaign = async (payload) => {
  const { data } = await http.post(`/campaign/create`, payload);
  return data;
};

/**
 * Retrieves a campaign by its ID.
 *
 * @param {string} id - The ID of the campaign to retrieve.
 * @returns {Promise<Object>} - The response containing the campaign data.
 */
export const getCampaignById = async (id) => {
  const { data } = await http.get(`/campaign/${id}`);
  return data?.data;
};

/**
 * Creates new campaign questions.
 *
 * @param {Object} payload - The data for creating the campaign questions.
 * @returns {Promise<Object>} - The response containing the created questions.
 */
export const createCampaignQuestions = async (payload) => {
  const { data } = await http.post(`/campaign/postanalysis/create`, payload); //campaign/questions/create
  return data;
};
export const createCampaignQuestionsAnswer = async (payload) => {
  const { data } = await http.post(`/campaign/postanalysis/answers`, payload); //campaign/questions/create
  return data;
};

/**
 * Retrieves the questions for a campaign.
 *
 * @param {string} id - The ID of the campaign to get questions for.
 * @param {string} type - The type of questions (default is 'CAMPAIGN').
 * @returns {Promise<Object>} - The response containing the campaign questions.
 */
export const getCampaignQuestions = async (id, type = 'CAMPAIGN') => {
  const { data } = await http.get(`/campaign/postanalysis/${type}/${id}`);
  return data?.data;
};

export const getPaymentHistory = async (id) => {
  const { data } = await http.get(`campaign/${id}/donation-history`);
  return data?.data;
};

/**
 * Updates an existing campaign with new data.
 *
 * @param {string} id - The ID of the campaign to update.
 * @param {Object} payload - The data to update the campaign with.
 * @returns {Promise<Object>} - The response containing the updated campaign data.
 */
export const updateCampaign = async ({ id, payload }) => {
  const { data } = await http.put(`/campaign/update/${id}`, payload);
  return data;
};

/**
 * Retrieves a list of supervisors based on user roles.
 *
 * @returns {Promise<Object>} - The response containing the list of supervisors.
 */
export const getRoleSuperVisorList = async (accessType) => {
  const { data } = await http.get(`/user/access-wise/autosearch?page=0&size=1000&access=${accessType}`);
  return data?.data;
};
// Campaign Banner Upload

/**
 * Uploads a banner for a campaign.
 *
 * @param {Object} payload - The form data to upload the banner.
 * @param {string} entityId - The ID of the campaign entity.
 * @returns {Promise<Object>} - The response containing the uploaded banner data.
 */
export const uploadCampaignBanner = async ({ payload, entityId }) => {
  const { data } = await http.post(`/campaign/upload-banner?entityId=${entityId}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// Common File Uploads

/**
 * Uploads files to a specific entity.
 *
 * @param {Object} params - The parameters for file upload.
 * @param {string} params.entityId - The ID of the entity.
 * @param {string} params.parentEntityId - The parent entity ID (optional).
 * @param {string} params.entityType - The type of the entity.
 * @param {string} params.moduleType - The module type for the upload.
 * @param {FormData} params.payload - The files to upload.
 * @returns {Promise<Object>} - The response containing the uploaded file data.
 */

export const uploadFiles = async ({ entityId, parentEntityId, entityType, moduleType, payload }) => {
  let url = `/campaign/file/upload?entityId=${entityId}&entityType=${entityType}&moduleType=${moduleType}`;
  if (parentEntityId) {
    url = `/campaign/file/upload?entityId=${entityId}&parentEntityId=${parentEntityId}&entityType=${entityType}&moduleType=${moduleType}`;
  }
  const { data } = await http.post(url, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

/**
 * Uploads files for additional information required in a campaign.
 *
 * @param {string} entityId - The campaign entity ID.
 * @param {Array} payload - The file data to upload.
 * @returns {Promise<Object>} - The response containing the uploaded file data.
 */
export const uploadNeedMoreInfoFiles = async (entityId, payload) => {
  const formData = new FormData();
  formData.append('file', payload[0]);
  const { data } = await http.post(`/campaign/approval/upload-need-info?entityId=${entityId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

/**
 * Uploads files for additional information required in a campaign.
 *
 * @param {string} entityId - The campaign entity ID.
 * @param {Array} payload - The file data to upload.
 * @returns {Promise<Object>} - The response containing the uploaded file data.
 */
export const uploadNeedMoreInfoFilesForAssement = async (entityId, payload, type = 'assessment') => {
  const formData = new FormData();
  formData.append('file', payload[0]);
  const { data } = await http.post(`/campaign/donor/upload-need-info?id=${entityId}&type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// Email Templates

/**
 * Prepares a draft email for a given entity.
 *
 * @param {Object} params - The parameters for email draft.
 * @param {string} params.entityType - The type of the entity.
 * @param {string} params.entityId - The ID of the entity.
 * @returns {Promise<Object>} - The response containing the pre-draft email data.
 */
export const emailPreDraft = async ({ entityType, entityId }) => {
  const { data } = await http.post(
    `/campaign/email-detail/pre-draft-email?entityType=${entityType}&entityId=${entityId}`
  );
  return data?.data;
};

/**
 * Creates a new email template.
 *
 * @param {Object} payload - The data for the new email template.
 * @returns {Promise<Object>} - The response containing the created email template data.
 */
export const createEmailTemplate = async (payload) => {
  const { data } = await http.post(`/campaign/email-detail/create`, payload);
  return data;
};

// Media Management

/**
 * Downloads media content by its ID.
 *
 * @param {string} id - The ID of the media to download.
 * @returns {Promise<Object>} - The response containing the media data and headers.
 */
export const downloadMedia = async (id) => {
  const { data, headers } = await http.get(`/campaign/file/download/${id}`, {
    responseType: 'blob'
  });
  return {
    data,
    headers
  };
};

export const downloadAllDocuments = async (payload) => {
  const { data } = await http.post(`/campaign/file/url-by-ids`, payload);
  return data?.data || [];
};

/**
 * Deletes media content by its ID.
 *
 * @param {string} id - The ID of the media to delete.
 * @returns {Promise<Object>} - The response confirming the media deletion.
 */
export const deleteMedia = async (id) => {
  const { data } = await http.delete(`/campaign/file/delete/${id}`);
  return data;
};
export const deleteCampaignBanner = async (id) => {
  const { data } = await http.delete(`/campaign/delete-banner?entityId=${id}`);
  return data;
};

/**
 * Retrieves a list of media based on specific criteria.
 *
 * @param {Object} params - The parameters to filter the media list.
 * @param {string} params.type - The type of media to retrieve.
 * @param {Array} params.moduleList - The list of modules to filter media by.
 * @param {string} params.id - The entity ID to filter media by.
 * @returns {Promise<Object>} - The response containing the media list.
 */
export const getMediaList = async ({ type, moduleList, id }) => {
  const params = new URLSearchParams();
  moduleList.forEach((module) => params.append('moduleList', module));
  const { data } = await http.get(`/campaign/file/list/${type}/${id}?${params.toString()}`);
  return data?.data;
};

// Master Data

/**
 * Fetches the master data based on given types.
 *
 * @param {Object} payload - The parameters to fetch master data.
 * @returns {Promise<Object>} - The response containing the fetched master data.
 */
export const masterDataFetch = async (payload) => {
  const { data } = await http.post(`/campaign/master/types/fetch-all`, payload);
  return data?.data;
};

// Location Data

/**
 * Retrieves a list of states for a given country.
 *
 * @param {string} countryCode - The code of the country to fetch states for.
 * @returns {Promise<Object>} - The response containing the states for the country.
 */
export const getStates = async (countryCode) => {
  const { data } = await http.get(`/campaign/csc/states/${countryCode}`);
  return data?.data;
};

/**
 * Retrieves a list of countries.
 *
 * @returns {Promise<Object>} - The response containing the list of countries.
 */
export const getCountry = async () => {
  const { data } = await http.get(`/campaign/csc/countries`);
  return data?.data;
};

/**
 * Retrieves a list of cities for a given country and state.
 *
 * @param {string} countryCode - The code of the country.
 * @param {string} stateCode - The code of the state.
 * @returns {Promise<Object>} - The response containing the cities for the country and state.
 */
export const getCities = async (countryCode, stateCode) => {
  const { data } = await http.get(`/campaign/csc/cities/state/${countryCode}/${stateCode}`);
  return data?.data;
};

// Email Template Management

/**
 * Deletes an email template based on its ID and associated entity details.
 *
 * @param {Object} params - The parameters for deleting the email template.
 * @param {string} params.id - The ID of the email template to delete.
 * @param {string} params.entityType - The type of the entity the template belongs to.
 * @param {string} params.entityId - The ID of the entity the template belongs to.
 * @returns {Promise<Object>} - The response confirming the email template deletion.
 */
export const deleteEmailTemplate = async ({ id, entityType, entityId }) => {
  const { data } = await http.post(
    `/campaign/email-detail/delete/type-wise?id=${id}&entityType=${entityType}&entityId=${entityId}`
  );
  return data;
};

// Campaign Report

/**
 * Deletes a project analysis report based on its type and ID.
 *
 * @param {Object} params - The parameters for deleting the project analysis report.
 * @param {string} params.type - The type of the report to delete.
 * @param {string} params.id - The ID of the report to delete.
 * @returns {Promise<Object>} - The response confirming the report deletion.
 */
export const deleteProjectAnalysisReport = async ({ type, id }) => {
  const { data } = await http.delete(`/campaign/postanalysis/${type}/${id}`);
  return data;
};

// Donor module APIs

// Donor admin APIs
// Donor Pagination

/**
 * Retrieves a paginated list of donors based on the specified parameters.
 *
 * @param {Object} params - The parameters for pagination.
 * @param {string} [params.type='admin'] - The type of user making the request (default is 'admin').
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.rows - The number of rows per page.
 * @param {string} params.sort - The sorting criteria for the list.
 * @param {Object} params.payload - The additional filters or conditions for the request.
 * @returns {Promise<Object>} - The response containing the paginated donor data.
 */

export const donorPagination = async ({ type = 'admin', page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/campaign/donor/${type}/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

// Donor Admin Data

/**
 * Retrieves detailed information about a specific donor for the admin.
 *
 * @param {string} id - The ID of the donor.
 * @returns {Promise<Object>} - The response containing the donor data.
 */
export const getDonorAdminData = async (id) => {
  const { data } = await http.get(`/campaign/donor/admin/${id}`);
  return data?.data;
};

// Donation Rejection and Approval

/**
 * Rejects or approves a donation based on the provided status and donor ID.
 *
 * @param {Object} params - The parameters for donation rejection/approval.
 * @param {string} params.type - The type of action (e.g., 'reject', 'approve').
 * @param {string} params.id - The ID of the donor.
 * @param {Object} [params.payload={}] - The payload containing additional data (optional).
 * @returns {Promise<Object>} - The response confirming the donation status change.
 */
export const donationRejectApproval = async ({ type, id, payload = {} }) => {
  const { data } = await http.put(`/campaign/donor/admin/${id}/${type}`, payload);
  return data;
};

export const donationStatusUpdate = async ({ id, payload = {} }) => {
  const { data } = await http.put(`/campaign/donor/admin/${id}/status-update`, payload);
  return data;
};

// Assign Donor by Admin

/**
 * Assigns a donor to an admin by slug.
 *
 * @param {string} slug - The slug for the donor to be assigned.
 * @returns {Promise<Object>} - The response confirming the donor assignment.
 */
export const assignDonorByAdmin = async ({ slug, payload, type = 'admin' }) => {
  const { data } = await http.put(`/campaign/donor/${type}/${slug}/assign`, payload);
  return data;
};

// Admin Donor Assessment Form Submission

/**
 * Submits an assessment form for a donor by the admin.
 *
 * @param {Object} payload - The data for the assessment form submission.
 * @returns {Promise<Object>} - The response confirming the form submission.
 */
export const adminDonorSubmitAssessmentForm = async (payload) => {
  const { data } = await http.post(`/campaign/donor/admin/submit-assessment-form`, payload);
  return data;
};

export const adminAssessmentForm = async (payload) => {
  const { data } = await http.post(`/campaign/donor/admin/assessment-form`, payload);
  return data;
};

// Admin Donor Form Data Retrieval

/**
 * Retrieves the assessment form data for a specific donor by ID.
 *
 * @param {string} id - The ID of the donor.
 * @returns {Promise<Object>} - The response containing the donor's assessment form data.
 */
export const getAdminDonorFormData = async ({ type = 'admin', id }) => {
  const { data } = await http.get(`/campaign/donor/${type}/assessment-form/${id}`);
  return data?.data;
};

export const campaignDashboard = async (payload) => {
  const { data } = await http.post(`/campaign/dashboard/statistics`, payload);
  return data?.data;
};

/**
 * Fetches user data with pagination and filters.
 * @param {object} params - The pagination and filter parameters.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.rows - The number of rows per page.
 * @param {string} params.search - The search keyword for filtering users.
 * @param {string} params.role - The role of the user.
 * @param {string} params.status - The status of the user.
 * @param {string} params.fromDate - The start date for filtering users.
 * @param {string} params.toDate - The end date for filtering users.
 * @returns {Promise<object>} The response data containing the paginated users.
 */
export const exportUserByAdminsByAdmin = async ({
  page,
  rows,
  search,
  role,
  status,
  fromDate,
  toDate,
  isExtUser,
  isArchive
}) => {
  const response = await http.post(
    `/user/exportdata?page=${page}&size=${rows}&sort=firstName`,
    {
      page: page,
      size: rows,
      keyword: search,
      statuses: status,
      role: role,
      fromDate: fromDate,
      toDate: toDate,
      datePattern: getLocaleDateString(),
      isExtUser: isExtUser,
      isArchive: isArchive
    },
    { responseType: 'blob' }
  );

  // Extract filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
    : `Users_${new Date().toISOString()}.xlsx`;

  // Create a Blob from the response
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // Trigger file download
  saveAs(blob, filename);

  return {
    message: 'Data exporeted successfully'
  };
};
/**
 * Exports campaign data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.page - The page number.
 * @param {number} params.rows - Number of rows per page.
 * @param {string} params.sort - Sorting field.
 * @param {string} params.type - Campaign type (e.g., "FUNDCAMP|CHARITY").
 * @param {string} params.search - Search keyword.
 * @param {number} params.curentUserId - Current user ID.
 * @param {string} params.status - Campaign status.
 * @param {string} params.fromDate - Start date for filtering.
 * @param {string} params.toDate - End date for filtering.
 */
export const exportCampaignByAdminsByAdmin = async ({ page, rows, sort, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/exportdata?page=${page}&size=${rows}&sort=${sort || 'campaignTitle'}`,
      {
        // page,
        // size: rows,
        keyword: search,
        campaignType: type,
        // isOwnOnly: false,
        // curentUserId,
        datePattern: getLocaleDateString(),
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${type}_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

export const exportRolesByAdminsByAdmin = async ({ page, rows, isArchive, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/user/role/exportdata?page=${page}&size=${rows}&sort=name`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        createdDate: {
          fromDate: fromDate,
          toDate: toDate
        },
        datePattern: getLocaleDateString(),
        isArchive: isArchive
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Roles_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.page - The page number.
 * @param {number} params.rows - Number of rows per page.
 * @param {string} params.sort - Sorting field.
 * @param {string} params.type - Campaign type (e.g., "FUNDCAMP|CHARITY").
 * @param {string} params.search - Search keyword.
 * @param {number} params.curentUserId - Current user ID.
 * @param {string} params.status - Campaign status.
 * @param {string} params.fromDate - Start date for filtering.
 * @param {string} params.toDate - End date for filtering.
 */
export const exportCampaignApprovalByAdminsByAdmin = async ({
  page,
  rows,
  sort,
  type,
  search,
  curentUserId,
  status,
  fromDate,
  toDate
}) => {
  try {
    const response = await http.post(
      `/campaign/approval/exportdata?page=${page}&size=${rows}&sort=${sort || 'campaignTitle'}`,
      {
        page,
        size: rows,
        keyword: search,
        campaignType: type,
        isOwnOnly: false,
        curentUserId,
        datePattern: getLocaleDateString(),
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${type}_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.page - The page number.
 * @param {number} params.rows - Number of rows per page.
 * @param {string} params.sort - Sorting field.
 * @param {string} params.type - Campaign type (e.g., "FUNDCAMP|CHARITY").
 * @param {string} params.search - Search keyword.
 * @param {number} params.curentUserId - Current user ID.
 * @param {string} params.status - Campaign status.
 * @param {string} params.fromDate - Start date for filtering.
 * @param {string} params.toDate - End date for filtering.
 */
export const exportCampaignApprovalBySupervisor = async ({
  page,
  rows,
  sort,
  type,
  search,
  status,
  fromDate,
  toDate
}) => {
  try {
    const response = await http.post(
      `/campaign/complete/exportdata?page=${page}&size=${rows}&sort=${sort || 'campaignTitle'}`,
      {
        keyword: search,
        campaignType: type,
        datePattern: getLocaleDateString(),
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${type}_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.search - Search keyword.
 * @param {string} params.userEmails - Campaign status.
 * @param {string} params.fromDate - Start date for filtering.
 * @param {string} params.toDate - End date for filtering.
 */
export const exportLoginAuditByAdmins = async ({ curentUserId }) => {
  try {
    const response = await http.post(
      `/user/login-audit/user/exportdata`,
      {
        id: curentUserId
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `User_Login_Audit_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param { Object } params - The parameters for the API request.
 * @param { string } params.search - Search keyword.
 * @param { string } params.status - Campaign status.
 * @param { string } params.fromDate - Start date for filtering.
 * @param { string } params.toDate - End date for filtering.
 */
export const exportDonorAdminAuditByAdmins = async ({ search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/donor/admin/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        datePattern: getLocaleDateString(),
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Donor_Admin_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param { Object } params - The parameters for the API request.
 * @param { string } params.search - Search keyword.
 * @param { string } params.status - Campaign status.
 * @param { string } params.fromDate - Start date for filtering.
 * @param { string } params.toDate - End date for filtering.
 */
export const exportDonorAssessmentAuditByAdmins = async ({ search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/donor/assessment/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        datePattern: getLocaleDateString(),
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Donor_Assessment_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param { Object } params - The parameters for the API request.
 * @param { string } params.search - Search keyword.
 * @param { string } params.status - Campaign status.
 * @param { string } params.fromDate - Start date for filtering.
 * @param { string } params.toDate - End date for filtering.
 */
export const exportDonorHodAuditByAdmins = async ({ search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/donor/hod/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        datePattern: getLocaleDateString(),
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Donor_Hod_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

export const uploadProfilePhoto = async ({ payload, entityId }) => {
  const { data } = await http.post(`/user/upload-user-profile?entityId=${entityId}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// Donor assessment team

export const getIdByAssessmentData = async (id) => {
  const { data } = await http.get(`/campaign/donor/assessment/assessment-form/${id}`);
  return data?.data;
};

export const needInfoAssessmentDonorByAdmin = async (payload) => {
  const { data } = await http.put(`/campaign/donor/assessment/${payload.slug}/more-info`, {
    approvalStatus: 'NEED_MORE_INFO',
    content: payload.content,
    fileId: payload?.fileId
  });
  return data;
};

export const donorAssessmentStatusChange = async (payload) => {
  const { data } = await http.put(`/campaign/donor/assessment/${payload.slug}/status-update`, {
    status: payload.status,
    content: payload.content
    // fileId: payload.fileId
  });
  return data;
};

export const donorAdminStatusChange = async (payload) => {
  const { data } = await http.put(`/campaign/donor/${payload?.type || 'admin'}/${payload.slug}/status-update`, {
    status: payload.status,
    content: payload.content
  });
  return data;
};

export const submitQuestionsAnswer = async (payload) => {
  const { data } = await http.post(`/campaign/donor/assessment/question-response`, payload);
  return data;
};

export const submitQuestionAnswer = async (payload) => {
  const { data } = await http.put(`/campaign/donor/assessment/question-response`, payload);
  return data;
};

export const suspendUser = async (payload) => {
  const { data } = await http.post(`/user/ext/suspend-user`, payload);
  return data;
};

export const deleteExternalUser = async (payload) => {
  const { data } = await http.delete(`/user/ext/delete-account`, { data: payload });
  return data;
};

export const restoreExternalUser = async (id) => {
  const { data } = await http.patch(`/user/ext/restore-user/${id}`);
  return data;
};

export const updateExternalUser = async ({ id, payload }) => {
  const { data } = await http.put(`/user/ext/update/${id}`, payload);
  return data;
};

export const rolePermissionList = async () => {
  const { data } = await http.get(`/user/module/permission-list`);
  return data?.data;
};

export const multiDistributionForSupervisor = async ({ id, payload, isType }) => {
  const url = isType ? '/campaign/complete/distributionvalue/master' : '/campaign/complete/distributionvalue';
  const { data } = await http.post(`${url}/${id}`, payload);
  return data;
};

export const updateInKindItemBySupervisor = async ({ id, payload }) => {
  const { data } = await http.post(`/campaign/complete/inkinditem/${id}`, payload);
  return data;
};

export const createInKindItemBySupervisor = async ({ id, payload }) => {
  const { data } = await http.post(`/campaign/complete/inkinditem/create/${id}`, payload);
  return data;
};

export const deleteInKindItemBySupervisor = async (id) => {
  const { data } = await http.delete(`/campaign/complete/inkinditem/${id}`);
  return data;
};

export const completeProjectBySupervisor = async (id) => {
  const { data } = await http.post(`/campaign/complete/${id?.slug}/complete`);
  return data;
};
export const updateActualSpendFundBySupervisor = async ({ payload, id }) => {
  const { data } = await http.post(`/campaign/complete/spentdetails/${id}`, payload);
  return data;
};
export const updateTargetsBySupervisor = async ({ payload, id }) => {
  const { data } = await http.post(`/campaign/complete/campaigntarget/${id}`, payload);
  return data;
};
export const updateTaskBySupervisor = async ({ payload, id }) => {
  const { data } = await http.post(`/campaign/complete/campaigntask/${id}`, payload);
  return data;
};

export const productImpactForManager = async ({ id, payload }) => {
  const { data } = await http.post(`/campaign/complete/distributionimpact/${id}`, payload);
  return data;
};
export const productImpactForSingleManager = async ({ id, payload }) => {
  const { data } = await http.post(`/campaign/complete/distributionimpact/master/${id}`, payload);
  return data;
};

/**
 * Exports campaign data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.page - The page number.
 * @param {number} params.rows - Number of rows per page.
 * @param {string} params.sort - Sorting field.
 * @param {string} params.type - Campaign type (e.g., "FUNDCAMP|CHARITY").
 * @param {string} params.search - Search keyword.
 * @param {number} params.curentUserId - Current user ID.
 * @param {string} params.status - Campaign status.
 * @param {string} params.fromDate - Start date for filtering.
 * @param {string} params.toDate - End date for filtering.
 */
export const exportCampaignDataAdmin = async ({ campaignId, fieldName }) => {
  try {
    const response = await http.post(
      `/campaign/exportFieldData`,
      {
        campaignId,
        fieldName
      },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${fieldName}_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

export const preDefinedefinedQuestions = async () => {
  const { data } = await http.get(`/campaign/questions/predefined-questions`);
  return data;
};

export const submitQuestions = async ({ payload }) => {
  const { data } = await http.post(`/campaign/donor/admin/questions`, payload);
  return data;
};
// On Site Donations API

/**
 * Retrieves a paginated list of on site donors based on the specified parameters.
 *
 * @param {Object} params - The parameters for pagination.
 * @param {string} [params.type='admin'] - The type of user making the request (default is 'admin').
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.rows - The number of rows per page.
 * @param {string} params.sort - The sorting criteria for the list.
 * @param {Object} params.payload - The additional filters or conditions for the request.
 * @returns {Promise<Object>} - The response containing the paginated donor data.
 */
export const onSpotDonorPagination = async ({ type = 'admin', page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/campaign/donor/${type}/on-spot-donation/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

/**
 * Retrieves detailed information about a specific donor for the admin.
 *
 * @param {string} id - The ID of the donor.
 * @returns {Promise<Object>} - The response containing the donor data.
 */
export const getOnSpotDonorData = async (id) => {
  const { data } = await http.get(`/campaign/donor/admin/on-spot-donation/get?pledgeId=${id}`);
  return data?.data;
};

/**
 * Adds a new on-spot-donor information by admin.
 * @param {object} payload - The data of the on-spot-donor to be added.
 * @returns {Promise<object>} The response data confirming the on-spot-donor creation.
 */
export const addOnSpotFormByAdmin = async (payload) => {
  const { data } = await http.post('/campaign/donor/admin/on-spot-donation/create', payload);
  return data;
};

/**
 * Updates an existing on-spot-donor information by admin.
 * @param {object} payload - The data of the on-spot-donor to be updated.
 * @returns {Promise<object>} The response data confirming the on-spot-donor update.
 */
export const updateOnSpotFormByAdmin = async (payload) => {
  const { data } = await http.put(
    '/campaign/donor/admin/on-spot-donation/update?pledgeId=' + payload.pledgeId,
    payload
  );
  return data;
};

/**
 * Updates an existing on-spot-donor information by admin.
 * @param {object} payload - The data of the on-spot-donor to be updated.
 * @returns {Promise<object>} The response data confirming the on-spot-donor update.
 */
export const resendDonationLink = async (id) => {
  const { data } = await http.get(`/campaign/donor/admin/on-spot-donation/resend-link?pledgeId=${id}`);
  return data;
};

/**
 * Fetches data of a specific user by their Email.
 * @param {string} id - The unique identifier of the user.
 * @returns {Promise<object>} The response data containing the user's information.
 */
export const fetchDonorByEmailId = async (email) => {
  const { data: response } = await http.get(`/user/fetchByEmailId/${email}`);
  return response;
};

/**
 * Create a new User user by their Email .
 * @param {string} id - The unique identifier of the user.
 * @returns {Promise<object>} The response data containing the user's information.
 */
export const createNewUser = async (email) => {
  const { data: response } = await http.post(`/user/onSpot/createUser/${email}`);
  return response;
};

/**
 * Fetch list of campign for event specific .
 * @returns {Promise<object>} The response data containing the user's information.
 */
export const getCampaignListing = async () => {
  const { data: response } = await http.get(`/campaign/on-spot-campaign-listing`);
  return response;
};

// Acceptance Letter API
export const acceptanceLetterCreate = async ({ id, payload }) => {
  const { data } = await http.put(`/campaign/donor/admin/${id}/letter`, payload);
  return data;
};

/**
 * Retrieves a list of media based on specific criteria.
 *
 * @param {Object} params - The parameters to filter the media list.
 * @param {string} params.type - The type of media to retrieve.
 * @param {Array} params.moduleList - Module media by.
 * @param {string} params.id - The entity ID to filter media by.
 * @returns {Promise<Object>} - The response containing the media list.
 */
export const getDonorMediaList = async ({ type, moduleList, id }) => {
  const { data } = await http.get(`/campaign/file/list/${type}/${id}?moduleList=${moduleList}`);
  return data?.data;
};

export const getLetterDefaultContent = async (type) => {
  const { data } = await http.get(`/campaign/donor/admin/define-template?letterType=${type}`);
  return data;
};
export const downloadLetterContent = async (letterId) => {
  const { data } = await http.get(`/campaign/donor/pledge/${letterId}/letter`, {
    responseType: 'blob'
  });
  return data;
};

// upload HOD Signature

export const uploadHodSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`/campaign/donor/agreement-sign?entityId=${entityId}&&type=hod`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteCampaignMedia = async (id) => {
  const { data } = await http.delete(`/campaign/file/delete/${id?.id}`);
  return data;
};

export const deleteDocumentMedia = async ({ userId, id }) => {
  const { data } = await http.delete(`/user/${userId}/document-detail-file?fileId=${id}`);
  return data;
};

/**
 * Exports onspot donation data and triggers file download.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {number} params.page - The page number.
 * @param {number} params.rows - Number of rows per page.
 * @param {string} params.sort - Sorting field.
 * @param {string} params.payload - conatins request body parameters.
 */
export const exportOnSpotDonation = async ({ page, rows, sort, payload }) => {
  try {
    const response = await http.post(
      `/campaign/donor/admin/on-spot-donation/exportData?page=${page}&size=${rows}&sort=${sort}`,
      payload,
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `OnSiteDonation_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

export const donationIcadApproval = async ({ id, payload }) => {
  const { data } = await http.put(`/campaign/donor/admin/${id}/iacad-approval`, payload);
  return data;
};

export const getDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/campaign/${entityId}/documents`);
  return data?.data;
};

export const uploadNewDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/campaign/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteUploadedDocument = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/campaign/${targetEntityId}/documents/${documentId}`);
  return data;
};

export const createNewPledge = async (payload) => {
  const { data } = await http.post('/user/donor/create', payload);
  return data;
};

export const addPledgeFormByAdmin = async (payload) => {
  const { data } = await http.post('/campaign/donor/admin/create-pledge', payload);
  return data;
};

export const getSettingsModules = async () => {
  const { data } = await http.get('/campaign/master/modules');
  return data;
};

export const getModuleLabelTypes = async (moduleCode) => {
  const { data } = await http.get(`/campaign/master/${moduleCode}/label-type-list`);
  return data;
};

export const fetchDropdownOptions = async (typeLabel) => {
  const { data } = await http.get(`campaign/master/types/fetch/${typeLabel}`);
  return data;
};

export const updateDropdownValue = async (payload) => {
  const { data } = await http.post(`/campaign/master/values/createUpdate`, payload);
  return data;
};

export const addDropdownValue = async (payload) => {
  const { data } = await http.post(`/campaign/master/value/create-new`, payload);
  return data;
};

export const getDonorContentList = async (moduleCode) => {
  const { data } = await http.get(`campaign/metadata-content/pagination?keyword=${moduleCode}`);
  return data;
};

export const updateDonorContent = async ({ templateCode, content, title }) => {
  const { data } = await http.patch(`/campaign/metadata-content/${templateCode}/update`, {
    title,
    content
  });
  return data;
};

export const getDonorContentByTemplateCode = async (templateCode) => {
  const { data } = await http.get(`campaign/metadata-content/${templateCode}`);
  return data.data;
};

// Grant pick

export const assignGrantRequestByAdmin = async ({ slug, payload }) => {
  const { data } = await http.put(`/grant/manage/${slug}/assign`, payload);
  return data;
};
export const assignGrantRequestByAdminManager = async ({ slug, payload }) => {
  const { data } = await http.put(`/grant/manage/${slug}/admin-assign`, payload);
  return data;
};

export const getReportModuleList = async () => {
  const { data } = await http.get(`/campaign/master/report-modules`);
  return data.data;
};

export const updateReportModule = async (payload) => {
  const { data } = await http.post(`/campaign/master/report-modules/update`, payload);
  return data;
};

export const addReportModule = async (payload) => {
  const { data } = await http.post(`/campaign/master/report-modules/update`, payload);
  return data;
};

export const updateReportModuleStatus = async ({ id, status }) => {
  const { data } = await http.post(`/campaign/master/report-modules/${id}/status?status=${status}`);
  return data;
};

// In-Kind Contribution Requests APIs

/**
 * Retrieves a paginated list of in-kind contribution requests.
 *
 * @param {Object} params - The parameters for pagination.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.rows - The number of rows per page.
 * @param {string} params.sort - The sorting criteria for the list.
 * @param {Object} params.payload - The additional filters or conditions for the request.
 * @returns {Promise<Object>} - The response containing the paginated contribution data.
 */
export const inKindContributionPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/finance/contribution/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

/**
 * Exports in-kind contribution requests data and triggers file download.
 *
 * @param {Object} payload - The parameters for the API request.
 * @returns {Promise<Object>} - The response confirming the export.
 */
export const exportInKindContribution = async (payload) => {
  try {
    const response = await http.post(
      `/grant/finance/contribution/exportdata`,
      payload,
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `InKindContribution_${new Date().toISOString()}.xlsx`;

    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Trigger file download
    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting in-kind contributions:', error);
    throw error;
  }
};
/**
 * Retrieves a specific in-kind contribution request by ID.
 *
 * @param {string} id - The ID of the contribution request.
 * @returns {Promise<Object>} - The response containing the contribution data.
 */
export const getInKindContributionById = async (id) => {
  const { data } = await http.get(`/grant/finance/contribution/${id}`);
  return data?.data;
};