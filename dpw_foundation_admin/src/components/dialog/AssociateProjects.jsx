import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  CircularProgress,
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
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerApi from 'src/services/partner';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function AssociateProjects({ open, onClose }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { mutate: addAssociateProjects, isLoading: addAssociateProjectsLoading } = useMutation(
    'addAssociateProjects',
    partnerApi.addAssociateProjects,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response.message, variant: 'success' }));
        onClose();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );
  const { data: projects, isLoading: projectsLoading } = useQuery(
    ['getAllAssociatedProjects', partnerRequestData?.partnerId],
    () =>
      partnerApi.getAllAssociatedProjects({ payload: { partnerId: partnerRequestData?.partnerId, partnershipId: id } }),
    { enabled: !!partnerRequestData?.partnerId }
  );

  const handleSubmit = () => {
    const payload = {
      partnershipId: id,
      campaignIds: selectedProjects.map((p) => p.id)
    };
    addAssociateProjects(payload);
  };

  useEffect(() => {
    if (projects) {
      setSelectedProjects(projects?.filter((p) => p?.isAssociated));
    }
  }, [projects]);

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Dialog title */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Associate Projects
      </DialogTitle>
      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {selectedProjects.length > 0 && (
          <Typography variant="body1" textTransform="uppercase" pb={2} color="text.secondarydark">
            {selectedProjects.length} {selectedProjects.length === 1 ? 'project' : 'projects'} selected
          </Typography>
        )}
        <FieldWithSkeleton isLoading={projectsLoading} error={false}>
          <FormControl variant="standard" fullWidth>
            <Autocomplete
              multiple
              options={projects || []}
              value={selectedProjects}
              onChange={(event, newValue) => setSelectedProjects(newValue)}
              getOptionLabel={(option) => option?.campaignTitle || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto !important', // let it grow
                  alignItems: 'flex-start', // align tags properly
                  flexWrap: 'wrap', // allow wrapping
                  paddingTop: '6px',
                  paddingBottom: '6px'
                },
                '& .MuiInputBase-input': {
                  height: 'auto !important'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Projects"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {projectsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Typography component="li" {...props} key={option.id} color="text.secondarydark">
                  {option.campaignTitle}
                </Typography>
              )}
            />
          </FormControl>
        </FieldWithSkeleton>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton variant="contained" onClick={handleSubmit} loading={addAssociateProjectsLoading}>
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
