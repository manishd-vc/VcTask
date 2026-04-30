'use client';

import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import TextEditor from 'src/components/textEditor/textEditor';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { checkPermissions } from 'src/utils/permissions';

export default function DonorContentDetailPage() {
  const { id } = useParams(); // using templateCode from URL
  const router = useRouter();
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const {
    data: contentData,
    isLoading,
    refetch
  } = useQuery(['donor-content', id], () => api.getDonorContentByTemplateCode(id), {
    // select: (res) => res?.data,
    onSuccess: (data) => {
      setEditedContent(data?.content || '');
      setEditedTitle(data?.title || '');
    },
    onError: (err) => {
      dispatch(
        setToastMessage({
          message: err?.response?.data?.message || 'Failed to load content',
          variant: 'error'
        })
      );
      router.back();
    },
    enabled: !!id
  });
  const { mutate: updateContent, isLoading: isUpdating } = useMutation(
    ({ templateCode, content, title }) => api.updateDonorContent({ templateCode, content, title }),
    {
      onSuccess: () => {
        dispatch(setToastMessage({ message: 'Content updated successfully!', variant: 'success' }));
        setIsEditMode(false);
        refetch();
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Update failed',
            variant: 'error'
          })
        );
      }
    }
  );

  const handleSave = () => {
    updateContent({
      templateCode: id,
      content: editedContent,
      title: editedTitle
    });
  };

  if (isLoading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!contentData) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6">Content not found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        spacing={3}
      >
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        {!isEditMode && checkPermissions(rolesAssign, ['setting_configuration_admin_manage']) ? (
          <Button variant="contained" onClick={() => setIsEditMode(true)}>
            Edit
          </Button>
        ) : (
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </Stack>
        )}
      </Stack>
      <Typography variant="h5" mb={3} textTransform="uppercase" color="primary.main">
        SETTINGS / CONFIGURATION
      </Typography>

      <Box sx={{ bgcolor: !isEditMode ? 'white' : 'transparent' }}>
        {!isEditMode && (
          <Typography variant="h6" color="primary.main" textTransform={'uppercase'} ml={3} pt={3} component={'p'}>
            {editedTitle}
          </Typography>
        )}
        {isEditMode ? (
          <TextEditor setLatterValues={setEditedContent} latterValues={editedContent} title={editedTitle} />
        ) : (
          <Box
            sx={{ p: 3 }}
            className="contentWrapper jodit-workplace"
            dangerouslySetInnerHTML={{ __html: contentData?.content }}
          />
        )}
      </Box>
    </Box>
  );
}
