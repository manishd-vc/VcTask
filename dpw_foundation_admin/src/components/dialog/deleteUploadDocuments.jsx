import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as beneficiaryApi from 'src/services/beneficiary';
import * as grantManagementApi from 'src/services/grantManagement';
import * as partnershipApi from 'src/services/partner';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function DeleteUploadDocuments({ onClose, open, targetEntityId, documentId, type }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const apiUrl = () => {
    switch (type) {
      case 'grant':
        return grantManagementApi.deleteGrantDocuments;
      case 'partnership':
        return partnershipApi.deletePartnershipDocuments;
      case 'beneficiary':
        return beneficiaryApi.deleteInKindBeneficiaryDocuments;
      case 'inKindAgreement':
        return beneficiaryApi.deleteInKindBeneficiaryDocuments;
      default:
        return api.deleteUploadedDocument;
    }
  };

  const deleteApi = apiUrl();

  const { mutate, isLoading } = useMutation(deleteApi, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      onClose();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const handleDelete = () => {
    mutate({ targetEntityId, documentId });
  };

  return (
    <Dialog aria-label="Upload-documents" onClose={onClose} open={open} maxWidth={'sm'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Confirm
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Are you sure you want to delete this document?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton variant="contained" color="primary" onClick={handleDelete} loading={isLoading}>
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
