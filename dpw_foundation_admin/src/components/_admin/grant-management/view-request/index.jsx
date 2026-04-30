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
import { setGrantRequestData } from 'src/redux/slices/grant';
import * as grantManagementApi from 'src/services/grantManagement';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { checkPermissions } from 'src/utils/permissions';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';
import MoreInfoView from '../../donor/needInfo';
import CreateDocument from './CreateDocument';
import GrantRequestInformation from './grant-request-information';
import GrantSeekerInformation from './grant-seeker-information';
import PageHeader from './page-header';
import RequestApproval from './request-approval';
import RequestDetails from './request-details';

export default function ViewRequest({ isLetter = false, isSignDocument = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state?.user?.user);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
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
    seekerSignPresignedUrl,
    documentApproverNotes,
    documentApproverNeedInfoName,
    documentApproverNeedInfoId
  } = grantRequestData || {};

  const { data: letterContent } = useQuery(
    ['getDefaultGrantLetterContent', documentType],
    () =>
      grantManagementApi.getDefaultGrantLetterContent(
        documentType === 'AGREEMENT' ? 'grant_agreement_letter_code' : 'grant_contribution_letter_code'
      ),
    {
      enabled: !!documentType
    }
  );

  useEffect(() => {
    if (letter) {
      setLatterValues(letter);
    } else if (letterContent) {
      setLatterValues(letterContent?.content);
    }
  }, [grantRequestData, letterContent]);

  const chipLabel =
    (feedbackStatus ? `${getLabelByCode(masterData, 'dpwf_grant_req_feedback_status_add', feedbackStatus)} -` : '') +
    ' ' +
    getLabelByCode(masterData, 'dpwf_grant_status', status);

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
    (feedbackStatus === 'FEEDBACK_REQUESTED' || status === 'FEEDBACK_REQUESTED_SEEKER') &&
    (approverNotes || managerNotes || documentApproverNotes); // isNeedMoreInfo.includes(status)

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

  const { data: documentsList } = useQuery(['getGrantDocumentsList', id], () =>
    grantManagementApi.getGrantDocumentsList({ entityId: id }, { enabled: !!id })
  );

  // Letter Create Start

  const { mutate: createDocument } = useMutation(grantManagementApi.createGrantDocument, {
    onSuccess: async (response) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      router.push(`/admin/grant-request`);
    },
    onError: (err) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: uploadGrantSignature, isLoading: isUploading } = useMutation(
    grantManagementApi.uploadGrantSignature,
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
    grantManagementApi.grantCommonStatusUpdate,
    {
      onSuccess: async (response) => {
        router.push(`/admin/grant-request`);
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
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

  const showLetter = ['IN_PROGRESS_DOC_CREATION'];
  const isShowLetter =
    showLetter.includes(status) &&
    adminAssignTo === user?.userId &&
    checkPermissions(rolesAssign, ['grant_manage_admin_manage']) &&
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
      formData.append('type', 'GRANT-DOC-APPROVAL');
    }
    uploadGrantSignature({ payload: formData, entityId: id });
  };

  const handleFinalApproval = () => {
    const payload = {
      statusName: status,
      status: 'approved'
    };
    finalApproval({ id: id, payload });
  };

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
        {isShowLetter && <CreateDocument latterValues={latterValues} setLatterValues={setLatterValues} />}
        <RequestDetails />
        {showNeedMoreInfoBox && (
          <MoreInfoView
            chipLabel={chipLabel}
            message={needMoreInfoMessage}
            fileName={needMoreFileName}
            attachment={needMoreAttachment}
            spacing={false}
          />
        )}
        <GrantSeekerInformation />
        <GrantRequestInformation documentsList={documentsList} />
        <RequestApproval />
        {renderLetter()}
      </Stack>
    </>
  );
}
