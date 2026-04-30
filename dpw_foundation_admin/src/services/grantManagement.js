import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const intentGrantRequest = async (payload) => {
  const { data } = await http.post(`/grant/manage/create`, payload);
  return data?.data;
};

export const fetchGrantRequestById = async (id) => {
  const { data } = await http.get(`/grant/manage/${id}`);
  return data?.data;
};

export const updateGrantRequest = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/manage/${id}/update`, payload);
  return data;
};

export const grantPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(`/grant/manage/pagination?page=${page - 1}&size=${rows}&sort=${sort}`, payload);
  return data;
};

export const getGrantDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/${entityId}/documents`);
  return data?.data;
};

export const uploadGrantDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
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

export const deleteGrantByAdmin = async (slug) => {
  const { data } = await http.delete(`/grant/manage/${slug?.slug}/delete`);
  return data;
};

// Approval Process

export const grantCommonStatusUpdate = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/manage/${id}/status-update`, payload);
  return data;
};

// Need More Info

export const uploadNeedMoreInfoDocuments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/manage/${entityId}/upload-need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteNeedMoreInfoDocuments = async ({ entityId, docType }) => {
  const { data } = await http.delete(`/grant/manage/${entityId}/delete-need-info?type=${docType}`);
  return data;
};

// Document Create

export const createGrantDocument = async ({ entityId, payload }) => {
  const { data } = await http.put(`/grant/manage/${entityId}/letter`, payload);
  return data;
};

export const rejectGrantRequest = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/manage/${entityId}/reject`, payload);
  return data;
};

export const uploadGrantSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`grant/manage/${entityId}/signature-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const exportGrant = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/manage/exportdata`,
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
