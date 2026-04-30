import http from './http';

export const intentContributionRequest = async (payload) => {
  const { data } = await http.post(`/grant/contributions/ext/create`, payload);
  return data?.data;
};

export const fetchContributionRequestById = async (id) => {
  const { data } = await http.get(`/grant/contributions/ext/${id}`);
  return data?.data;
};

export const getInKindContributionDocumentsList = async ({ entityId }) => {
  const { data } = await http.get(`/grant/contributions/manage/${entityId}/documents`);
  return data?.data;
};

export const uploadInKindContributionDocuments = async ({ payload, entityId }) => {
  const { data } = await http.post(`/grant/contributions/manage/${entityId}/documents/create-update`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteInKindContributionDocuments = async ({ targetEntityId, documentId }) => {
  const { data } = await http.delete(`/grant/contributions/manage/${targetEntityId}/documents/${documentId}`);
  return data;
};

export const updateContributionRequest = async ({ id, payload }) => {
  const { data } = await http.put(`/grant/contributions/ext/${id}/update`, payload);
  return data;
};
