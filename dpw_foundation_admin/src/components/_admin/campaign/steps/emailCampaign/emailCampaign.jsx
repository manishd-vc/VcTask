'use client';
// mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
// api
import * as api from 'src/services';

// yup
// formik
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon, DeleteIconRed } from 'src/components/icons';
import { setCampaignData } from 'src/redux/slices/campaign';
import { setToastMessage } from 'src/redux/slices/common';
import EmailCampaignForm from './emailCampaignForm';
import PreviewEmail from './previewEmail';

EmailCampaign.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired
};

/**
 * EmailCampaign component handles the creation, deletion, and previewing of campaign email templates.
 * It uses React's state and form management with Formik to manage the campaign's email details,
 * including subject, body, recipients, and sending schedule.
 *
 * The component includes the following actions:
 * 1. Create an email template (`handleCreateEmailTemplate`).
 * 2. Delete an email template (`handleDeleteEmailTemplate`).
 * 3. Open and close email preview modal (`handleOpenPreview`, `handleClose`).
 *
 * @param {boolean} isEdit - Determines if the form is in edit mode.
 * @param {boolean} isApprove - Determines if the form is in approve mode.
 *
 * @returns {JSX.Element} The rendered EmailCampaign component with form fields and actions.
 */
export default function EmailCampaign({ isEdit, isApprove }) {
  // Extracting campaign data from Redux store
  const params = useParams();
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  // Local component state for managing modals
  const [openEmail, setOpenEmail] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  // Determine if the page is in edit mode based on URL
  const router = window.location.href;
  const isEditMode = router.includes('/edit');

  // Accessing MUI theme and dispatch function
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  // Handle opening and closing modals
  const handleClickOpen = () => setOpenEmail(true);
  const handleClose = () => {
    setFieldValue('subject', '');
    setFieldValue('emailRecipients', []);
    setFieldValue('body', '');
    setFieldValue('bannerImage', null);
    setFieldValue('sendAutomatically', false);
    setFieldValue('attachments', []);
    setFieldValue('sendOn', null);
    setOpenEmail(false);
  };
  const fetchEmailData = async (id) => {
    return await api.emailPreDraft({ entityType: 'CAMPAIGN', entityId: params?.id });
  };

  const hasValidCampaignEmail = (emailData) => {
    return emailData?.subject && emailData?.body;
  };
  // Handle email template creation and deletion
  const { values, setTouched, errors, setFieldValue } = useFormikContext();

  const { mutate: mutateEmailDelete } = useMutation('deleteEmailTemplate', api.deleteEmailTemplate, {
    onSuccess: async (response) => {
      const emailData = await fetchEmailData(params?.id);
      const hasCampaignEmail = hasValidCampaignEmail(emailData);
      setFieldValue('subject', '');
      setFieldValue('emailRecipients', []);
      setFieldValue('body', '');
      setFieldValue('bannerImage', null);
      setFieldValue('sendAutomatically', false);
      setFieldValue('attachments', []);
      setFieldValue('sendOn', null);

      dispatch(
        setCampaignData({
          ...values,
          emailId: emailData?.id || '',
          subject: emailData?.subject || '',
          body: emailData?.body || '',
          bannerFileId: emailData?.bannerFileId || '',
          sendOn: emailData?.sendOn || null,
          sendCondition: emailData?.sendCondition || '',
          sendImmidiately: emailData?.sendImmidiately || '',
          sendAutomatically: emailData?.sendAutomatically || false,
          emailRecipients:
            emailData?.emailRecipients?.map((emailInfo) => ({
              emailId: emailInfo?.emailId,
              emailGroupId: emailInfo?.emailGroupId
            })) || [],
          hasCampaignEmail: hasCampaignEmail,
          attachments: emailData?.attachments || [],
          bannerImage: emailData?.bannerFile
        })
      );

      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  });

  const { mutate: mutateEmailCreate } = useMutation('createEmailTemplate', api.createEmailTemplate, {
    onSuccess: async (response) => {
      dispatch(
        setCampaignData({
          ...values,
          hasCampaignEmail: true
        })
      );

      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      handleClose();
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  });

  // Handle creating email template after validation
  const handleCreateEmileTemplate = async () => {
    const fieldsToTouch = ['subject', 'body', 'sendOn'];
    const touchedFields = {};
    fieldsToTouch.forEach((field) => {
      if (errors[field]) {
        touchedFields[field] = true;
      }
    });
    setTouched(touchedFields, true);

    if (values.subject && values.body && values.bannerImage && values.emailRecipients) {
      if (values?.sendAutomatically && !values?.sendOn) {
        dispatch(setToastMessage({ message: 'Send On is required when send automatically', variant: 'error' }));
      } else {
        const payload = {
          id: values?.emailId || '',
          subject: values?.subject,
          body: values?.body,
          sendAutomatically: values?.sendAutomatically,
          sendOn: values?.sendOn,
          emailRecipients: values.emailRecipients,
          entityType: 'CAMPAIGN',
          entityId: params?.id,
          bannerFileId: values.bannerImage
        };
        mutateEmailCreate({ ...payload });
      }
    } else {
      dispatch(setToastMessage({ message: 'Please enter all required fields', variant: 'error' }));
    }
  };

  // Handle opening preview modal
  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  // Handle email template deletion
  const handleDeleteEmailTemplate = () => {
    const payload = {
      id: values?.emailId,
      entityType: 'CAMPAIGN',
      entityId: campaignUpdateData?.emailId
    };

    mutateEmailDelete({ ...payload });
  };

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          Create {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}Emailer
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {!isApprove && (
              <Button
                variant="contained"
                size="small"
                type="button"
                disabled={!isEdit || values.hasCampaignEmail}
                onClick={handleClickOpen}
              >
                Create Emailer
              </Button>
            )}

            {campaignUpdateData?.hasCampaignEmail && (
              <>
                <Button variant="blueLink" onClick={handleClickOpen} size="small" sx={{ ml: 2.5 }}>
                  Emailer Attached
                </Button>
                <Tooltip title="Delete" arrow>
                  <IconButton aria-label="delete" onClick={handleDeleteEmailTemplate}>
                    <DeleteIconRed />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      {openEmail && (
        <Dialog open={openEmail} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h5"
            color="primary.main"
          >
            Create Email {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}
          </DialogTitle>
          <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <EmailCampaignForm
              handleClickOpen={handleClickOpen}
              isEdit={isEdit}
              handleOpenPreview={handleOpenPreview}
            />
          </DialogContent>
          <DialogActions>
            <Stack
              gap={3}
              justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ width: '100%' }}
            >
              <Button
                variant="outlinedWhite"
                type="button"
                onClick={handleClose}
                color="primary"
                sx={{ width: { xs: '100%', sm: '50%', md: 'auto' } }}
              >
                Cancel
              </Button>
              <Button
                disabled={!isEdit}
                variant="contained"
                onClick={handleCreateEmileTemplate}
                color="primary"
                type="button"
                form="emailCampaignForm"
                sx={{ width: { xs: '100%', sm: '50%', md: 'auto' } }}
              >
                {!isEditMode ? 'Create Emailer' : 'Save'}
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      )}
      {openPreview && (
        <PreviewEmail open={openPreview} handleClose={() => setOpenPreview(false)} backOpen={handleClickOpen} />
      )}
    </>
  );
}
