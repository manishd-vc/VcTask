import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import ModalStyle from '../dialog/dialog.style';
import { CloseIcon } from '../icons';

export default function VolunteerReleaseDialog({ open, onClose, onAgree, title, agreeButtonText = 'I Agree' }) {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { data: templateData } = useQuery(['volunteer_release_template'], volunteerApi.getVolunteerReleaseTemplate, {
    enabled: open,
    onSuccess: (response) => {
      setContent(response?.data?.content || 'Volunteer release content not available.');
    },
    onError: (error) => {
      dispatch(setToastMessage({ type: 'error', message: 'Failed to load volunteer release template' }));
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
