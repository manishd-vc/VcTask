'use client'; // Indicates that the component is a client-side rendered component in Next.js
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'; // Import MUI components for layout and styling
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import MediaPreview from 'src/components/_main/campaign/mediaPreview';
import FileUpload from 'src/components/fileUpload';
import { DownloadLetterIcon, ResizeIcon } from 'src/components/icons';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import './editorStyle.css';
// AcceptanceLetter component displays the details of an intent donation
const AcceptanceLetter = ({ data, id, donorDataRefetch }) => {
  const params = useParams();
  const handle = useFullScreenHandle();
  const dispatch = useDispatch();
  const { mutate: downloadAcceptanceLetter } = useMutation(api.downloadAcceptanceLetter, {
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
  });

  const onClickDownload = () => {
    downloadAcceptanceLetter(id);
  };

  const { mutate: uploadDonorSignatureMutate, isLoading: loading } = useMutation(
    'uploadDonorSignature',
    api.uploadDonorSignature,
    {
      onSuccess: (response) => {
        donorDataRefetch();
        dispatch(setToastMessage({ message: response?.message, title: 'Success' }));
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response.data.message || error.response.data.detail,
            variant: 'error',
            title: 'Error'
          })
        );
        donorDataRefetch();
      }
    }
  );

  const handleFileUploadChange = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadDonorSignatureMutate,
      entityId: params?.id,
      setToastMessage,
      dispatch
    });
  };

  return (
    <FullScreen handle={handle}>
      <Box sx={{ height: '100%', background: handle.active ? '#fff' : 'transparent' }}>
        <Stack flexDirection={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 1 }}>
            {data?.assessment?.donorPledgeResponse?.acceptanceAgreementLetterType === 'AGREEMENT_LETTER'
              ? 'Agreement Letter'
              : 'Acceptance Letter'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Download Document">
              <IconButton onClick={onClickDownload}>
                <DownloadLetterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Full Screen">
              <IconButton onClick={handle.active ? handle.exit : handle.enter}>
                <ResizeIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box className="ql-editor" sx={{ color: 'text.secondarydark' }}>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.acceptanceAgreementLetter ? data?.acceptanceAgreementLetter : '-'
              }}
            ></div>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'}>
            {data?.assessment?.hodAgreementSignUrl && (
              <Stack flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Box width={120} height={'auto'} my={1}>
                  <MediaPreview
                    src={data?.assessment?.hodAgreementSignUrl}
                    width={120}
                    height={80}
                    layout="intrinsic"
                    isCloseIcon={false}
                  />
                </Box>
                <Typography variant="subtitle4" component={'p'} color="text.secondarydark">
                  DPW HOD Signature
                </Typography>
              </Stack>
            )}
            {data?.assessment?.donorPledgeResponse?.acceptanceAgreementLetterType === 'AGREEMENT_LETTER' && (
              <Stack flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                {data?.assessment?.userAgreementSignUrl && (
                  <Box width={120} height={'auto'} my={1}>
                    <MediaPreview
                      src={data?.assessment?.userAgreementSignUrl}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={false}
                    />
                  </Box>
                )}
                <FileUpload
                  size="small"
                  name={'userAgreementSignUrl'}
                  buttonText={data?.assessment?.userAgreementSignUrl ? 'Update Signature' : 'Add Signature'}
                  onChange={(event) => handleFileUploadChange(Array?.from(event?.target?.files))}
                  disabled={loading}
                  accept="image/*"
                />

                <Typography variant="subtitle4" component={'p'} sx={{ my: 2 }} color="text.secondarydark">
                  Donor Signature
                </Typography>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </FullScreen>
  );
};

AcceptanceLetter.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.string
  }).isRequired
};
// Export the AcceptanceLetter component
export default AcceptanceLetter;
