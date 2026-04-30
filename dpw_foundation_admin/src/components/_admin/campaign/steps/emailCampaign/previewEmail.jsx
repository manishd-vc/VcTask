import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import MediaPreview from './mediaPreview';
import MediaPreviewStyle from './mediaPreview.styles';

PreviewEmail.propTypes = {
  // 'open' is a boolean indicating whether the preview modal is open
  open: PropTypes.bool.isRequired,

  // 'handleClose' is a function to handle closing the preview modal
  handleClose: PropTypes.func.isRequired,

  // 'backOpen' is a function to handle going back to the previous view or modal
  backOpen: PropTypes.func.isRequired
};
/**
 * PreviewEmail component renders a modal displaying a preview of an email.
 * It provides options to download media associated with the email or navigate back to the previous view.
 *
 * @param {boolean} open - Determines whether the modal is open or not.
 * @param {function} handleClose - Function to close the modal.
 * @param {function} backOpen - Function to navigate back to the previous view.
 */
export default function PreviewEmail({ open, handleClose, backOpen, attachments = [], isVolunteer = false }) {
  const dispatch = useDispatch();
  const { values } = useFormikContext();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const imageStyle = MediaPreviewStyle(theme);

  /**
   * Handles the back navigation by closing the modal and invoking the backOpen function.
   */
  const handleBack = () => {
    handleClose();
    backOpen();
  };

  /**
   * Constructs the image URL for a given image ID.
   *
   * @param {string} id - The ID of the image to generate the URL.
   * @returns {string} The full image URL for the given ID.
   */

  /**
   * Mutation hook to download media files associated with the email.
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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  return (
    <Dialog open={open} onClose={handleBack} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Emailer Preview
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleBack} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ backgroundColor: theme.palette.backgrounds.light }}>
        <Stack alignItems="center">
          <Box sx={imageStyle.emailContentPreview}>
            <Box sx={imageStyle.emailBannerPreview}>
              {(values.bannerImage?.preSignedUrl || values.bannerFileId?.preSignedUrl) && (
                <MediaPreview
                  src={values.bannerImage?.preSignedUrl || values.bannerFileId?.preSignedUrl}
                  name={'preview'}
                  width={973}
                  height={440}
                  layout="responsive"
                  isCloseIcon={false}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </Box>
            <Box sx={{ px: 2, py: 2.5 }}>
              <Box>
                <Typography variant="h5" color="text.black">
                  {values?.subject}
                </Typography>
              </Box>
              <Box sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.black">
                  {values?.body}
                </Typography>
              </Box>
              {Boolean(values.attachments?.length || attachments?.length) && (
                <Box sx={{ pt: 1.5 }}>
                  <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={2}>
                    <Typography variant="subtitle1" color="text.black">
                      Attachments -
                    </Typography>
                    {(values.attachments || attachments) &&
                      Array.from(values.attachments || attachments)?.map((file) => (
                        <Box key={file?.id}>
                          <Typography component="span" variant="body2" color="text.blue">
                            <Box
                              component="span"
                              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                              onClick={(event) => downloadMediaFile(event, file?.id)}
                            >
                              {file?.fileName}
                            </Box>
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ pt: 3.5 }}>
                <Button variant="contained" color="primary" size="small" type="button" sx={{ cursor: 'not-allowed' }}>
                  {isVolunteer ? 'View Project Details' : 'Donate Now'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
