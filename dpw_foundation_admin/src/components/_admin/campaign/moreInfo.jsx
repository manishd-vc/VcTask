import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FileUpload from 'src/components/fileUpload';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { uploadNeedMoreInfoFiles } from 'src/services';
import * as Yup from 'yup';
/**
 * MoreInfo component
 *
 * This component allows users to submit additional information along with an optional attachment.
 * It provides file upload functionality, handles form validation for the "more info" field,
 * and supports downloading media files.
 *
 * @component
 * @param {boolean} open - Flag indicating if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle form submission with the provided values.
 * @param {boolean} isLoading - Flag indicating if the form is in a loading state.
 * @param {string} id - The ID of the entity related to the attachment (e.g., campaign or project).
 * @example
 * return <MoreInfo open={true} onClose={handleClose} onSubmit={handleSubmit} isLoading={false} id="1234" />;
 */
const MoreInfo = ({ open, onClose, onSubmit, isLoading, id }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [uploadedFile, setUploadedFile] = useState(''); // State for the uploaded file ID

  // Formik setup for managing the form state and validation
  const formik = useFormik({
    initialValues: {
      moreInfo: '', // Field for "more info" text
      fileId: '' // Field for the uploaded file ID
    },
    validationSchema: Yup.object({
      moreInfo: Yup.string().required('More info is required') // Validation rule for "more info"
    }),
    onSubmit: (values) => {
      const value = { ...values }; // Create a copy of values to avoid mutation
      value.fileId = uploadedFile; // Attach the uploaded file ID to the form values
      onSubmit(value); // Submit the form data to the parent component
    }
  });

  /**
   * Removes the uploaded file from the form
   *
   * @param {number} index - The index of the file in the list.
   * @returns {void}
   */
  const remove = (index) => {
    const files = formik?.values.fileId; // Get the current list of file IDs
    files.splice(index, 1); // Remove the file at the specified index
    formik?.setFieldValue('fileId', files); // Update the form field value
  };

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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  /**
   * Handles file upload functionality for attachments.
   *
   * @param {File} file - The file to be uploaded.
   * @returns {void}
   */
  const handleAttachmentsUpload = async (file) => {
    const result = await uploadNeedMoreInfoFiles(id, file); // Call the API to upload the file
    if (result.status == 200) {
      setUploadedFile(result.data?.data); // Set the uploaded file ID on success
    } else {
      dispatch(setToastMessage({ message: 'Error while uploading attachment', variant: 'error' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          sx={{ textTransform: 'uppercase', paddingRight: { sm: 'auto', md: '60px' } }}
          id="customized-dialog-titlepx"
          variant="h5"
          color="primary.main"
        >
          Need More information
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            variant="standard"
            id="moreInfo"
            name="moreInfo"
            label={
              <>
                More information description{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            value={formik.values.moreInfo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.moreInfo && Boolean(formik.errors.moreInfo)}
            helperText={formik.touched.moreInfo && formik.errors.moreInfo}
          />
          <Box sx={{ marginTop: 4 }}>
            <FileUpload
              buttonText="Add Attachment"
              name="fileId"
              size="small"
              onChange={(event) => {
                const newFiles = event.currentTarget.files;
                const validFiles = [];
                for (const file of newFiles) {
                  if (file.size <= 10 * 1024 * 1024) {
                    validFiles.push(file);
                  } else {
                    dispatch(
                      setToastMessage({
                        message: `File ${file.name} exceeds the 10 MB limit.`,
                        variant: 'error'
                      })
                    );
                  }
                }
                if (validFiles.length > 0) {
                  formik?.setFieldValue('fileId', [...validFiles]);
                  handleAttachmentsUpload([...validFiles]);
                }
              }}
            />
            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" sx={{ py: 2 }} gap={0.5}>
              {formik?.values?.fileId &&
                Array.from(formik?.values.fileId)?.map((file, index) => (
                  <Box key={`filename_${file?.id}`}>
                    <Typography component="span" variant="body2" color="text.secondarydark">
                      <span style={{ textDecoration: 'underline' }}>{file?.name || file?.fileName}</span>
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIconRed />
                      </IconButton>
                      {file?.fileName && (
                        <Tooltip title="Download" arrow>
                          <IconButton aria-label="download" onClick={(event) => downloadMediaFile(event, file?.id)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {file?.id && (
                        <Tooltip title="Remove" arrow>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteFile(file, formik?.values.fileId, 'fileId')}
                          >
                            <DeleteIconRed />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlinedWhite">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            Send
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
MoreInfo.propTypes = {
  open: PropTypes.bool.isRequired, // Validates 'open' as a required boolean
  onClose: PropTypes.func.isRequired, // Validates 'onClose' as a required function
  onSubmit: PropTypes.func.isRequired, // Validates 'onSubmit' as a required function
  isLoading: PropTypes.bool, // Validates 'isLoading' as an optional boolean
  id: PropTypes.string
};
export default MoreInfo;
