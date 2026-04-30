import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';

import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';
import { approvalStatusColorSchema, getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
/**
 * ApprovalTreeDialog - A dialog component that displays the approval tree for a campaign.
 * It shows the statuses and approval steps, with specific conditions for "Campaign Approver" and "IACAD Approval."
 *
 * @param {object} props - The props for the component.
 * @param {boolean} props.open - Whether the dialog is open or not.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {string} props.title - The title to display in the dialog.
 * @param {object} props.row - The row data containing status and other conditions for the approval process.
 * @returns {JSX.Element} - The ApprovalTreeDialog component.
 */
const ApprovalTreeDialog = ({ open, onClose, title, row }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const { data } = useQuery(['campaign-approval', row], () => api.getApprovalTree(row), {
    enabled: !!row // don't fetch unless we have an ID
  });
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {title}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ paddingBottom: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row) => {
                const statusColor = approvalStatusColorSchema[row.status] || 'default';
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      {getLabelByCode(masterData, 'dpw_foundation_capproval_tree_role', row.roleKey) || '-'}
                    </TableCell>
                    <TableCell>{row.createdByName || '-'}</TableCell>
                    <TableCell>{row.content || '-'}</TableCell>
                    <TableCell>
                      {getLabelByCode(masterData, 'dpw_foundation_campaign_approval_tree', row.status) ? (
                        <Chip
                          label={getLabelByCode(masterData, 'dpw_foundation_campaign_approval_tree', row.status)}
                          color={statusColor}
                          size="small"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{(row.createdOn && fDateWithLocale(row.createdOn, false)) || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

ApprovalTreeDialog.propTypes = {
  // 'open' is a boolean indicating if the dialog is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a function to handle closing the dialog
  onClose: PropTypes.func.isRequired,

  // 'title' is a string for the dialog's title
  title: PropTypes.string.isRequired,

  // 'row' is an object that contains additional properties
  row: PropTypes.shape({
    // 'status' is a string that indicates the status of the row
    status: PropTypes.string.isRequired,

    // 'iacadRequired' is a boolean indicating if the iacad field is required
    iacadRequired: PropTypes.bool.isRequired
  }).isRequired
};

export default ApprovalTreeDialog;
