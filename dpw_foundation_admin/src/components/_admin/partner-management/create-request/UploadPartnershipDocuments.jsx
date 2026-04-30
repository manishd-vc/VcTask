import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import UploadDocumentsRow from 'src/components/table/rows/uploadDocumentsRow';
import * as partnershipApi from 'src/services/partner';

export default function UploadPartnershipDocuments() {
  const params = useParams();
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const { partnershipRequestData } = useSelector((state) => state?.partner);
  const handleCloseUploadDocuments = () => {
    setAddDocumentOpen(false);
    refetchDocumentsList();
  };

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(
    ['getPartnershipDocumentsList', params?.id],
    () => partnershipApi.getPartnershipDocumentsList({ entityId: params?.id }, { enabled: !!params?.id })
  );
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={3}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Supporting Docs
        </Typography>
        <Button variant="contained" color="primary" size="small" onClick={() => setAddDocumentOpen(true)}>
          Add Documents
        </Button>
      </Box>
      <UploadDocumentsRow
        rowData={documentsList}
        targetEntityId={partnershipRequestData?.id}
        refetchDocumentsList={refetchDocumentsList}
        type="partnership"
      />
      {addDocumentOpen && (
        <UploadDocuments
          open={addDocumentOpen}
          onClose={handleCloseUploadDocuments}
          targetEntityId={partnershipRequestData?.id}
          type="partnership"
        />
      )}
    </>
  );
}
