import { useQuery } from 'react-query';
import * as api from 'src/services';

export const useApproverOptions = (descriptionKey) => {
  return useQuery(['approver-options', descriptionKey], () => api.getRoleSuperVisorList(descriptionKey), {
    enabled: !!descriptionKey
  });
};
