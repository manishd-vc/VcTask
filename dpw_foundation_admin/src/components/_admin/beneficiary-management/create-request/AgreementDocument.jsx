'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import UploadDocumentsRow from 'src/components/table/rows/uploadDocumentsRow';
import * as beneficiaryApi from 'src/services/beneficiary';

export default function AgreementDocument() {
  const { id } = useParams();
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(
    ['getInKindBeneficiaryAgreementDocumentsList', id],
    () => beneficiaryApi.getInKindBeneficiaryAgreementDocumentsList({ entityId: id }, { enabled: !!id })
  );

  const handleCloseUploadDocuments = () => {
    setAddDocumentOpen(false);
    refetchDocumentsList();
  };
  return (
    <>
      <UploadDocumentsRow
        rowData={documentsList}
        targetEntityId={id}
        refetchDocumentsList={refetchDocumentsList}
        type={'inKindAgreement'}
      />
      {addDocumentOpen && (
        <UploadDocuments
          open={addDocumentOpen}
          onClose={handleCloseUploadDocuments}
          targetEntityId={id}
          type={'inKindAgreement'}
        />
      )}
    </>
  );
}
