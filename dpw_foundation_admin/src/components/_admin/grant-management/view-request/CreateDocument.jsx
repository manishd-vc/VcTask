import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import TextEditor from 'src/components/textEditor/textEditor';

export default function CreateDocument({ latterValues, setLatterValues }) {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const { documentType } = grantRequestData || {};

  return (
    <TextEditor
      setLatterValues={setLatterValues}
      latterValues={latterValues}
      title={
        <Typography variant="subtitle3" color="text.black">
          {documentType === 'AGREEMENT' ? 'Draft Agreement Letter' : 'Draft Contribution Letter'}
        </Typography>
      }
    />
  );
}
