import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import TextEditor from 'src/components/textEditor/textEditor';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

export default function CreatePartnerDocument({ latterValues, setLatterValues }) {
  const partnershipRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const { documentType } = partnershipRequestData || {};
  const { masterData } = useSelector((state) => state?.common);
  return (
    <TextEditor
      setLatterValues={setLatterValues}
      latterValues={latterValues}
      title={
        <Typography variant="subtitle3" color="text.black">
          {documentType
            ? `${getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType)} Letter`
            : 'Partnership / Agreement Letter'}
        </Typography>
      }
    />
  );
}
