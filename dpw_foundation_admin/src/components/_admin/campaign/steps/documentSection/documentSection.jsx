import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import FileUpload from 'src/components/fileUpload';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import UploadDocumentsRow from 'src/components/table/rows/uploadDocumentsRow';
import { getDefaultFileValidation, handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import MediaPreview from '../emailCampaign/mediaPreview';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

DocumentSection.propTypes = {
  // 'isLoading' is a boolean indicating whether the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'mediaListRefetch' is a function for refetching the media list data
  mediaListRefetch: PropTypes.func.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired,

  // 'isView' is a boolean indicating if the component is in view mode
  isView: PropTypes.bool.isRequired
};

/**
 * DocumentSection component allows users to manage documents and images related to a campaign.
 * It supports file uploads, deletions, viewing media in a modal, and toggling between showing all uploaded images or a subset.
 *
 * @param {boolean} isLoading - Indicates if the component is currently loading data.
 * @param {function} mediaListRefetch - Function to refetch the media list after a file operation (e.g., upload, delete).
 * @param {boolean} isEdit - Indicates if the component is in edit mode.
 * @param {boolean} isApprove - Indicates if the component is in approve mode.
 * @param {boolean} isView - Indicates if the component is in view-only mode.
 */

export default function DocumentSection({ isLoading, mediaListRefetch, isEdit, isApprove, isView }) {
  const dispatch = useDispatch();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false); // State to track "Show More" / "Show Less"
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { campaignUpdateData } = useSelector((state) => state?.campaign);

  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const { maxPhotoSizeKB, uploadCount } = getDefaultFileValidation(masterData);
  const [isPhotoAlbumUploading, setIsPhotoAlbumUploading] = useState(false);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(['getDocumentsList', params?.id], () =>
    api.getDocumentsList({ entityId: params?.id }, { enabled: !!params?.id })
  );

  /**
   * Mutation hook to handle file deletion from the media list.
   * Upon success, it refetches the media list and shows a success toast message.
   * On error, it shows an error toast message.
   */
  const { mutate: deleteMediaMutation } = useMutation('deleteMedia', api.deleteMedia, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      mediaListRefetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Mutation hook to handle file uploads.
   * Upon success, it updates the campaign's attached documents or photo album and refetches the media list.
   * On error, it shows an error toast message.
   */
  const { mutate } = useMutation('uploadFiles', api.uploadFiles, {
    onSuccess: (response, variables) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      const uploadedFile = variables.payload.get('file');

      if (variables?.moduleType === 'CAMPAIGN_PROJECT_DOC') {
        const newFiles = [...values.campaignAttachments, uploadedFile];
        setFieldValue('campaignAttachments', newFiles);
      } else {
        const newFiles = [...values.campaignPhotoAlbum, uploadedFile];
        setFieldValue('campaignPhotoAlbum', newFiles);
      }
      mediaListRefetch();
      if (variables?.moduleType !== 'CAMPAIGN_PROJECT_DOC') {
        setIsPhotoAlbumUploading(false);
      }
    },
    onError: (error) => {
      dispatch(
        setToastMessage({ message: error.response.data.message || error.response.data.detail, variant: 'error' })
      );
      mediaListRefetch();
    }
  });

  /**
   * Mutation hook to download media associated with the campaign.
   * On success, it triggers the file download and shows a success toast message.
   * On error, it shows an error toast message.
   */

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Deletes a file from the campaign's attachments or photo album.
   *
   * @param {object} file - The file to be deleted.
   * @param {array} value - The current list of files in the field.
   * @param {string} fieldName - The name of the field containing the list of files.
   */
  const handleDeleteFile = (file, value, fieldName) => {
    if (file?.id) {
      deleteMediaMutation(file?.id);
    }

    const updatedAttachments = value?.filter((item) => item !== file);
    setFieldValue(fieldName, updatedAttachments);
  };

  /**
   * Handles file upload change and validation.
   *
   * @param {FileList} files - The selected files for upload.
   * @param {number} currentFileCount - The current number of files uploaded.
   * @param {string} moduleType - The type of module for the upload (e.g., campaign, project).
   */
  const handleFileUploadChange = (files, currentFileCount, moduleType) => {
    if (moduleType !== 'CAMPAIGN_PROJECT_DOC') {
      setIsPhotoAlbumUploading(true);
    }
    handleFileUploadValidation(files, {
      currentFileCount,
      mutate,
      entityId: campaignUpdateData?.id,
      entityType: 'CAMPAIGN',
      moduleType: moduleType,
      setToastMessage,
      dispatch,
      maxPhotoSizeKB,
      uploadCount
    });
  };

  /**
   * Constructs the image URL for a given image ID.
   *
   * @param {string} id - The ID of the image to generate the URL.
   * @returns {string} The full image URL for the given ID.
   */

  /**
   * Deletes a photo album file.
   *
   * @param {object} file - The file to be deleted.
   */
  const deletePhotoAlbum = (file) => {
    if (file?.id) {
      deleteMediaMutation(file?.id);
    }
    setFieldValue('campaignPhotoAlbum', null);
  };

  /**
   * Opens the image modal on image click.
   *
   * @param {object} file - The file being clicked.
   */
  const handleImageClick = (file) => {
    const imageUrl = file?.preSignedUrl || '';
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  /**
   * Toggles the state of showing all images or a subset.
   */
  const toggleShowImages = () => {
    setShowAllImages(!showAllImages); // Toggle the state
  };

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  const handleCloseUploadDocuments = () => {
    setAddDocumentOpen(false);
    refetchDocumentsList();
  };

  const rejectedStatus = ['REJECTED', 'IACAD_REJECTED'];
  const isRejected = rejectedStatus.includes(campaignUpdateData?.status) || false;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black">
          {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Documents' : 'Project Documents'}
        </Typography>
        {!isRejected && (
          <Button variant="contained" color="primary" size="small" onClick={() => setAddDocumentOpen(true)}>
            Attach {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Documents' : 'Project Documents'}
          </Button>
        )}
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UploadDocumentsRow
            rowData={documentsList}
            targetEntityId={campaignUpdateData?.id}
            refetchDocumentsList={refetchDocumentsList}
          />

          <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
            {values.campaignAttachments &&
              Array.from(values.campaignAttachments)?.map((file) => (
                <Box key={file?.id}>
                  <Box component="div" variant="body2" color="text.secondarydark">
                    <Box
                      component="span"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={(event) => downloadMediaFile(event, file?.id)}
                    >
                      {file?.fileName + 'teerkerer'}
                    </Box>
                    {file?.id && !isView && (
                      <Tooltip title="Remove" arrow>
                        <IconButton
                          aria-label="delete"
                          disabled={!isEdit}
                          onClick={() => handleDeleteFile(file, values.campaignAttachments, 'campaignAttachments')}
                        >
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              ))}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="p" textTransform={'uppercase'} color="text.black">
            Photo Album
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {!isApprove && !isView && (
                <Stack flexDirection="column" gap={1}>
                  <FileUpload
                    disabled={!isEdit || isPhotoAlbumUploading} // Disable when uploading
                    size="small"
                    name={'campaignPhotoAlbum'}
                    buttonText={'Attach photo Album'}
                    onChange={(event) =>
                      handleFileUploadChange(
                        Array.from(event.target.files),
                        values.campaignPhotoAlbum.length,
                        'CAMPAIGN_PHOTO_ALBUM'
                      )
                    }
                    typeOfAllowed="photoAlbumAllowed"
                    multiple={true}
                  />
                </Stack>
              )}
              <Stack alignItems="flex-start" flexDirection="row" gap={2} rowGap={0} flexWrap="wrap">
                {(showAllImages
                  ? values?.campaignPhotoAlbum || []
                  : (values?.campaignPhotoAlbum || []).slice(0, 6)
                )?.map((file) => (
                  <Box
                    key={file?.id}
                    onClick={() => handleImageClick(file)}
                    sx={{ ...style.imageWidth, cursor: 'pointer', mt: 2 }}
                  >
                    <MediaPreview
                      src={file?.preSignedUrl || ''}
                      alt={file?.fileName}
                      name={file.name}
                      onRemove={() => deletePhotoAlbum(file)}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={isEdit || !isView}
                      isOverlay={true}
                    />
                  </Box>
                ))}

                {values?.campaignPhotoAlbum?.length > 6 && (
                  <Link
                    variant="blue"
                    size="small"
                    underline="always"
                    textTransform="uppercase"
                    sx={{ fontSize: 14, alignSelf: 'center', cursor: 'pointer' }}
                    onClick={toggleShowImages}
                  >
                    {showAllImages ? 'Show Less' : 'Show More'}
                  </Link>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              {!isView ? (
                <>
                  <Typography variant="body2" component="p" textTransform={'uppercase'} color="text.secondary" mb={2}>
                    OR
                  </Typography>
                  <FieldWithSkeleton isLoading={isLoading} error={touched.photoAlbumLink && errors.photoAlbumLink}>
                    <TextField
                      id="photoAlbumLink"
                      {...getFieldProps('photoAlbumLink')}
                      error={touched.photoAlbumLink && Boolean(errors.photoAlbumLink)}
                      fullWidth
                      variant="standard"
                      label="Add Photo Album Link"
                      disabled={values?.campaignPhotoAlbum?.name}
                    />
                  </FieldWithSkeleton>
                </>
              ) : (
                campaignUpdateData?.photoAlbumLink && (
                  <Stack flexDirection="column" sx={{ wordBreak: 'break-all' }}>
                    <Typography variant="body3" color="text.secondary">
                      Photo Album Link
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {campaignUpdateData?.photoAlbumLink}
                    </Typography>
                  </Stack>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h6"
            color="primary.main"
          >
            Photo Album
          </DialogTitle>
          <IconButton aria-label="close" onClick={() => setOpen(false)} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Image Preview"
                width={800}
                height={600}
                layout="responsive"
                unoptimized={true}
              />
            )}
          </DialogContent>
        </Dialog>
        {addDocumentOpen && (
          <UploadDocuments
            open={addDocumentOpen}
            onClose={handleCloseUploadDocuments}
            targetEntityId={campaignUpdateData?.id}
          />
        )}
      </Grid>
    </Paper>
  );
}
