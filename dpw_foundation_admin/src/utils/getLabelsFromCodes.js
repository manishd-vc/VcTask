import { getLabelByCode } from './extractLabelByCode';

export const getLabelsFromCodes = (codeList, targetField, masterData) => {
  if (!codeList?.length) {
    return '-';
  }

  return codeList
    .map((list) => getLabelByCode(masterData, targetField, list.code))
    .filter(Boolean)
    .join(', ');
};
