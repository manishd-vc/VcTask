import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const intentPartnershipRequest = async (payload) => {
  const { data } = await http.post(`/grant/partnership/manage/create`, payload);
  return data?.data;
};

export const fetchPartnershipRequestById = async (id) => {
  const { data } = await http.get(`/grant/partnership/manage/${id}`);
  return data?.data;
};

export const updatePartnershipRequest = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${id}/update`, payload);
  return data;
};

export const getPartnershipDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/partnership/${entityId}/documents`);
  return data?.data;
};

export const uploadPartnershipDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/partnership/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deletePartnershipDocuments = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/grant/partnership/${targetEntityId}/documents/${documentId}`);
  return data;
};

export const createPartnerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/questions`, payload);
  return data;
};

export const getPartnerAssessmentQuestions = async ({ entityId }) => {
  const { data } = await http.get(`/grant/partnership/manage/${entityId}/questions`);
  return data?.data;
};
export const getPartnerAssessmentPredefinedQuestions = async () => {
  const { data } = await http.get(`/grant/partnership/manage/questions/predefined`);
  return data?.data;
};

export const uploadPartnerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/assessment-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deletePartnerAssessmentQuestions = async ({ entityId, fileId }) => {
  const { data } = await http.delete(`/grant/partnership/manage/${entityId}/delete-assessment-file?fileId=${fileId}`);
  return data;
};

export const answerPartnerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/questions-responses`, payload);
  return data;
};
export const partnershipPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/partnership/manage/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const rejectPartnershipRequest = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/reject`, payload);
  return data;
};

export const deletePartnerByAdmin = async (slug) => {
  const { data } = await http.delete(`/grant/partnership/manage/${slug?.slug}/delete`);
  return data;
};
export const getContactPersonList = async ({ partnerId }) => {
  const { data } = await http.post(
    `/grant/partnership/manage/${partnerId}/contact-detail/pagination?page=0&size=1000`,
    {}
  );
  return data?.data;
};

export const assignPartnershipRequestByAdmin = async ({ slug, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${slug}/admin-assign`, payload);
  return data;
};

export const createPartnershipDocument = async ({ entityId, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${entityId}/letter`, payload);
  return data;
};

export const downloadPartnershipAcceptanceLetter = async (entityId) => {
  const { data } = await http.get(`/grant/partnership/${entityId}/letter`, {
    responseType: 'blob'
  });
  return data;
};

export const uploadPartnershipSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/signature-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};
// Approval Process

export const partnerCommonStatusUpdate = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${id}/status-update`, payload);
  return data;
};

// Need More Info

export const uploadNeedMoreInfoDocuments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/upload-need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const uploadPartnerNeedMoreInfoDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/need-more-info-documents`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deletePartnerNeedMoreInfoDocuments = async ({ entityId, docType }) => {
  const { data } = await http.delete(
    `/grant/partnership/manage/${entityId}/need-more-info-documents?docType=${docType}`
  );
  return data;
};
export const deleteNeedMoreInfoDocuments = async ({ entityId, docType }) => {
  const { data } = await http.delete(`/grant/partnership/manage/${entityId}/delete-need-info?type=${docType}`);
  return data;
};
export const approvedPartnersPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/partnership/manage/partners/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const exportAllPartners = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/partnership/manage/partners/exportdata`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

export const exportPartners = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/partnership/manage/exportdata`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

// Get partner contact details with pagination
export const getPartnerContactDetails = async ({ partnerId, page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/partnership/manage/${partnerId}/contact-detail/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

// Export partner contact details
export const exportPartnerContacts = async ({ partnerId, search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/partnership/manage/${partnerId}/contacts/export`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
  }
};

// Add new partner contact
export const addUpdatePartnerContact = async ({ partnerId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${partnerId}/contact-detail/create-update`, payload);
  return data;
};

// Delete partner contact for GeneralDialog compatibility
export const deletePartnerContactByAdmin = async ({ slug, payload }) => {
  const { partnerId, contactId } = payload;
  const { data } = await http.delete(`/grant/partnership/manage/${partnerId}/contact-detail/${contactId}`);
  return data;
};

export const getPreviouslyProject = async ({ partnerId }) => {
  const { data } = await http.get(`/grant/partnership/manage/${partnerId}/previous-project-details`);
  return data?.data;
};

export const completeTerminatePartnership = async ({ entityId, payload }) => {
  const { data } = await http.put(`/grant/partnership/manage/${entityId}/assessment`, payload);
  return data;
};

export const partnerAssessmentQuestionCreate = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/${entityId}/assessment/questions`, payload);
  return data;
};

export const getPartnerAssessmentQuestionsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/partnership/manage/${entityId}/assessment/questions`);
  return data?.data;
};

export const getAllAssociatedProjects = async ({ payload }) => {
  const { data } = await http.post(`/grant/partnership/manage/projects`, payload);
  return data?.data;
};

export const addAssociateProjects = async (payload) => {
  const { data } = await http.post(`/grant/partnership/manage/update-associations`, payload);
  return data;
};

export const getAssociatedCampaigns = async (entityId) => {
  const { data } = await http.get(`/grant/partnership/manage/${entityId}/associated-campaigns`);
  return data?.data;
};

export const viewPartnershipResponse = async (entityId) => {
  const { data } = await http.get(`/grant/partnership/manage/${entityId}/assessment`);
  return data?.data;
};

export const getDefaultPartnerLetterContent = async (type) => {
  const { data } = await http.get(`/campaign/metadata-content/${type}`);
  return data?.data;
};

export const getPartnerReports = async (partnershipId, page = 0, size = 10) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/reports?page=${page}&size=${size}`);
  return data;
};
export const getPartnerReportDocuments = async (partnershipId, reportId) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/documents?type=REPORT&reportId=${reportId}`);
  return data?.data;
};
export const getPartnerReportById = async (partnershipId, reportId) => {
  const { data } = await http.get(`/grant/partnership/${partnershipId}/reports/${reportId}`);
  return data?.data;
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
