import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { fDateWithLocale } from 'src/utils/formatTime';
import { DeleteIcon, ViewIcon } from '../icons';
import Scrollbar from '../Scrollbar';
import AttachDocumentDialog from './AttachDocumentDialog';

/**
 * CampaignDocumentTable Component
 *
 * A reusable table component for displaying campaign documents with actions.
 * Includes functionality to attach new documents, view, and delete existing ones.
 *
 * @param {Object} props - Component props
 * @param {Array} props.documents - Array of document objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onView - Callback for viewing a document
 * @param {Function} props.onDelete - Callback for deleting a document
 * @param {Function} props.onAttach - Callback for attaching a new document
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {string} props.title - Table title
 */
const CampaignDocumentTable = ({
  documents = [],
  isLoading = false,
  onView,
  onDelete,
  onAttach,
  showActions = true,
  title = 'CAMPAIGN DOCUMENT'
}) => {
  const theme = useTheme();
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);

  const handleAttachDocument = () => {
    setAttachDialogOpen(true);
  };

  const handleCloseAttachDialog = () => {
    setAttachDialogOpen(false);
  };

  const handleAttachSubmit = (documentData) => {
    if (onAttach) {
      onAttach(documentData);
    }
    setAttachDialogOpen(false);
  };

  const tableHeaders = [
    { label: 'Document Name', align: 'left' },
    { label: 'Purpose', align: 'left' },
    { label: 'Type', align: 'left' },
    { label: 'Upload Date', align: 'center' },
    { label: 'Uploaded By', align: 'center' },
    ...(showActions ? [{ label: 'Actions', align: 'center' }] : [])
  ];
  let tableContent;

  if (documents.length === 0) {
    // Empty state
    tableContent = (
      <TableRow>
        <TableCell
          colSpan={tableHeaders.length}
          align="center"
          sx={{
            py: 4,
            color: theme.palette.text.secondary
          }}
        >
          <Typography variant="body1">No documents attached yet</Typography>
        </TableCell>
      </TableRow>
    );
  } else {
    // Document rows
    tableContent = documents.map((document) => (
      <TableRow
        key={document.id}
        hover
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        {/* Document Name */}
        <TableCell align="left" sx={{ padding: theme.spacing(2, 1.5), maxWidth: 200 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {document.name || 'Document Name'}
          </Typography>
        </TableCell>

        {/* Purpose */}
        <TableCell align="left" sx={{ padding: theme.spacing(2, 1.5), maxWidth: 250 }}>
          <Tooltip title={document.purpose || 'Purpose of document'} arrow>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {document.purpose || 'Purpose of document'}
            </Typography>
          </Tooltip>
        </TableCell>

        {/* Type */}
        <TableCell align="left" sx={{ padding: theme.spacing(2, 1.5) }}>
          <Link
            href={document.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontSize: '14px',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {document.type || 'Document.pdf'}
          </Link>
        </TableCell>

        {/* Upload Date */}
        <TableCell align="center" sx={{ padding: theme.spacing(2, 1.5) }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {document.uploadDate ? fDateWithLocale(document.uploadDate) : '11/06/2025 09:45:AM'}
          </Typography>
        </TableCell>

        {/* Uploaded By */}
        <TableCell align="center" sx={{ padding: theme.spacing(2, 1.5) }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {document.uploadedBy || 'User'}
          </Typography>
        </TableCell>

        {/* Actions */}
        {showActions && (
          <TableCell align="center" sx={{ padding: theme.spacing(2, 1.5) }}>
            <Stack direction="row" spacing={1} justifyContent="center">
              {/* View Button */}
              <Tooltip title="View Document" arrow>
                <IconButton
                  size="small"
                  onClick={() => onView && onView(document)}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>

              {/* Delete Button */}
              <Tooltip title="Delete Document" arrow>
                <IconButton
                  size="small"
                  onClick={() => onDelete && onDelete(document)}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.error.main,
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        )}
      </TableRow>
    ));
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          border: `2px dashed ${theme.palette.primary.main}`,
          borderRadius: 2
        }}
      >
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            color="primary.main"
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>

          <Button
            variant="contained"
            onClick={handleAttachDocument}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            Attach Campaign Document *
          </Button>
        </Stack>

        {/* Table Section */}
        <TableContainer component="div" sx={{ width: '100%' }}>
          <Scrollbar>
            <Table size="medium">
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableCell
                      key={header.label}
                      align={header.align}
                      sx={{
                        backgroundColor: 'transparent',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: theme.spacing(2, 1.5)
                      }}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {isLoading
                  ? // Loading skeleton rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={tableHeaders?.label}>
                        {tableHeaders.map((_, cellIndex) => (
                          <TableCell key={tableHeaders?.label || cellIndex} align="center">
                            <Box
                              sx={{
                                height: 20,
                                backgroundColor: theme.palette.grey[200],
                                borderRadius: 1,
                                animation: 'pulse 1.5s ease-in-out infinite'
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : tableContent}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Paper>

      {/* Attach Document Dialog */}
      <AttachDocumentDialog open={attachDialogOpen} onClose={handleCloseAttachDialog} onSubmit={handleAttachSubmit} />
    </Box>
  );
};

CampaignDocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      purpose: PropTypes.string,
      type: PropTypes.string,
      fileUrl: PropTypes.string,
      uploadDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      uploadedBy: PropTypes.string
    })
  ),
  isLoading: PropTypes.bool,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onAttach: PropTypes.func,
  showActions: PropTypes.bool,
  title: PropTypes.string
};

export default CampaignDocumentTable;
