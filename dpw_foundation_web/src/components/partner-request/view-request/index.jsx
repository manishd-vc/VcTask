'use client';
import { Box, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MoreInfo from 'src/components/_admin/my-donations/moreInfo';
import MediaPreview from 'src/components/_main/campaign/mediaPreview';
import PartnershipNeedMoreInfo from 'src/components/dialog/partnershipNeedMoreInfo';
import DocumentPreview from 'src/components/DocumentPreview';
import { DownloadLetterIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { setPartnerRequestData } from 'src/redux/slices/partner';
import * as partnerApi from 'src/services/partner';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import '../../joEditor.css';
import PageHeader from './page-header';
import PartnerInformation from './partner-information';
import PartnerRequestInformation from './partner-request-information';
import PartnerReportsView from './PartnerReportsView';
import RequestDetails from './request-details';
export default function ViewPartner({ isSignDocument }) {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const partnerRequestData = useSelector((state) => state?.partner?.partnerRequestData);
  const {
    documentType,
    letter,
    status,
    feedbackStatus,
    managerNotes,
    managerNeedInfoId,
    managerNeedInfoName,
    approverNotes,
    approverNeedInfoId,
    approverNeedInfoName,
    documentApproverNotes,
    documentApproverNeedInfoId,
    documentApproverNeedInfoName,
    partnerSignPresignedUrl,
    adminSignPresignedUrl,
    partnerSignId
  } = partnerRequestData || {};
  const { masterData } = useSelector((state) => state?.common);

  const { isLoading, refetch } = useQuery(
    ['partnerRequest', partnerApi.fetchPartnerRequestById, id],
    () => partnerApi.fetchPartnerRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setPartnerRequestData(data));
      }
    }
  );

  const { data: documentsList } = useQuery(['getPartnerDocumentsList', id], () =>
    partnerApi.getPartnerDocumentsList({ entityId: id }, { enabled: !!id })
  );

  const { mutate, isLoading: isUploading } = useMutation(partnerApi.uploadPartnershipSignature, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: submitPartnerRequest, isLoading: isSubmitting } = useMutation(partnerApi.submitPartnerRequest, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      router.push('/user/my-partnerships');
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: downloadPartnerAcceptanceLetter, isLoading: isDownloading } = useMutation(
    partnerApi.downloadPartnerAcceptanceLetter,
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
      formData.append('type', 'PARTNERSHIP-PARTNER');
    }
    mutate({ payload: formData, entityId: id });
  };

  const finalSubmit = () => {
    submitPartnerRequest({ entityId: id });
  };

  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  const onClickDownload = () => {
    downloadPartnerAcceptanceLetter(id);
  };

  const showDocumentPreview = () => {
    if (isSignDocument && status === 'IN_PROGRESS_PARTNER') {
      return (
        <DocumentPreview
          content={letter}
          title={
            documentType
              ? `${getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType)} Letter`
              : 'Partnership / Agreement Letter'
          }
          isUploadSignature
          buttonText={partnerSignPresignedUrl ? 'Update Signature' : 'Add Signature'}
          signatureText={'Partnership Signature'}
          handleFileUploadChange={handleFileUploadChange}
          loading={isUploading}
          signatureUrl={partnerSignPresignedUrl}
          isDownloading={isDownloading}
          onClickDownload={onClickDownload}
        />
      );
    }
  };

  const onlyShowDocumentPreview = () => {
    if (!isSignDocument && partnerSignId && partnerSignId !== null) {
      return (
        <Box sx={{ bgcolor: 'white', p: 3, my: 3 }}>
          <Stack flexDirection={'row'} justifyContent="space-between" alignItems={'center'} mb={1}>
            <Typography variant="h6" color="primary.main" textTransform={'uppercase'} mb={2} component={'p'}>
              {documentType
                ? `${getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType)} Letter`
                : 'Partnership / Agreement Letter'}
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
              {partnerSignPresignedUrl && (
                <>
                  <MediaPreview
                    src={partnerSignPresignedUrl}
                    width={120}
                    height={80}
                    layout="intrinsic"
                    isCloseIcon={false}
                  />
                  <Typography variant="subtitle4" component={'p'} sx={{ my: 2 }} color="text.secondarydark">
                    Partner Signature
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

  const showMoreInfo = feedbackStatus === 'FEEDBACK_REQUESTED';

  const needMoreInfoMessage = documentApproverNotes || approverNotes || managerNotes;
  const needMoreAttachment = documentApproverNeedInfoId || approverNeedInfoId || managerNeedInfoId;
  const needMoreFileName = documentApproverNeedInfoName || approverNeedInfoName || managerNeedInfoName;
  const chipLabel =
    (feedbackStatus ? `${getLabelByCode(masterData, 'dpwf_partner_req_feedback_status_add', feedbackStatus)} -` : '') +
    ' ' +
    getLabelByCode(masterData, 'dpwf_partnership_status', status);

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
        <PartnerInformation />
        <PartnerRequestInformation documentsList={documentsList} />
        <PartnerReportsView partnershipId={id} />
        {onlyShowDocumentPreview()}
        {openNeedMoreInfo && (
          <PartnershipNeedMoreInfo
            open={openNeedMoreInfo}
            onClose={() => setOpenNeedMoreInfo(false)}
            stageType={stageType}
            data={partnerRequestData}
            backTo={'/user/my-partnerships'}
          />
        )}
      </Stack>
    </>
  );
}
