import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
export default function VolunteerReleaseDialog({ open, onClose, onAgree, title, agreeButtonText = 'I Agree' }) {
  const [content, setContent] = useState('');
  const theme = useTheme(); // Access Material-UI theme
  const style = ModalStyle(theme); // Apply modal styles based on the theme
  const dispatch = useDispatch();
  const { data: templateData } = useQuery(['volunteer_release_template'], volunteerApi.getVolunteerReleaseTemplate, {
    enabled: open,
    onSuccess: (response) => {
      setContent(response?.data?.content || 'Volunteer release content not available.');
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      setContent('Volunteer release content not available.');
    }
  });

  const dialogTitle = title || templateData?.data?.title || 'Volunteer Release and Undertaking';
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase', width: '90%' }} variant="h5" color="primary.main">
        {dialogTitle}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box className="ql-editor" sx={{ color: 'text.secondarydark' }}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onAgree} variant="contained">
          {agreeButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
