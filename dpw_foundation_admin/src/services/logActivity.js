import http from './http';

export const getLogActivityHoursPagination = async (id, payload) => {
  const page = payload.page - 1 || 0;
  const size = payload.size || 10;
  const requestPayload = {
    keyword: payload.keyword || '',
    createdDate: payload.createdDate || {},
    statuses: payload.statuses || [],
    datePattern: payload.datePattern || 'M/d/yyyy'
  };

  const { data } = await http.post(
    `/campaign/enrollments/manage/${id}/log-hours/pagination?page=${page}&size=${size}`,
    requestPayload
  );
  return data;
};

export const exportLogActivityHours = async ({ id, page, size, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/enrollments/manage/${id}/log-hours/export`,
      {
        keyword: search,
        datePattern: 'M/d/yyyy',
        // statuses: status ? [status] : [],
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
      : `LOG_ACTIVITY_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting log Activity Hours:', error);
  }
};

export const addLogActivityHours = async (enrolledId, payload) => {
  const requestPayload = {
    milestoneID: payload.milestoneID,
    checkInTime: payload.checkInTime,
    checkOutTime: payload.checkOutTime,
    logSource: payload.logSource || 'website'
  };

  const { data } = await http.post(`/campaign/enrollments/manage/${enrolledId}/log-hours`, requestPayload);
  return data;
};

export const approveLogActivity = async ({ enrolledId, logHourId, payload }) => {
  const { data } = await http.put(`/campaign/enrollments/manage/${enrolledId}/log-hours/${logHourId}/approve`, payload);
  return data;
};

export const rejectLogActivity = async ({ enrolledId, logHourId, payload }) => {
  const { data } = await http.put(`/campaign/enrollments/manage/${enrolledId}/log-hours/${logHourId}/reject`, payload);
  return data;
};
