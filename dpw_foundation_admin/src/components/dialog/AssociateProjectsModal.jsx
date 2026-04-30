import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import ModalStyle from './dialog.style';

export default function AssociateProjectsModal({ onClose, open, beneficiaryData, listOfProjects }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    if (listOfProjects?.length) {
      setSelectedProjects(listOfProjects.filter((project) => project.isAssociated).map((project) => project.id));
    }
  }, [listOfProjects]);

  const { mutate, isLoading } = useMutation(beneficiaryApi.updateAssociatedProjects, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      onClose();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response?.data?.message, variant: 'error' }));
    }
  });

  const handleAdd = () => {
    const payload = {
      beneficiaryId: beneficiaryData?.id,
      userId: beneficiaryData?.userId,
      campaignIds: selectedProjects
    };
    mutate(payload);
  };

  return (
    <Dialog aria-label="associate-projects" onClose={onClose} open={open} fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Associate Projects
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 1.5 }}>
        <Typography variant="body1" textTransform="uppercase" pb={2} color="text.secondarydark">
          {selectedProjects.length} Project{selectedProjects.length !== 1 ? 's' : ''} Selected
        </Typography>

        <FormControl variant="standard" fullWidth>
          <Autocomplete
            multiple
            options={listOfProjects || []}
            value={listOfProjects?.filter((project) => selectedProjects.includes(project.id)) || []}
            onChange={(event, newValue) => {
              setSelectedProjects(newValue.map((project) => project.id));
            }}
            getOptionLabel={(option) => option.campaignTitle}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <Typography variant="body2" mb={2}>
                    Select projects to associate
                  </Typography>
                }
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  style: {
                    ...params.InputProps.style,
                    height: 'auto',
                    minHeight: '2.625rem',
                    flexWrap: 'wrap'
                  }
                }}
              />
            )}
            renderOption={(props, item) => (
              <Typography component="li" {...props} key={item.id} color="text.secondarydark">
                {item.campaignTitle}
              </Typography>
            )}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={isLoading}
          onClick={handleAdd}
          disabled={selectedProjects.length === 0}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
