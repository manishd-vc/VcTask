import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const createIntentVolunteerCampaign = async (payload) => {
  const { data } = await http.post(`/campaign/vol-campaigns`, payload);
  return data?.data;
};

export const uploadCampaignBannerVolunteer = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/banner`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteCampaignBannerVolunteer = async (entityId) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/banner`);
  return data;
};

export const getVolunteerOrganizationList = async () => {
  const { data } = await http.get(`/user/organization-names`);
  return data;
};

export const createPreDraftEmailerForVolunteers = async (entityId) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/pre-email`, {});
  return data;
};

export const addEmailerVolunteersBanner = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/email-banner`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteEmailerVolunteersBanner = async (entityId) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/email-banner`);
  return data;
};

export const addEmailerVolunteersAttachments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/email-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteEmailerVolunteersAttachments = async ({ entityId, fileId }) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/email-file?fileId=${fileId}`);
  return data;
};

export const createEmailerVolunteers = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/email`, payload);
  return data;
};

export const getEmailerVolunteers = async (entityId) => {
  const { data } = await http.get(`/campaign/vol-campaigns/${entityId}/email`);
  return data?.data || null;
};

export const updateVolunteerForm = async ({ entityId, payload }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${entityId}`, payload);
  return data;
};

export const getByIdVolunteerCampaign = async (entityId) => {
  const { data } = await http.get(`/campaign/vol-campaigns/${entityId}`);
  return data?.data;
};

export const fetchVolunteerCampaignById = async (id) => {
  const { data } = await http.get(`/campaign/vol-campaigns/${id}`);
  return data?.data;
};

export const getAllVolunteer = async ({ page, search, status, fromDate, toDate, rows }) => {
  const { data: response } = await http.post(
    `/campaign/enrollments/manage/volunteers/pagination?page=${page - 1}&size=${rows}`,
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

export const exportAllVolunteer = async ({ page, size, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/enrollments/manage/volunteers/exportdata?page=${page}&size=${size}`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting All Voluteer:', error);
  }
};

export const getVolunteerCampaigns = async ({ page, search, status, fromDate, toDate, rows }) => {
  const { data: response } = await http.post(`/campaign/vol-campaigns/pagination?page=${page - 1}&size=${rows}`, {
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

export const exportVolunteerCampaigns = async ({ page, size, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/vol-campaigns/exportdata?page=${page}&size=${size}`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting voluteer campaigns:', error);
  }
};

export const deleteVolunteerCampaignByAdmin = async (slug) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${slug?.slug}/delete`);
  return data;
};

export const defaultBannerVolunteer = async (entityId, bannerId) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/banner/from-id/${bannerId}`, {});
  return data?.data;
};

export const cancelVolunteerCampaign = async ({ entityId, payload }) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/cancel`, {
    data: payload
  });
  return data;
};
export const createVolunteerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/questions`, payload);
  return data;
};

export const getVolunteerAssessmentQuestions = async ({ entityId }) => {
  const { data } = await http.get(`/campaign/vol-campaigns/${entityId}/questions`);
  return data?.data;
};
export const getVolunteerAssessmentPredefinedQuestions = async ({ type }) => {
  const { data } = await http.get(`/campaign/questions/predefined-questions?type=${type}`);
  return data?.data;
};

export const uploadVolunteerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/assessment-file`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteVolunteerAssessmentQuestions = async ({ entityId, fileId }) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/delete-assessment-file?fileId=${fileId}`);
  return data;
};

export const answerVolunteerAssessmentQuestions = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/questions-responses`, payload);
  return data;
};

export const deleteEmailerVolunteers = async (entityId) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/email`);
  return data;
};

export const rejectVolunteerCampaign = async ({ entityId, payload }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${entityId}/reject`, payload);
  return data;
};

export const volunteerCommonStatusUpdate = async ({ id, payload }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${id}/status-update`, payload);
  return data;
};

