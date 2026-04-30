import { getLabelByCode } from './extractLabelByCode';

export const getGrantStatus = (masterData, status, feedbackStatus) => {
  const rejectedStatus = ['REJECTED_IACAD', 'REJECTED_DOC_REQUEST', 'REJECTED_SEEKER', 'REJECTED_GRANT_REQUEST'];
  const isRejected = rejectedStatus.includes(status);
  if (isRejected) {
    return getLabelByCode(masterData, 'dpwf_grant_status', status);
  }
  return (
    (feedbackStatus ? `${getLabelByCode(masterData, 'dpwf_grant_req_feedback_status_add', feedbackStatus)} -` : '') +
    ' ' +
    getLabelByCode(masterData, 'dpwf_grant_status', status)
  );
};
