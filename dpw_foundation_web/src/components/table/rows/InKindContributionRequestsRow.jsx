import { Chip, IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/_admin/my-donations/generalDialog';
import { DeleteIconRed, EditIcon, ViewIcon, Withdraw } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as beneficiaryApi from 'src/services/beneficiary';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getBeneficiaryStatus } from 'src/utils/getBeneficiaryStatus';
import { inKindContributionStatusColorSchema } from 'src/utils/util';

InKindContributionRequestsRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func,
  row: PropTypes.shape({
    inKindContributionRequestId: PropTypes.string,
    id: PropTypes.string,
    inKindContributionRequestTitle: PropTypes.string,
    assistanceRequested: PropTypes.string,
    requestNature: PropTypes.string,
    dateOfContribution: PropTypes.string,
    valueOfDonation: PropTypes.number,
    valueOfInKind: PropTypes.number,
    status: PropTypes.string
  }).isRequired
};
const isEditStatus = ['FEEDBACK_REQUESTED'];

export default function InKindContributionRequestsRow({ isLoading, row, refetch }) {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const router = useRouter();
  const isShowEdit = isEditStatus.includes(row?.status) || row?.status === 'DRAFT';
  const handleEdit = () => {
    dispatch(resetStep());
    router.push(`/user/in-kind-contribution/${row?.id}/update`);
  };
  const { mutate: withdrawMutate } = useMutation(
    'withdrawInKindContribution',
    ({ id, payload }) => beneficiaryApi.withdrawInKindContribution(id, payload),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message || 'Request withdrawn successfully', variant: 'success' }));
        refetch?.();
        setWithdrawDialogOpen(false);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response?.data?.message || 'Withdrawal failed', variant: 'error' }));
      }
    }
  );
  const { mutate: deleteMutate } = useMutation(
    'deleteInKindContribution',
    ({ id, payload }) => beneficiaryApi.deleteInKindContribution(id, payload),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message || 'Request deleted successfully', variant: 'success' }));
        refetch?.();
        setWithdrawDialogOpen(false);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response?.data?.message || 'Delete failed', variant: 'error' }));
      }
    }
  );
  const canWithdraw = row?.status === 'IN_PROGRESS_ASSESSMENT' && !row?.assignTo;

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.contributionUniqueId || '-'}</TableCell>
        <TableCell>{row?.requestTitle || '-'}</TableCell>
        <TableCell>{row?.assistanceRequested || '-'}</TableCell>
        <TableCell>{row?.requestNature || '-'}</TableCell>
        <TableCell>
          {row?.expectedDateContribution ? fDateWithLocale(row?.expectedDateContribution, true) : '-'}
        </TableCell>
        <TableCell>{row?.valueOfDonation ? fCurrency(row?.valueOfDonation) : '0.00'}</TableCell>
        <TableCell>{row?.valueOfInKind ? fCurrency(row?.valueOfInKind) : '0.00'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={
                row?.feedbackStatus === 'FEEDBACK_REQUESTED' && row?.status !== 'REJECTED'
                  ? 'info'
                  : inKindContributionStatusColorSchema[row?.status]
              }
              label={getBeneficiaryStatus(masterData, row?.status, row?.feedbackStatus)}
              size="small"
            />
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
            <IconButton onClick={() => router.push(`/user/in-kind-contribution/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {canWithdraw && (
            <Tooltip title="Withdraw" arrow>
              <IconButton onClick={() => setWithdrawDialogOpen(true)}>
                <Withdraw />
              </IconButton>
            </Tooltip>
          )}
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
        </TableCell>
      </TableRow>

      <GeneralDialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
        row={row}
        refetch={refetch}
        textTitle={
          dialogType === 'delete'
            ? 'Are you sure you want to delete this In-Kind Contribution request?'
            : 'Are you sure you want to withdraw this In-Kind Contribution request?'
        }
        btnTitle={dialogType === 'delete' ? 'Delete' : 'Withdraw'}
        onSubmit={(row) => {
          const payload = { id: [row.id] };
          if (dialogType === 'delete') {
            deleteMutate({ id: row.id, payload });
          } else {
            withdrawMutate({ id: row.id, payload });
          }
        }}
      />
    </>
  );
}
