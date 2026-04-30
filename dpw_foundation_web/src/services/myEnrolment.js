import { saveAs } from 'file-saver';
import http from './http';

// 1. Enrollment Listing API with pagination
export const getEnrolments = async (page, search, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(`/campaign/enrollments/ext/pagination?page=${page - 1}&size=${size}`, {
    keyword: search || '',
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate || '',
      toDate: toDate || ''
    },
    datePattern: 'M/d/yyyy'
  });
  return response;
};

// 2. Export Enrollments API
export const exportEnrolments = async ({ search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/enrollments/ext/export`,
      {
        keyword: search || '',
        statuses: status ? [status] : [],
        createdDate: {
          fromDate: fromDate || '',
          toDate: toDate || ''
        },
        datePattern: 'M/d/yyyy'
      },
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `enrollments_${new Date().toISOString()}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return { message: 'Data exported successfully' };
  } catch (error) {
    console.error('Error exporting enrollments:', error);
    throw error;
  }
};

// 3. Get Enrollment Details by ID
export const getEnrollmentDetails = async (enrollmentId) => {
  const { data } = await http.get(`/campaign/enrollments/ext/${enrollmentId}/enrollment-details`);
  return data;
};

// 4. Add Log Activity Hours
export const addLogActivityHours = async (enrollmentId, payload) => {
  const requestPayload = {
    milestoneID: payload.milestoneID,
    checkInTime: payload.checkInTime,
    checkOutTime: payload.checkOutTime,
    logSource: payload.logSource || 'website'
  };

  const { data } = await http.post(`/campaign/enrollments/ext/${enrollmentId}/log-activity-hours`, requestPayload);
  return data;
};

// 5. Log Activity Hours Pagination with filters
export const getLogActivityHoursPagination = async (enrollmentId, payload) => {
  const requestPayload = {
    keyword: payload.keyword || '',
    createdDate: payload.createdDate || {},
    statuses: payload.statuses || [],
    datePattern: payload.datePattern || 'M/d/yyyy',
    page: payload.page || 0,
    pageSize: payload.pageSize || 10
  };

  const { data } = await http.post(
    `/campaign/enrollments/ext/${enrollmentId}/log-activity-hours/pagination`,
    requestPayload
  );
  return data;
};

// 6. Export Log Activity Hours
export const exportLogActivityHours = async (enrollmentId, payload = {}) => {
  try {
    const requestPayload = {
      keyword: payload.keyword || '',
      createdDate: payload.createdDate || {},
      statuses: payload.statuses || [],
      datePattern: payload.datePattern || 'M/d/yyyy'
    };

    const response = await http.post(
      `/campaign/enrollments/ext/${enrollmentId}/log-activity-hours/export`,
      requestPayload,
      { responseType: 'blob' }
    );
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `log_activity_hours_${new Date().toISOString()}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return { message: 'Data exported successfully' };
  } catch (error) {
    console.error('Error exporting log activity hours:', error);
    throw error;
  }
};

export const getStatistics = async (userId, enrollmentId, statisticsType) => {
  const { data } = await http.post('/campaign/enrollments/ext/statistics', {
    userId,
    enrollmentId,
    statisticsType
  });
  return data;
};

export const getEnrolmentById = async (id) => {
  return getEnrollmentDetails(id);
};
