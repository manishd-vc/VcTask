import { getLabelByCode } from './extractLabelByCode';

export const getBeneficiaryStatus = (masterData, status, feedbackStatus) => {
  if (feedbackStatus === 'FEEDBACK_REQUESTED' && status === 'REJECTED') {
    return getLabelByCode(masterData, 'dpwf_inkind_contribution_status', status);
  }
  if (feedbackStatus === 'FEEDBACK_REQUESTED') {
    return `${getLabelByCode(masterData, 'dpwf_inkind_contribution_status', feedbackStatus)} - ${getLabelByCode(masterData, 'dpwf_inkind_contribution_status', status)}`;
  }
  return getLabelByCode(masterData, 'dpwf_inkind_contribution_status', status);
};
