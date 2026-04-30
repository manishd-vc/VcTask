import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  IconButton,
  Popover,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { DeleteIconRed } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import TableStyle from '../table.styles';

CharitablePO.propTypes = {
  // 'isLoading' is a boolean to indicate if the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'row' is an object with various properties to be validated
  row: PropTypes.shape({
    id: PropTypes.any, // Purchase order number as string
    files: PropTypes.arrayOf(PropTypes.object), // Array of file objects
    poNumber: PropTypes.string, // Purchase order number as string
    poDate: PropTypes.string, // Purchase order date as string (can be formatted)
    poDescription: PropTypes.string, // Description of the purchase order
    poValue: PropTypes.number // Value of the purchase order
  }).isRequired,

  // 'handleClickOpen' is a function to handle the opening of a modal or other action
  handleClickOpen: PropTypes.func.isRequired
};

export default function CharitablePO({ isLoading, row, handleClickOpen }) {
  const fCurrency = useCurrencyFormatter('AED');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const style = TableStyle(theme);
  //functions for the turncate file text
  const files = row?.files || [];
  const truncateFileName = (fileName = '', maxLength = 20) => {
    const [name, ext] = fileName.split(/(\.[^.]+)$/);
    return name.length > maxLength ? `${name.slice(0, maxLength)}...${ext || ''}` : fileName;
  };
  let filesText = '-';

  if (files.length === 1) {
    filesText = truncateFileName(files[0].fileName);
  } else if (files.length > 1) {
    filesText = `${truncateFileName(files[0].fileName)} +${files.length - 1} more`;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const download = (id) => {
    const payload = {
      ids: [id]
    };
    downloadAllDocuments(payload);
  };

  return (
    <TableRow hover key={row?.id}>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : row?.poNumber}
      </TableCell>
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : <>{row?.poDate ? fDateWithLocale(row?.poDate) : '-'}</>}
      </TableCell>

      <TableCell style={{ minWidth: 180 }}>{isLoading ? <Skeleton variant="text" /> : row?.poDescription}</TableCell>
      <TableCell style={{ minWidth: 80 }}>
        {isLoading ? <Skeleton variant="text" /> : <>{row?.poValue ? fCurrency(row?.poValue) : '0.00'}</>}
      </TableCell>
      <TableCell style={{ minWidth: 220 }}>
        <Typography
          variant="body1"
          color={(theme) => theme.palette.primary.light}
          onClick={handleClick}
          sx={{
            textDecoration: files.length > 0 ? '' : 'none',
            cursor: 'pointer',
            ...style.textTurncate
          }}
        >
          {filesText}
        </Typography>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{
            elevation: 8,
            sx: { boxShadow: (theme) => theme.shadows[24], maxHeight: '300px' }
          }}
        >
          <>
            {files.map((file, index) => (
              <Typography
                key={file.id}
                variant="body1"
                color={(theme) => theme.palette.text.secondarydark}
                sx={{
                  ...style.textWrap,
                  py: 1,
                  px: 3,
                  borderBottom: index !== files.length - 1 ? (theme) => `1px solid ${theme.palette.divider}` : 'none'
                }}
              >
                {truncateFileName(file.fileName, 40)}
                <IconButton
                  size="small"
                  component="a"
                  onClick={() => download(file.id)}
                  aria-label="Download Attachment"
                  color="inherit"
                >
                  <FileDownloadIcon />
                </IconButton>
              </Typography>
            ))}
          </>
        </Popover>
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} />
          ) : (
            <Tooltip arrow title="Delete" sx={{ color: 'error.main' }}>
              <IconButton onClick={handleClickOpen(row.id)}>
                <DeleteIconRed />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
