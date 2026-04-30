import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const rejectPartnerRequest = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/${entityId}/reject`, payload);
  return data;
};

export const deleteNeedMoreInfoDocuments = async ({ entityId, docType }) => {
  const { data } = await http.delete(`/grant/partnership/manage/${entityId}/delete-need-info?type=${docType}`);
  return data;
};

export const uploadNeedMoreInfoDocuments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/upload-need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const partnershipCommonStatusUpdate = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${id}/status-update`, payload);
  return data;
};

export const getPreviouslyProject = async ({ partnerId }) => {
  const { data } = await http.get(`/grant/partnership/manage/${partnerId}/previous-project-details`);
  return data?.data;
};

export const fetchPartnerRequestById = async (id) => {
  const { data } = await http.get(`/grant/partnership/${id}`);
  return data?.data;
};

export const getPartnerDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/partnership/${entityId}/documents`);
  return data?.data;
};

export const downloadPartnerAcceptanceLetter = async (id) => {
  const { data } = await http.get(`/grant/partnership/${id}/letter`, {
    responseType: 'blob'
  });
  return data;
};

export const getPartnerReports = async (partnershipId, page = 0, size = 10) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/reports?page=${page}&size=${size}`);
  return data;
};

export const createPartnerReport = async ({ partnershipId, ...payload }) => {
  const { data } = await http.post(`/grant/partnership/${partnershipId}/reports/create-update`, payload);
  return data;
};

export const updatePartnerReport = async ({ partnershipId, ...payload }) => {
  const { data } = await http.post(`/grant/partnership/${partnershipId}/reports/create-update`, payload);
  return data;
};

export const getPartnerReportById = async (partnershipId, reportId) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/reports/${reportId}`);
  return data?.data;
};

export const uploadPartnerReportDocument = async ({ partnershipId, payload }) => {
  const { data } = await http.post(`/grant/partnership/${partnershipId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const getPartnerReportDocuments = async (partnershipId, reportId) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/documents?type=REPORT&reportId=${reportId}`);
  return data?.data;
};

export const deletePartnerReportDocuments = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/grant/partnership/${targetEntityId}/documents/${documentId}`);
  return data;
};

export const deletePartnerReport = async ({ partnershipId, reportId }) => {
  const { data } = await http.delete(`/grant/partnership/${partnershipId}/reports/${reportId}`);
  return data;
};

export const exportPartnerReports = async ({ partnershipId, type }) => {
  try {
    const response = await http.get(`/grant/partnership/${partnershipId}/reports/exportdata`, {
      responseType: 'blob'
    });
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${type}_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Reports exported successfully'
    };
  } catch (error) {
    console.error('Error exporting partner reports:', error);
    throw error;
  }
};

export const uploadPartnershipSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`grant/partnership/manage/${entityId}/signature-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const submitPartnerRequest = async ({ entityId }) => {
  const { data } = await http.post(`grant/partnership/${entityId}/partner-approval`, {});
  return data;
};

export const getPartners = async (page, search, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(
    `/grant/partnership/pagination?sort=updatedOn,DESC&page=${page - 1}&size=${size}`,
    {
      keyword: search,
      statuses: status ? [status] : [],
      createdDate: {
        fromDate: fromDate,
        toDate: toDate
      },
      datePattern: getLocaleDateString(true)
    }
  );
  return response;
};

export const exportPartner = async ({ sort, page, rows, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `grant/partnership/exportdata?page=${page}&size=${rows}0&sort=${sort}`,
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
