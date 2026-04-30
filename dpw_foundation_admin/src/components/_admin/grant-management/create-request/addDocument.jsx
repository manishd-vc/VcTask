import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import UploadDocumentsRow from 'src/components/table/rows/uploadDocumentsRow';

export default function AddDocument({ refetch, documentsList = [], type }) {
  const { id } = useParams();
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const handleCloseUploadDocuments = () => {
    setAddDocumentOpen(false);
    refetch();
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography
          variant="subtitle6"
          component="h4"
          textTransform={'uppercase'}
          color="primary.main"
          sx={{ pt: 3, pb: 2 }}
        >
          Document Upload in Support of Request
        </Typography>
        <Button variant="contained" color="primary" size="small" onClick={() => setAddDocumentOpen(true)}>
          Add Documents *
        </Button>
      </Box>
      <UploadDocumentsRow rowData={documentsList} targetEntityId={id} refetchDocumentsList={refetch} type={type} />
      {addDocumentOpen && (
        <UploadDocuments open={addDocumentOpen} onClose={handleCloseUploadDocuments} targetEntityId={id} type={type} />
      )}
    </>
  );
}
