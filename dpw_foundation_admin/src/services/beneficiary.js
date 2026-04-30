import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const inKindContributionPagination = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/contributions/manage/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const exportInKindContribution = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/contributions/manage/exportdata`,
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

export const intentInKindContributionRequest = async (payload) => {
  const { data } = await http.post(`/grant/contributions/manage/create`, payload);
  return data?.data;
};

export const getInKindContributionRequestById = async (id) => {
  const { data } = await http.get(`/grant/contributions/manage/${id}`);
  return data?.data;
};

export const updateInKindContributionRequest = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/contributions/manage/${id}/update`, payload);
  return data;
};

export const uploadInKindBeneficiaryDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const getInKindBeneficiaryDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents`);
  return data?.data;
};
export const getInKindBeneficiaryAgreementDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents?type=AGREEMENT`);
  return data?.data;
};

export const deleteInKindBeneficiaryDocuments = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/grant/contributions/manage/${targetEntityId}/documents/${documentId}`);
  return data;
};

export const getAllCharitableProjects = async ({ page, search, status, fromDate, toDate, rows }) => {
  const { data: response } = await http.post(
    `/campaign/manage/charitable-projects/pagination?page=${page - 1}&size=${rows}`,
    {
      keyword: search,
      statuses: status ? [status] : [],
      createdDate: {
        fromDate: fromDate,
        toDate: toDate
      },
      datePattern: getLocaleDateString()
    }
  );
  return response;
};

export const exportAllCharitableProjects = async ({ page, size, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/manage/export-charitable-project-data?page=${page}&size=${size}`,
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
      : `CHARITABLE_PROJECTS_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting All Voluteer:', error);
  }
};

export const getInKindAssessmentQuestionsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/questions`);
  return data?.data;
};

export const createInKindAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/questions`, payload);
  return data;
};
export const uploadInKindAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/assessment-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteInKindAssessmentQuestions = async ({ entityId, fileId }) => {
  const { data } = await http.delete(`/grant/contributions/manage/${entityId}/delete-assessment-file?fileId=${fileId}`);
  return data;
};

export const answerInKindAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/questions-responses`, payload);
  return data;
};

export const deleteInKindContributionRequestByManager = async (slug) => {
  const { data } = await http.delete(`/grant/contributions/manage/${slug?.slug}/delete`);
  return data;
};

export const getInKindDocumentsByType = async ({ entityId, type }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents?type=${type}`);
  return data?.data;
};

export const uploadInKindNeedMoreInfo = async ({ entityId, payload }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/upload-need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteInKindNeedMoreInfo = async ({ entityId, type }) => {
  const { data } = await http.delete(`/grant/contributions/manage/${entityId}/delete-need-info?type=${type}`);
  return data;
};

export const getBeneficiaryInKindContributions = async ({ beneficiaryId, page, pageSize, payload }) => {
  const { data } = await http.post(
    `/grant/beneficiary/manage/contribution/${beneficiaryId}/in-kind/pagination?page=${page}&size=${pageSize}`,
    payload
  );
  return data;
};

export const exportBeneficiaryInKindContributions = async ({
  beneficiaryId,
  search,
  status,
  fromDate,
  toDate,
  page,
  pageSize
}) => {
  try {
    const response = await http.post(
      `/grant/beneficiary/manage/contribution/${beneficiaryId}/in-kind/exportdata`,
      {
        keyword: search || '',
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        },
        datePattern: getLocaleDateString(),
        page: page || 0,
        pageSize: pageSize || 200
      },
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `InKind_Contributions_${new Date().toISOString()}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting in-kind contributions:', error);
    throw error;
  }
};

export const updateInKindContributionStatus = async ({ entityId, payload }) => {
  const { data } = await http.put(`/grant/contributions/manage/${entityId}/status-update`, payload);
  return data;
};

export const rejectInKindContributionRequest = async ({ entityId, payload }) => {
  const { data } = await http.put(`/grant/contributions/manage/${entityId}/reject`, payload);
  return data;
};

export const completeInKindContributionRequest = async (entityId, payload = { notes: 'cd' }) => {
  const { data } = await http.put(`/grant/contributions/manage/${entityId.slug}/complete`, payload);
  return data;
};

export const assignManagerToRequest = async ({ slug, payload }) => {
  const { data } = await http.put(`/grant/contributions/manage/${slug}/assign`, payload);
  return data;
};

export const assignStoreManagerToRequest = async ({ slug, payload }) => {
  const { data } = await http.put(`/grant/contributions/manage/${slug}/assign-store-manager`, payload);
  return data;
};

export const updateInKindItem = async ({ contributionId, itemId, payload }) => {
  const { data } = await http.put(
    `/grant/contributions/manage/${contributionId}/inkind-item/${itemId}/update`,
    payload
  );
  return data;
};

export const submitInKindContribution = async (contributionId) => {
  const { data } = await http.post(`/grant/contributions/manage/${contributionId}/submit-inkind`);
  return data;
};

// beneficiary's api
export const getAllBeneficiaries = async ({ page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/beneficiary/manage/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const exportAllBeneficiaries = async ({ search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/beneficiary/manage/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        page: page,
        pageSize: size,
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
      : `AllBeneficiaries_${new Date().toISOString()}.xlsx`;

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

export const createBeneficiaryByUserId = async (payload) => {
  const { data } = await http.post(`/grant/beneficiary/manage/create`, payload);
  return data;
};

export const getBeneficiaryRequestById = async ({ userId }) => {
  const { data } = await http.get(`/grant/beneficiary/manage/user-data/${userId}`);
  return data?.data;
};

export const getBeneficiaryDetails = async (beneficiaryUserId) => {
  const { data } = await http.get(`/grant/beneficiary/manage/${beneficiaryUserId}`);
  return data?.data;
};

export const getAssosciatedProjects = async (beneficiaryId) => {
  const { data } = await http.post(`/grant/beneficiary/manage/campaigns`, {
    beneficiaryId: beneficiaryId
  });
  return data?.data;
};

export const updateAssociatedProjects = async (payload) => {
  const { data } = await http.post(`/grant/beneficiary/manage/update-associations`, payload);
  return data;
};

export const beneficiaryGrantPagination = async ({ userId, page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/beneficiary/manage/grant/${userId}/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const exportAllGrantRequests = async ({ userId, search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/beneficiary/manage/grant/${userId}/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        page: page,
        pageSize: size,
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
      : `All_Beneficiary_Grant_Requests_${new Date().toISOString()}.xlsx`;

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

export const beneficiaryProjectPagination = async ({ beneficiaryId, page, rows, sort, payload }) => {
  const { data } = await http.post(
    `/grant/beneficiary/manage/project-list/${beneficiaryId}/pagination?page=${page - 1}&size=${rows}&sort=${sort}`,
    payload
  );
  return data;
};

export const exportAllProjects = async ({ beneficiaryId, search, status, fromDate, toDate, size, page }) => {
  try {
    const response = await http.post(
      `grant/beneficiary/manage/project-list/${beneficiaryId}/exportdata`,
      {
        keyword: search,
        statuses: status ? [status] : [],
        page: page,
        pageSize: size,
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
      : `All_Beneficiary_Projects_${new Date().toISOString()}.xlsx`;

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

export const getAssociatedCampaigns = async (beneficiaryId) => {
  const { data } = await http.get(`/grant/beneficiary/manage/associated-campaigns/${beneficiaryId}`);
  return data?.data;
};
