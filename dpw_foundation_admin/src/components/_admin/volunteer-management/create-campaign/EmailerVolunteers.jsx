import { Button, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import CreateEmailerModal from './CreateEmailerModal';

export default function EmailerVolunteers() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [emailPreDraft, setEmailPreDraft] = useState(null);
  const [emailerData, setEmailerData] = useState(null);

  const { mutate } = useMutation(
    'createPreDraftEmailerForVolunteers',
    volunteerApi.createPreDraftEmailerForVolunteers,
    {
      onSuccess: (response) => {
        if (response?.status === 200) {
          setOpen(true);
          setEmailPreDraft(response?.data);
        }
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
        setOpen(false);
      }
    }
  );

  const { refetch: refetchEmailer } = useQuery(
    ['getEmailerVolunteers', id],
    () => volunteerApi.getEmailerVolunteers(id),
    {
      enabled: !!id,
      onSuccess: (response) => {
        setEmailerData(response);
      }
    }
  );

  const handleOpen = useCallback(() => {
    mutate(id);
  }, [mutate, id]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleEmailUpdate = useCallback(() => {
    setOpen(true);
  }, []);

  const { mutate: deleteEmailerVolunteers } = useMutation(
    'deleteEmailerVolunteers',
    volunteerApi.deleteEmailerVolunteers,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        refetchEmailer();
        setEmailerData(null);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Create Emailer For Volunteers
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            type="button"
            onClick={handleOpen}
            disabled={Object?.keys(emailerData || {})?.length > 0}
          >
            Create Emailer
          </Button>

          {Object?.keys(emailerData || {})?.length > 0 && (
            <>
              <Button variant="blueLink" onClick={handleEmailUpdate} size="small" sx={{ ml: 2.5 }}>
                Emailer Attached
              </Button>
              <Tooltip title="Delete" arrow>
                <IconButton aria-label="delete" onClick={() => deleteEmailerVolunteers(id)}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            </>
          )}

          <CreateEmailerModal
            open={open}
            onClose={handleClose}
            setOpen={setOpen}
            refetchEmailer={refetchEmailer}
            emailerData={emailerData}
            emailPreDraft={emailPreDraft}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
