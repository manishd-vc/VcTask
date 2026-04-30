'use client';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MediaPreview from 'src/components/_admin/campaign/steps/emailCampaign/mediaPreview';
import GrantRequestInformation from 'src/components/_admin/grant-management/view-request/grant-request-information';
import GrantSeekerInformation from 'src/components/_admin/grant-management/view-request/grant-seeker-information';
import PageHeader from 'src/components/_admin/grant-management/view-request/page-header';
import RequestApproval from 'src/components/_admin/grant-management/view-request/request-approval';
import RequestDetails from 'src/components/_admin/grant-management/view-request/request-details';
import DocumentPreview from 'src/components/DocumentPreview';
import { DownloadLetterIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import { setGrantRequestData } from 'src/redux/slices/grant';
import * as financeApi from 'src/services/finance';
import * as grantManagementApi from 'src/services/grantManagement';

export default function ViewRequest({ isLetter = false, isSignDocument = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const [loadingType] = useState(null);
  const { documentType, letter, adminSignPresignedUrl, seekerSignPresignedUrl } = grantRequestData || {};

  const { isLoading, refetch } = useQuery(
    ['grantRequest', financeApi.fetchGrantRequestById, id],
    () => financeApi.fetchGrantRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setGrantRequestData(data));
      }
    }
  );

  const { data: documentsList } = useQuery(['getGrantDocumentsList', id], () =>
    grantManagementApi.getGrantDocumentsList({ entityId: id }, { enabled: !!id })
  );

  const { mutate: downloadGrantAcceptanceLetter, isLoading: isDownloading } = useMutation(
    grantManagementApi.downloadGrantAcceptanceLetter,
    {
      onSuccess: async (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'letter.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        dispatch(setToastMessage({ message: 'Download successful!', variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const onClickDownload = () => {
    downloadGrantAcceptanceLetter(id);
  };

  const showDocumentPreview = () => {
    if (isSignDocument) {
      return (
        <DocumentPreview
          content={letter}
          title={documentType === 'AGREEMENT' ? 'Agreement Letter' : 'Contribution Letter'}
          isUploadSignature
          buttonText={adminSignPresignedUrl ? 'Update Signature' : 'Add Signature'}
          signatureText={'HOD Signature'}
          handleFileUploadChange={handleFileUploadChange}
          loading={isUploading}
          signaturePreviewText={'Grant Seeker Signature'}
          signatureUrl={seekerSignPresignedUrl}
          lastApprovalSignatureUrl={adminSignPresignedUrl}
          isAdmin
          isDownloading={isDownloading}
          onClickDownload={onClickDownload}
        />
      );
    }
  };

  const renderLetter = () => {
    if (letter && !isLetter && !isSignDocument) {
      return (
        <Box sx={{ bgcolor: 'white', p: 3, my: 3 }}>
          <Stack flexDirection={'row'} justifyContent="space-between" alignItems={'center'} mb={1}>
            <Typography variant="h6" color="primary.main" textTransform={'uppercase'} mb={2} component={'p'}>
              {documentType === 'AGREEMENT' ? 'Agreement Letter' : 'Contribution Letter'}
            </Typography>
            <Tooltip title="Download Document">
              <IconButton width={40} height={40} onClick={onClickDownload} disabled={isDownloading}>
                <DownloadLetterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box className="contentWrapper jodit-workplace" dangerouslySetInnerHTML={{ __html: letter }} />
          <Stack direction={{ xs: 'row' }} justifyContent={'space-between'} alignItems={'end'} sx={{ mt: 4 }}>
            <Box>
              {seekerSignPresignedUrl && (
                <>
                  <MediaPreview
                    src={seekerSignPresignedUrl}
                    width={120}
                    height={80}
                    layout="intrinsic"
                    isCloseIcon={false}
                  />

                  <Typography variant="subtitle4" component={'p'} sx={{ my: 2 }} color="text.secondarydark">
                    Grant Seeker Signature
                  </Typography>
                </>
              )}
            </Box>
            <Box>
              {adminSignPresignedUrl && (
                <>
                  <MediaPreview
                    src={adminSignPresignedUrl}
                    width={120}
                    height={80}
                    layout="intrinsic"
                    isCloseIcon={false}
                  />
                  <Typography variant="subtitle4" component={'p'} sx={{ my: 2 }} color="text.secondarydark">
                    HOD Signature
                  </Typography>
                </>
              )}
            </Box>
          </Stack>
        </Box>
      );
    }
  };

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <>
      <PageHeader refetch={refetch} isLoading={loadingType} isLetter={isLetter} />
      <Stack spacing={3}>
        {showDocumentPreview()}
        <RequestDetails />
        <GrantSeekerInformation />
        <GrantRequestInformation documentsList={documentsList} />
        <RequestApproval />
        {renderLetter()}
      </Stack>
    </>
  );
}
