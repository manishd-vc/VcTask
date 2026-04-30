'use client';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DocumentPreview from 'src/components/DocumentPreview';
import { DownloadLetterIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import { setPartnershipRequestData } from 'src/redux/slices/partner';
import * as partnerManagementApi from 'src/services/partner';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getPartnershipStatus } from 'src/utils/getPartnershipStatus';
import { checkPermissions } from 'src/utils/permissions';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';
import MoreInfoView from '../../donor/needInfo';
import CreatePartnerDocument from './CreatePartnerDocument';
import PageHeader from './page-header';
import PartnerInformation from './partner-information';
import PartnerRequestInformation from './partner-request-information';
import PartnerReportsView from './PartnerReportsView';
import RequestApproval from './request-approval';
import RequestDetails from './request-details';
export default function ViewPartnerRequest({ isLetter = false, isSignDocument = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state?.user?.user);
  const partnershipRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const { masterData } = useSelector((state) => state?.common);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const [latterValues, setLatterValues] = useState('');
  const [loadingType, setLoadingType] = useState(null);
  const {
    status,
    feedbackStatus,
    managerNotes,
    managerNeedInfoName,
    managerNeedInfoId,
    approverNotes,
    approverNeedInfoName,
    approverNeedInfoId,
    documentType,
    letter,
    adminAssignTo,
    adminSignPresignedUrl,
    partnerSignPresignedUrl,
    documentApproverNotes,
    documentApproverNeedInfoName,
    documentApproverNeedInfoId
  } = partnershipRequestData || {};

  const isPartnerManage = checkPermissions(rolesAssign, ['partner_manage']);

  const getPartnerLetterTemplateCode = (documentType) => {
    switch (documentType) {
      case 'mou':
        return 'partner_mou_letter_template';
      case 'sla':
        return 'partner_sla_letter_template';
      case 'contract_agreement':
        return 'partner_contract_agreement_letter_template';
      default:
        return null;
    }
  };

  const { data: partnerLetterContent } = useQuery(
    ['getDefaultPartnerLetterContent', documentType],
    () => {
      const letterCode = getPartnerLetterTemplateCode(documentType);
      return partnerManagementApi.getDefaultPartnerLetterContent(letterCode);
    },
    {
      enabled: !!documentType
    }
  );

  useEffect(() => {
    if (letter) {
      setLatterValues(letter);
    } else if (partnerLetterContent) {
      setLatterValues(partnerLetterContent?.content);
    }
  }, [partnerLetterContent, partnershipRequestData]);

  const needMoreInfoMessage = useMemo(() => {
    if (status === 'IN_PROGRESS_DOC_CREATION') {
      return documentApproverNotes;
    } else if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNotes;
    } else {
      return managerNotes;
    }
  }, [status, feedbackStatus, approverNotes, managerNotes]);

  const needMoreFileName = useMemo(() => {
    if (status === 'IN_PROGRESS_DOC_CREATION') {
      return documentApproverNeedInfoName;
    } else if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNeedInfoName;
    } else {
      return managerNeedInfoName;
    }
  }, [status, feedbackStatus, approverNeedInfoName, managerNeedInfoName]);

  const needMoreAttachment = useMemo(() => {
    if (status === 'IN_PROGRESS_DOC_CREATION') {
      return documentApproverNeedInfoId;
    } else if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNeedInfoId;
    } else {
      return managerNeedInfoId;
    }
  }, [status, feedbackStatus, approverNeedInfoId, managerNeedInfoId]);

  const showNeedMoreInfoBox =
    feedbackStatus === 'FEEDBACK_REQUESTED' && (approverNotes || managerNotes || documentApproverNotes); // isNeedMoreInfo.includes(status)

  const { isLoading, refetch } = useQuery(
    ['partnerRequest', partnerManagementApi.fetchPartnershipRequestById, id],
    () => partnerManagementApi.fetchPartnershipRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setPartnershipRequestData(data));
      }
    }
  );

  const { data: documentsList } = useQuery(['getPartnershipDocumentsList', id], () =>
    partnerManagementApi.getPartnershipDocumentsList({ entityId: id }, { enabled: !!id })
  );

  // Letter Create Start

  const { mutate: createDocument } = useMutation(partnerManagementApi.createPartnershipDocument, {
    onSuccess: async (response) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      router.push(`/admin/partnership-request`);
    },
    onError: (err) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: uploadPartnershipSignature, isLoading: isUploading } = useMutation(
    partnerManagementApi.uploadPartnershipSignature,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        refetch();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );
  const { mutate: finalApproval, isLoading: isFinalApprovalLoading } = useMutation(
    partnerManagementApi.partnerCommonStatusUpdate,
    {
      onSuccess: async (response) => {
        router.push(`/admin/partnership-request`);
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: downloadPartnershipAcceptanceLetter, isLoading: isDownloading } = useMutation(
    partnerManagementApi.downloadPartnershipAcceptanceLetter,
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

  const showLetter = ['IN_PROGRESS_DOC_CREATION'];
  const isShowLetter =
    showLetter.includes(status) &&
    adminAssignTo === user?.userId &&
    checkPermissions(rolesAssign, ['partner_manage_admin_manage']) &&
    isLetter;

  const handleCreateDocument = (type) => {
    setLoadingType(type);
    const payload = {
      mode: type,
      letterType: documentType,
      content: latterValues
    };
    createDocument({ entityId: id, payload });
  };

  const handleFileUploadChange = (event) => {
    const file = event?.target?.files[0];
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file);
      formData.append('type', 'PARTNERSHIP-DOC-APPROVAL');
    }
    uploadPartnershipSignature({ payload: formData, entityId: id });
  };

  const handleFinalApproval = () => {
    const payload = {
      statusName: status,
      status: 'approved'
    };
    finalApproval({ id: id, payload });
  };

  const onClickDownload = () => {
    downloadPartnershipAcceptanceLetter(id);
  };

  const showDocumentPreview = () => {
    if (isSignDocument) {
      return (
        <DocumentPreview
          content={letter}
          title={
            documentType
              ? `${getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType)} Letter`
              : 'Partnership / Agreement Letter'
          }
          isUploadSignature
          buttonText={adminSignPresignedUrl ? 'Update Signature' : 'Add Signature'}
          signatureText={'HOD Signature'}
          handleFileUploadChange={handleFileUploadChange}
          loading={isUploading}
          signaturePreviewText={'Partner Signature'}
          signatureUrl={partnerSignPresignedUrl}
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

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <>
      <PageHeader
        refetch={refetch}
        handleCreateDocument={handleCreateDocument}
        isLoading={loadingType}
        isLetter={isLetter}
        isSignDocument={isSignDocument}
        handleFinalApproval={handleFinalApproval}
        isFinalApprovalLoading={isFinalApprovalLoading}
      />
      <Stack spacing={3}>
        {showDocumentPreview()}
        {isShowLetter && <CreatePartnerDocument latterValues={latterValues} setLatterValues={setLatterValues} />}
        <RequestDetails />
        {showNeedMoreInfoBox && (
          <MoreInfoView
            chipLabel={getPartnershipStatus(masterData, status, feedbackStatus)}
            message={needMoreInfoMessage}
            fileName={needMoreFileName}
            attachment={needMoreAttachment}
            spacing={false}
          />
        )}
        <PartnerInformation />
        <PartnerRequestInformation documentsList={documentsList} />
        {isPartnerManage && <PartnerReportsView partnershipId={id} />}
        <RequestApproval />
        {renderLetter()}
      </Stack>
    </>
  );
}
