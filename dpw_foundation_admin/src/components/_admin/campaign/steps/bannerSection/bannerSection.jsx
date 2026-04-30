import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FileUpload from 'src/components/fileUpload';
import { CloseIcon } from 'src/components/icons';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import MediaPreview from '../emailCampaign/mediaPreview';
/**
 * BannerSection component is responsible for managing the banner (thumbnail) of a campaign.
 * It handles file uploads, deletion, and updates the campaign's banner thumbnail in the form data.
 * It also triggers media list refetch after successful file upload or deletion.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isEdit - Flag to indicate if the section is in edit mode.
 * @param {boolean} props.isApprove - Flag to indicate if the section is in approve mode.
 * @param {Function} props.mediaListRefetch - A function to refetch the media list.
 * @param {boolean} props.isView - Flag to indicate if the section is in view mode.
 *
 * @returns {JSX.Element} The rendered component.
 */

BannerSection.propTypes = {
  // 'isEdit', 'isApprove', and 'isView' are booleans indicating different states
  isEdit: PropTypes.bool.isRequired,
  isApprove: PropTypes.bool.isRequired,
  isView: PropTypes.bool.isRequired,

  // 'mediaListRefetch' is a function to refetch media list data
  mediaListRefetch: PropTypes.func.isRequired
};

export default function BannerSection({ isEdit, isApprove, mediaListRefetch, isView }) {
  const dispatch = useDispatch();
  const { setFieldValue, values } = useFormikContext();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [loading, setLoading] = useState(false);

  const { mutate: deleteMediaMutation } = useMutation('deleteCampaignBanner', api.deleteCampaignBanner, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message }));
      mediaListRefetch();
    },

    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const { mutate, isLoading } = useMutation('uploadCampaignBanner', api.uploadCampaignBanner, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response, variables) => {
      dispatch(setToastMessage({ message: response?.message, title: 'Success' }));
      const uploadedFile = variables.payload.get('file');
      if (uploadedFile) {
        setFieldValue('attachThumbnail', uploadedFile);
      }
      setLoading(false);
      mediaListRefetch();
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response.data.message || error.response.data.detail,
          variant: 'error',
          title: 'Error'
        })
      );
      setLoading(false);
      mediaListRefetch();
    }
  });

  const handleFileUploadChange = (files) => {
    handleFileUploadValidation(files, {
      mutate,
      entityId: params?.id,
      setToastMessage,
      dispatch
    });
  };

  const handleDeleteMedia = () => {
    if (params?.id) {
      deleteMediaMutation(params?.id);
    }
  };
  function getBannerTitle(campaignType) {
    if (campaignType === 'FUNDCAMP') {
      return 'Campaign';
    } else if (campaignType === 'CHARITY') {
      return 'Project';
    } else {
      return 'Campaign Details';
    }
  }
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 2 }}>
        Cover Image for {getBannerTitle(values?.campaignType)}
      </Typography>
      <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap">
        {!isApprove && !isView && (
          <FileUpload
            size="small"
            name={'attachThumbnail'}
            typeOfAllowed="photoAlbumAllowed"
            buttonText={'Attach Thumbnail'}
            onChange={(event) => handleFileUploadChange(Array.from(event.target.files))}
            disabled={!isEdit || loading}
          />
        )}
        {isLoading && <Skeleton variant="rectangular" width={120} height={80} />}
        {values?.attachThumbnail?.preSignedUrl && (
          <Box
            onClick={() => {
              if (values?.attachThumbnail?.name || values?.attachThumbnail?.fileName) {
                setOpen(true);
              }
            }}
            sx={{ cursor: 'pointer', width: '120px', height: '80px', overflow: 'hidden' }}
          >
            <MediaPreview
              src={values?.attachThumbnail?.preSignedUrl}
              name={values?.attachThumbnail?.name}
              onRemove={handleDeleteMedia}
              width={120}
              height={80}
              layout="intrinsic"
              isCloseIcon={!isView}
              isOverlay={!isView}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h5"
            color="primary.main"
          >
            Cover Image
          </DialogTitle>
          <IconButton aria-label="close" onClick={() => setOpen(false)} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {values?.attachThumbnail?.preSignedUrl && (
              <MediaPreview
                src={values?.attachThumbnail?.preSignedUrl}
                name={values?.attachThumbnail?.name}
                onRemove={() => setFieldValue('attachThumbnail', [])}
                width={800}
                height={600}
                layout="responsive"
                isCloseIcon={false}
              />
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </Paper>
  );
}
