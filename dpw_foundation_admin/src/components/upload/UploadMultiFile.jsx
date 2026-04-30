import PropTypes from 'prop-types';
import React from 'react';

// mui
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, IconButton, List, ListItem, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// components
import { varFadeInRight } from '../animate';

// react dropzone
import { useDropzone } from 'react-dropzone';

/**
 * UploadMultiFile component - A customizable multi-file upload component.
 *
 * This component provides a drag-and-drop zone for users to upload multiple files (e.g., images). It supports file
 * selection through both dragging and manual selection. The component displays the selected files, allows users to remove
 * individual files, and offers a "Remove All" button to clear all files. It also features loading states with skeleton loaders
 * while files are being processed.
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.error - If true, the upload zone shows an error state.
 * @param {Array} props.files - The list of files that are currently uploaded.
 * @param {Function} props.onRemove - Function to remove an individual file from the list.
 * @param {Array} props.blob - An array of file blobs for handling image previews.
 * @param {boolean} props.isEdit - Indicates if the component is in edit mode.
 * @param {Function} props.onRemoveAll - Function to remove all uploaded files.
 * @param {boolean} props.loading - If true, a loading state is shown for the files.
 * @param {object} props.sx - Optional custom styling passed to the root container.
 *
 * @returns {JSX.Element} The rendered Multi-file upload component.
 */
const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px dashed ${theme.palette.divider}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
}));

// PropTypes for validating the props of UploadMultiFile
UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  sx: PropTypes.object,
  blob: PropTypes.array.isRequired,
  isInitialized: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
};

/**
 * UploadMultiFile - A component for handling multiple file uploads with drag-and-drop functionality.
 *
 * This component allows users to drag and drop or manually select images to upload. It displays a list of uploaded files
 * with options to remove individual files or remove all files at once. Additionally, it shows loading skeletons while
 * files are being processed or uploaded.
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.error - If true, the upload zone shows an error state.
 * @param {Array} props.files - The list of files that are currently uploaded.
 * @param {Function} props.onRemove - Function to remove an individual file from the list.
 * @param {Array} props.blob - An array of file blobs for handling image previews.
 * @param {boolean} props.isEdit - Indicates if the component is in edit mode.
 * @param {Function} props.onRemoveAll - Function to remove all uploaded files.
 * @param {boolean} props.loading - If true, a loading state is shown for the files.
 * @param {object} props.sx - Optional custom styling passed to the root container.
 *
 * @returns {JSX.Element} The rendered Multi-file upload component.
 */
export default function UploadMultiFile({ ...props }) {
  const { error, files, onRemove, blob, isEdit, onRemoveAll, loading, sx, ...other } = props;

  // Check if there are any files uploaded
  const hasFile = files.length > 0;

  // react-dropzone hook to handle file dragging and selection
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other // Spread remaining props to be passed to the dropzone
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Drop zone for dragging and selecting files */}
      <DropZoneStyle
        {...getRootProps()} // Spread the dropzone props here
        sx={{
          ...(isDragActive && { opacity: 0.72 }), // Reduce opacity when a file is dragged over the zone
          ...((isDragReject || error) && {
            color: 'error.main', // Color for error state
            borderColor: 'error.light', // Error border color
            bgcolor: 'error.lighter' // Error background color
          })
        }}
      >
        {/* Input field for selecting files */}
        <input {...getInputProps()} disabled={loading} />

        {/* Text and instructions inside the drop zone */}
        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Drop or a Select Images
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop images here or click through your machine.
          </Typography>
        </Box>
      </DropZoneStyle>

      {/* Display the list of uploaded files */}
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        {/* If loading, show skeleton loaders, otherwise display files */}
        {(loading ? [...Array(isEdit ? files.length + blob.length : blob.length)] : files).map((file) => {
          let fileUrl;

          if (!file.blob) {
            if (process.env.UPLOAD_TYPE === 'local') {
              fileUrl = process.env.BASE_URL + '/' + file?.url;
            } else {
              fileUrl = file?.url;
            }
          } else {
            fileUrl = file.blob;
          }
          return (
            <React.Fragment key={file?.id}>
              {loading ? (
                <ListItem
                  {...varFadeInRight} // Animation for fade-in
                  sx={{
                    my: 1,
                    p: 0,
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    display: 'inline-flex',
                    mx: 0.5,
                    border: (theme) => `solid 1px ${theme.palette.divider}`
                  }}
                >
                  <Skeleton variant="rectangular" width={'100%'} height={'100%'} /> {/* Skeleton loader */}
                </ListItem>
              ) : (
                <ListItem
                  {...varFadeInRight} // Animation for fade-in
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex'
                  }}
                >
                  {/* Icon to remove file */}
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)} // Call onRemove function when clicked
                    sx={{
                      p: '2px',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
                      },
                      top: 6,
                      right: 6,
                      position: 'absolute',
                      zIndex: 22222
                    }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>

                  {/* Display the image */}
                  <Paper
                    variant="outlined"
                    component="img"
                    src={fileUrl}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute'
                    }}
                  />
                </ListItem>
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* Remove all button */}
      {hasFile && (
        <Stack direction="row" justifyContent="flex-end">
          {loading ? (
            <Skeleton variant="rectangular" width={106} height={36} sx={{ mr: 1.5 }} />
          ) : (
            <Button variant="contained" onClick={onRemoveAll} sx={{ mr: 1.5 }}>
              Remove All
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
