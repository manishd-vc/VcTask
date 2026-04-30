import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

/**
 * Get paginated in-kind contribution requests
 * @param {Object} params - Pagination and filter parameters
 * @param {number} params.page - Page number (0-based)
 * @param {number} params.rows - Number of rows per page
 * @param {string} params.sort - Sort parameter
 * @param {Object} params.payload - Filter payload
 * @returns {Promise<Object>} Response data
 */
export const inKindContributionPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/contributions/ext/pagination?page=${page}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

/**
 * Export in-kind contribution data
 * @param {Object} params - Export parameters
 * @param {string} params.search - Search keyword
 * @param {string} params.status - Status filter
 * @param {string} params.fromDate - Start date
 * @param {string} params.toDate - End date
 * @param {number} params.page - Page number
 * @param {number} params.size - Page size
 * @returns {Promise<Object>} Export response
 */
export const exportInKindContribution = async ({ search, fromDate, status, toDate, page, size }) => {
  try {
    const response = await http.post(
      `/grant/contributions/ext/exportdata?page=${page}&size=${size}`,
      {
        keyword: search,
        datePattern: getLocaleDateString(),
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `in-kind-contributions_${new Date().toISOString()}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, filename);

    return {
      message: 'In-kind contribution data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting in-kind contributions:', error);
    throw error;
  }
};

/**
 * Get in-kind contribution request by ID
 * @param {string} id - Request ID
 * @returns {Promise<Object>} Request details
 */
export const getInKindContributionById = async (id) => {
  const { data } = await http.get(`/grant/contributions/ext/${id}`);
  return data;
};

/**
 * Create new in-kind contribution request
 * @param {Object} payload - Request data
 * @returns {Promise<Object>} Created request
 */
export const createInKindContribution = async (payload) => {
  const { data } = await http.post('/grant/contributions/ext/create', payload);
  return data;
};

/**
 * Update in-kind contribution request
 * @param {string} id - Request ID
 * @param {Object} payload - Updated request data
 * @returns {Promise<Object>} Updated request
 */
export const updateInKindContribution = async (id, payload) => {
  const { data } = await http.put(`/grant/contributions/ext/${id}/update`, payload);
  return data;
};

/**
 * Delete in-kind contribution request
 * @param {string} id - Request ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteInKindContribution = async (id) => {
  const { data } = await http.delete(`/grant/contributions/ext/${id}/delete`);
  return data;
};

/**
 * Update in-kind contribution request status
 * @param {string} id - Request ID
 * @param {Object} payload - Status update data
 * @returns {Promise<Object>} Update response
 */
export const updateInKindContributionStatus = async (id, payload) => {
  const { data } = await http.put(`/grant/contributions/ext/${id}/status-update`, payload);
  return data;
};

/**
 * Withdraw in-kind contribution request
 * @param {string} id - Request ID
 * @param {Object} payload - Withdrawal data
 * @returns {Promise<Object>} Withdrawal response
 */
export const withdrawInKindContribution = async (id, payload) => {
  const { data } = await http.post(`/grant/contributions/ext/${id}/withdraw`, payload);
  return data;
};

/**
 * Get all charitable projects with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Projects data
 */
export const getAllCharitableProjects = async ({ page, rows, search, status, fromDate, toDate }) => {
  const { data } = await http.post('/grant/beneficiary/ext/project-list/pagination', {
    keyword: search || '',
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate || '',
      toDate: toDate || ''
    },
    datePattern: getLocaleDateString()
  });
  return data;
};

/**
 * Export all charitable projects data
 * @param {Object} params - Export parameters
 * @returns {Promise<Object>} Export response
 */
export const exportAllCharitableProjects = async ({ search, status, fromDate, toDate, page, size }) => {
  try {
    const response = await http.post(
      '/grant/beneficiary/ext/project-list/exportdata',
      {
        keyword: search || '',
        statuses: status ? [status] : [],
        createdDate: {
          fromDate: fromDate || '',
          toDate: toDate || ''
        },
        datePattern: getLocaleDateString()
      },
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `all-projects_${new Date().toISOString()}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, filename);

    return {
      message: 'All projects data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting all projects:', error);
    throw error;
  }
};

export const getInKindDocumentsByType = async ({ entityId, type }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents?type=${type}`);
  return data?.data;
};

export const getAssociatedCampaigns = async (beneficiaryId) => {
  const { data } = await http.get(`/grant/contributions/ext/associated-campaigns/${beneficiaryId}`);
  return data?.data;
};
