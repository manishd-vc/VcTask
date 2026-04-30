import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

export const getAllReports = async ({
  userId,
  page = 0,
  size = 10,
  sort = '',
  moduleId,
  keyword = '',
  fromDate = '',
  toDate = ''
}) => {
  const payload = {
    keyword,
    moduleId,
    createdDate: {
      fromDate,
      toDate
    },
    datePattern: getLocaleDateString()
  };

  const response = await http.post(
    `/grant/reports/manage/pagination?userId=${userId}&page=${page}&size=${size}&sort=${sort}`,
    payload
  );
  return response.data;
};

export const getModules = async () => {
  const response = await http.get(`/grant/reports/manage/modules`);
  return response.data.data || [];
};

export const getModuleColumns = async (moduleId) => {
  const response = await http.get(`/grant/reports/manage/moduleColumns?moduleId=${moduleId}`);
  return response.data.data || [];
};

export const executeQuery = async (entityType, payload) => {
  const response = await http.post(`/grant/reports/manage/query/${entityType}`, payload);
  return response.data.data || {};
};

export const getAllReportFilter = async (userId) => {
  const response = await http.get(`/grant/reports/manage/getAllReportFilter?userId=${userId}`);
  return response.data.data;
};

export const saveReportQuery = async (reportName, moduleId, userId, payload) => {
  const response = await http.post(
    `/grant/reports/manage/ReportQuery/create?moduleId=${moduleId}&userId=${userId}&reportName=${reportName}`,
    payload
  );
  return response.data;
};

export const exportReportData = async (moduleId, reportName, payloadData, page = 0, size = 10) => {
  try {
    const payload = { ...payloadData, page, size };
    const response = await http.post(
      `/grant/reports/manage/configure/exportData?moduleId=${moduleId}&reportName=${encodeURIComponent(reportName)}`,
      payload,
      { responseType: 'blob' }
    );
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Dynamic_Report_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting report data:', error);
    throw error;
  }
};

export const getReportById = async (reportId) => {
  const response = await http.get(`/grant/reports/manage/${reportId}`);
  return response.data.data;
};

export const updateReportQuery = async (reportId, payload) => {
  const response = await http.post(`/grant/reports/manage/${reportId}/update`, payload);
  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await http.delete(`/grant/reports/manage/${reportId.slug}/delete`);
  return response.data;
};

export const exportAllReportData = async ({
  userId,
  moduleId,
  keyword = '',
  fromDate = '',
  toDate = '',
  page = 0,
  size = 1000
}) => {
  try {
    const payload = {
      keyword,
      moduleId,
      createdDate: {
        fromDate,
        toDate
      },
      datePattern: getLocaleDateString()
    };

    const response = await http.post(
      `/grant/reports/manage/exportData?userId=${userId}&page=${page}&size=${size}&sort=`,
      payload,
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Report_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exported successfully'
    };
  } catch (error) {
    console.error('Error exporting report data:', error);
    throw error;
  }
};
