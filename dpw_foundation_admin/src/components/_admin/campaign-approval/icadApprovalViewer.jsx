import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';
/**
 * IcadApprovalViewer component displays a dialog with IACAD response details.
 *
 * @param {object} props - The component props
 * @param {boolean} props.open - Determines if the modal is open or closed
 * @param {function} props.onClose - Callback function to handle modal close
 * @param {object} props.row - The row data containing IACAD response information
 *
 * @returns {JSX.Element} The rendered IcadApprovalViewer dialog
 */
const IcadApprovalViewer = ({ open, onClose, row }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: '765px !important'
        }
      }}
    >
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        IACAD Response
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Permit ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {row?.iacadPermitId ? row?.iacadPermitId : row?.iacadRequestId}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Response Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {row?.iaCadResponseDate ? fDateWithLocale(row?.iaCadResponseDate) : '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

IcadApprovalViewer.propTypes = {
  // 'open' is a boolean indicating if the viewer is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a required function to handle closing the viewer
  onClose: PropTypes.func.isRequired,

  // 'row' is an object containing specific properties
  row: PropTypes.shape({
    iacadPermitId: PropTypes.string.isRequired, // Ensure 'iacadPermitId' is a required string
    iacadRequestId: PropTypes.string.isRequired, // Ensure 'iacadRequestId' is a required string
    iaCadResponseDate: PropTypes.string.isRequired // Ensure 'iaCadResponseDate' is a required string
  }).isRequired
};

export default IcadApprovalViewer;
