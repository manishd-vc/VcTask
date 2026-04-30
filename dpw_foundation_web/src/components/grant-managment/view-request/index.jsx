'use client';
import { Box, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MoreInfo from 'src/components/_admin/my-donations/moreInfo';
import MediaPreview from 'src/components/_main/campaign/mediaPreview';
import GrantNeedMoreInfo from 'src/components/dialog/GrantNeedMoreInfo';
import DocumentPreview from 'src/components/DocumentPreview';
import { DownloadLetterIcon } from 'src/components/icons';
import { useAuthorizationRedirect } from 'src/hooks/useAuthorizationRedirect';
import { setToastMessage } from 'src/redux/slices/common';
import { setGrantRequestData } from 'src/redux/slices/grant';
import * as grantManagementApi from 'src/services/grantManagement';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import '../../joEditor.css';
import GrantRequestInformation from './grant-request-information';
import GrantSeekerInformation from './grant-seeker-information';
import PageHeader from './page-header';
import RequestDetails from './request-details';

export default function ViewRequest({ isSignDocument }) {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const { profileData } = useSelector((state) => state.profile);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const {
    documentType,
    letter,
    status,
    managerNotes,
    managerNeedInfoId,
    managerNeedInfoName,
    seekerSignPresignedUrl,
    adminSignPresignedUrl,
    feedbackStatus,
    documentApproverNotes,
    documentApproverNeedInfoId,
    documentApproverNeedInfoName,
    seekerSignId
  } = grantRequestData || {};
  const { masterData } = useSelector((state) => state?.common);

  useAuthorizationRedirect({
    condition: !profileData?.firstGrantAccepted,
    redirectTo: '/user/settings',
    deps: [profileData?.firstGrantAccepted]
  });

  const { isLoading, refetch } = useQuery(
    ['grantRequest', grantManagementApi.fetchGrantRequestById, id],
    () => grantManagementApi.fetchGrantRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setGrantRequestData(data));
      }
    }
  );

  const { mutate, isLoading: isUploading } = useMutation(grantManagementApi.uploadGrantSignature, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });
  const { mutate: submitSeekerRequest, isLoading: isSubmitting } = useMutation(grantManagementApi.submitSeekerRequest, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      router.push('/user/my-grants');
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

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
        a.download = 'letter.pdf'; // you can make this dynamic if needed
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

  const handleFileUploadChange = (event) => {
    const file = event?.target?.files[0];
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file);
      formData.append('type', 'GRANT-SEEKER');
    }
    mutate({ payload: formData, entityId: id });
  };

  const finalSubmit = () => {
    submitSeekerRequest({ entityId: id });
  };

  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  const onClickDownload = () => {
    downloadGrantAcceptanceLetter(id);
  };

  const showDocumentPreview = () => {
    if (isSignDocument && status === 'IN_PROGRESS_SEEKER') {
      return (
        <DocumentPreview
          content={letter}
          title={documentType === 'AGREEMENT' ? 'Agreement Letter' : 'Contribution Letter'}
          isUploadSignature
          buttonText={seekerSignPresignedUrl ? 'Update Signature' : 'Add Signature'}
          signatureText={'Grant Seeker Signature'}
          handleFileUploadChange={handleFileUploadChange}
          loading={isUploading}
          signatureUrl={seekerSignPresignedUrl}
          isDownloading={isDownloading}
          onClickDownload={onClickDownload}
        />
      );
    }
  };
  const onlyShowDocumentPreview = () => {
    if (!isSignDocument && seekerSignId && seekerSignId !== null) {
      return (
        <Box sx={{ bgcolor: 'white', p: 3, my: 3 }}>
          <Stack flexDirection={'row'} justifyContent="space-between" alignItems={'center'} mb={1}>
            <Typography variant="h6" color="primary.main" textTransform={'uppercase'} mb={3} component={'p'}>
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

  const showMoreInfo = status === 'FEEDBACK_REQUESTED_SEEKER';

  const needMoreInfoMessage = status === 'IN_PROGRESS_DOC_CREATION' ? documentApproverNotes : managerNotes;
  const needMoreAttachment = status === 'IN_PROGRESS_DOC_CREATION' ? documentApproverNeedInfoId : managerNeedInfoId;
  const needMoreFileName = status === 'IN_PROGRESS_DOC_CREATION' ? documentApproverNeedInfoName : managerNeedInfoName;
  const chipLabel =
    (feedbackStatus ? `${getLabelByCode(masterData, 'dpwf_grant_req_feedback_status_add', feedbackStatus)} -` : '') +
    ' ' +
    getLabelByCode(masterData, 'dpwf_grant_status', status);

  return (
    <>
      <PageHeader
        isSignDocument={isSignDocument}
        finalSubmit={finalSubmit}
        isSubmitting={isSubmitting}
        handleClickOpenMoreInfo={handleOpenNeedMoreInfo}
      />
      <Stack spacing={3} sx={{ mt: 3 }}>
        {showDocumentPreview()}
        <RequestDetails />
        {showMoreInfo && (
          <MoreInfo
            message={needMoreInfoMessage}
            attachment={needMoreAttachment}
            fileName={needMoreFileName}
            status={chipLabel}
          />
        )}
        <GrantSeekerInformation />
        <GrantRequestInformation documentsList={documentsList} />
        {onlyShowDocumentPreview()}
        {openNeedMoreInfo && (
          <GrantNeedMoreInfo
            open={openNeedMoreInfo}
            onClose={() => setOpenNeedMoreInfo(false)}
            stageType={stageType}
            data={grantRequestData}
            backTo={'/user/my-grants'}
          />
        )}
      </Stack>
    </>
  );
}
