import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const fetchGrantRequestById = async (id) => {
  const { data } = await http.get(`/grant/finance/grant/${id}`);
  return data?.data;
};

export const grantPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/finance/grant/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const getGrantDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/${entityId}/documents`);
  return data?.data;
};

export const deleteGrantDocuments = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/grant/${targetEntityId}/documents/${documentId}`);
  return data;
};
export const answerGrantAssessmentQuestions = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/manage/${id}/assessment`, payload);
  return data;
};

export const getGrantAssessmentQuestion = async (id) => {
  const { data } = await http.get(`/grant/manage/${id}/assessment`);
  return data?.data;
};

export const exportGrant = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/finance/grant/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        page: page,
        size: size,
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
      : `Finance_Grant_${new Date().toISOString()}.xlsx`;

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

export const downloadGrantAcceptanceLetter = async (id) => {
  const { data } = await http.get(`/grant/${id}/letter`, {
    responseType: 'blob'
  });
  return data;
};

export const getDefaultGrantLetterContent = async (type) => {
  const { data } = await http.get(`/campaign/metadata-content/${type}`);
  return data?.data;
};

export const fetchDonationRequestById = async (id) => {
  const { data } = await http.get(`/campaign/finance/donation/${id}`);
  return data?.data;
};

export const financeDonationPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(`/campaign/finance/pagination?page=${page}&size=${rows}&sort=${sort}`, payload);
  return data;
};

export const getInKindDocumentsByType = async ({ entityId, type }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents?type=${type}`);
  return data?.data;
};

export const exportFinanceDonation = async ({ page, rows, sort, payload }) => {
  try {
    const response = await http.post(
      `campaign/finance/exportdata`,
      {
        page: page,
        size: rows,
        sort: sort,
        ...payload
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
