'use client';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// mui
import { Chip, IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import GeneralDialog from 'src/components/_admin/my-donations/generalDialog';
import { DeleteIconRed, EditIcon, SignDocumentIcon, ViewIcon, Withdraw } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { resetStep } from 'src/redux/slices/stepper';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getGrantStatus } from 'src/utils/getGrantStatus';
import { grantStatusColorSchema } from 'src/utils/util';
// component

GrantPledges.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleClickOpen: PropTypes.func,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    donationPledgeId: PropTypes.string,
    createdOn: PropTypes.string,
    eventTitle: PropTypes.string,
    donationAmount: PropTypes.string,
    status: PropTypes.string
  }).isRequired
};

const isEditStatus = ['FEEDBACK_REQUESTED_SEEKER'];

export default function GrantPledges({ isLoading, row, refetch }) {
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const router = useRouter();
  const dispatch = useDispatch();
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const isShowEdit = isEditStatus.includes(row?.status) || row?.status === 'DRAFT';
  const handleEdit = () => {
    dispatch(resetStep());
    router.push(`/user/my-grants/${row?.id}/update`);
  };

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.grantUniqueId}</TableCell>
        <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
        <TableCell>{row?.grantSeekerName}</TableCell>
        <TableCell>{row?.assistanceType || '-'}</TableCell>
        <TableCell>{row?.amountRequested ? fCurrency(row?.amountRequested) : '0.00'}</TableCell>
        <TableCell>{row?.amountGranted ? fCurrency(row?.amountGranted) : '0.00'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <>
              {(() => {
                const chip = (
                  <Chip
                    color={row?.feedbackStatus === 'FEEDBACK_REQUESTED' ? 'info' : grantStatusColorSchema[row?.status]}
                    label={getGrantStatus(masterData, row?.status, row?.feedbackStatus)}
                    size="small"
                  />
                );

                return chip;
              })()}
            </>
          )}
        </TableCell>

        <TableCell>
          {isShowEdit && (
            <Tooltip title="Edit" arrow>
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View" arrow>
            <IconButton onClick={() => router.push(`/user/my-grants/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {row?.status === 'DRAFT' && (
            <Tooltip title="Delete" arrow>
              <IconButton
                onClick={() => {
                  setDialogType('delete');
                  setWithdrawDialogOpen(true);
                }}
              >
                <DeleteIconRed />
              </IconButton>
            </Tooltip>
          )}

          {row?.status === 'IN_PROGRESS_ASSESSMENT' && row?.assignTo === null && (
            <Tooltip title="Withdraw" arrow>
              <IconButton
                onClick={() => {
                  setDialogType('withdraw');
                  setWithdrawDialogOpen(true);
                }}
              >
                <Withdraw />
              </IconButton>
            </Tooltip>
          )}
          {row?.status === 'IN_PROGRESS_SEEKER' && (
            <Tooltip title="Sign the Document" arrow>
              <IconButton onClick={() => router.push(`/user/my-grants/${row?.id}/sign-document`)}>
                <SignDocumentIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <GeneralDialog
        open={withdrawDialogOpen}
        onClose={() => {
          setWithdrawDialogOpen(false);
          setDialogType(null);
        }}
        row={row}
        refetch={refetch}
        textTitle={
          dialogType === 'delete'
            ? 'Are you sure you want to Delete grant request?'
            : 'Are you sure you want to withdraw grant request?'
        }
        endpoint={dialogType === 'delete' ? 'grantDelete' : 'grantWithDraw'}
        btnTitle={dialogType === 'delete' ? 'Delete' : 'Withdraw'}
      />
    </>
  );
}
