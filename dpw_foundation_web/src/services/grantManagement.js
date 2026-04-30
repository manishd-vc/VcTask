import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const intentGrantRequest = async () => {
  const { data } = await http.post(`/grant/create`, {});
  return data?.data;
};

export const fetchGrantRequestById = async (id) => {
  const { data } = await http.get(`/grant/${id}`);
  return data?.data;
};

export const updateGrantRequest = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/${id}/update`, payload);
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

export const uploadGrantDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const getGrants = async (page, search, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(`/grant/pagination?sort=updatedOn,DESC&page=${page - 1}&size=${size}`, {
    keyword: search,
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate,
      toDate: toDate
    },
    datePattern: getLocaleDateString(true)
  });
  return response;
};

export const exportGrant = async ({ page, rows, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/grant/exportdata?page=${page}&size=${rows}`,
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
      : `${type}_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
    throw error;
  }
};

export const uploadGrantSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`grant/manage/${entityId}/signature-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const submitSeekerRequest = async ({ entityId }) => {
  const { data } = await http.post(`grant/${entityId}/seeker-approval`, {});
  return data;
};

export const rejectGrantRequest = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/${entityId}/reject`, payload);
  return data;
};

export const deleteNeedMoreInfoDocuments = async ({ entityId, docType }) => {
  const { data } = await http.delete(`/grant/manage/${entityId}/delete-need-info?type=${docType}`);
  return data;
};

export const uploadNeedMoreInfoDocuments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/manage/${entityId}/upload-need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const grantCommonStatusUpdate = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/manage/${id}/status-update`, payload);
  return data;
};

export const downloadGrantAcceptanceLetter = async (id) => {
  const { data } = await http.get(`/grant/${id}/letter`, {
    responseType: 'blob'
  });
  return data;
};
