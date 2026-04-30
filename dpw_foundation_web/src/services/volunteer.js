import http from './http';

export const createSkillCertification = async (payload) => {
  const { data } = await http.post('/campaign/enrollments/skill-certifications/create', payload);
  return data;
};

export const createSupportDocument = async (payload) => {
  const { data } = await http.post('/campaign/enrollments/volunteering-support-documents/create', payload);
  return data;
};

export const deleteSkillCertification = async (id) => {
  const { data } = await http.delete(`/campaign/enrollments/skill-certifications/${id}/delete`);
  return data;
};

export const deleteVolunteeringSupportDocument = async (id) => {
  const { data } = await http.delete(`/campaign/enrollments/volunteering-support-documents/${id}/delete`);
  return data;
};

export const deleteVolunteerSupportDocument = async (userId, documentId) => {
  const { data } = await http.delete(`/user/${userId}/volunteer-support-document/${documentId}`);
  return data;
};

export const deleteSkillCertificationDocument = async (userId, documentId) => {
  const { data } = await http.delete(`/user/${userId}/skill-certification-document/${documentId}`);
  return data;
};

export const getVolunteerReleaseTemplate = async () => {
  const { data } = await http.get('/campaign/metadata-content/volunteer_release_undertaking_template');
  return data;
};

export const createUpdateVolunteerEnrollment = async (payload) => {
  const { data } = await http.post('/campaign/enrollments/ext/create', payload);
  return data;
};

export const enrollVolunteer = async (volunteerCampaignId) => {
  const { data } = await http.get(`/campaign/enrollments/ext/enroll?volunteerCampaignId=${volunteerCampaignId}`);
  return data;
};

export const volunteerManagement = async (payload) => {
  const { data } = await http.post('/volunteer-management', payload);
  return data;
};

export const getEnrollmentDetails = async (enrollmentId) => {
  const { data } = await http.get(`/campaign/enrollments/ext/${enrollmentId}/enrollment-details`);
  return data;
};