export const exportVolunteerCampaignDataAdmin = async ({ campaignId, fieldName }) => {
  try {
    const response = await http.post(
      `/campaign/vol-campaigns/${campaignId}/export-field-data?fieldName=${fieldName}`,
      {
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

export const deleteNeedMoreInfoDocuments = async ({ entityId }) => {
  const { data } = await http.delete(`/campaign/vol-campaigns/${entityId}/need-info`);
  return data;
};

export const uploadNeedMoreInfoDocuments = async ({ entityId, payload }) => {
  const { data } = await http.post(`/campaign/vol-campaigns/${entityId}/need-info`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

// All Enrollments API

export const getAllVolunteerEnrollments = async ({ page, search, status, fromDate, toDate, rows }) => {
  const { data: response } = await http.post(`/campaign/enrollments/manage/pagination?page=${page - 1}&size=${rows}`, {
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

export const exportVolunteerEnrollments = async ({ page, size, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/enrollments/manage/exportdata`,
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
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting Voluteer Enrollments:', error);
  }
};

export const getVolunteerEnrollmentById = async (id) => {
  const { data } = await http.get(`/campaign/enrollments/manage/${id}`);
  return data?.data;
};

export const approveVolunteerEnrollment = async (payload) => {
  const { data } = await http.put(`/campaign/enrollments/manage/update-status`, payload);
  return data;
};

export const intentVolunteerEnrollment = async (payload) => {
  const { data } = await http.post(`/campaign/enrollments/manage/create`, payload);
  return data?.data;
};

export const getVolunteerEnrollmentCampaigns = async () => {
  const { data } = await http.get(`/campaign/vol-campaigns/list/volunteer-campaigns`);
  return data?.data;
};

export const getVolunteerEnrollmentCampaignById = async (id) => {
  const { data } = await http.get(`/campaign/vol-campaigns/${id}`);
  return data?.data;
};

export const deleteSkillCertification = async (id) => {
  const { data } = await http.delete(`/campaign/enrollments/skill-certifications/${id}/delete`);
  return data;
};

export const createSkillCertification = async (payload) => {
  const { data } = await http.post('/campaign/enrollments/skill-certifications/create', payload);
  return data;
};

export const createSupportDocument = async (payload) => {
  const { data } = await http.post('/campaign/enrollments/volunteering-support-documents/create', payload);
  return data;
};

export const deleteVolunteeringSupportDocument = async (id) => {
  const { data } = await http.delete(`/campaign/enrollments/volunteering-support-documents/${id}/delete`);
  return data;
};

export const createUpdateVolunteerEnrollment = async ({ payload }) => {
  const { data } = await http.post('/campaign/enrollments/manage/create', payload);
  return data;
};

export const deleteSkillCertificationDocument = async (userId, documentId) => {
  const { data } = await http.delete(`/user/${userId}/skill-certification-document/${documentId}`);
  return data;
};

export const deleteVolunteerSupportDocument = async (userId, documentId) => {
  const { data } = await http.delete(`/user/${userId}/volunteer-support-document/${documentId}`);
  return data;
};

export const getVolunteerReleaseTemplate = async () => {
  const { data } = await http.get('/campaign/metadata-content/volunteer_release_undertaking_template');
  return data;
};
export const updateVolunteerMilestone = async ({ entityId, milestoneId, payload }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${entityId}/milestones/${milestoneId}`, payload);
  return data;
};

export const updateVolunteerTask = async ({ entityId, taskId, payload }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${entityId}/task/${taskId}`, payload);
  return data;
};

export const volunteerCampaignComplete = async ({ id }) => {
  const { data } = await http.put(`/campaign/vol-campaigns/${id}/complete`);
  return data;
};

export const getVolunteerById = async (id) => {
  const { data } = await http.get(`/campaign/enrollments/manage/volunteer/${id}`);
  return data?.data;
};

export const getVolunteerWaiverTemplate = async () => {
  const { data } = await http.get('/campaign/metadata-content/volunteer_waiver_form_template');
  return data;
};
