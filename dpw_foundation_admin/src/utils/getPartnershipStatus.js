import { getLabelByCode } from './extractLabelByCode';

export const getPartnershipStatus = (masterData, status, feedbackStatus) => {
  const rejectedStatus = ['REJECTED_IACAD', 'REJECTED_DOC_REQUEST', 'REJECTED_PARTNER', 'REJECTED_PARTNERSHIP_REQUEST'];
  const isRejected = rejectedStatus.includes(status);
  if (isRejected) {
    return getLabelByCode(masterData, 'dpwf_partnership_status', status);
  }
  return (
    (feedbackStatus ? `${getLabelByCode(masterData, 'dpwf_partner_req_feedback_status_add', feedbackStatus)} -` : '') +
    ' ' +
    getLabelByCode(masterData, 'dpwf_partnership_status', status)
  );
};
