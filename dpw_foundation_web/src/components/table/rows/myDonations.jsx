// File: DonationPledges.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// mui
import { Box, Button, Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip, useTheme } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useMutation } from 'react-query';
import GeneralDialog from 'src/components/_admin/my-donations/generalDialog';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import { DonateIcon, DownloadLetterIcon, EditIcon, ViewIcon, Withdraw } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { donorStatusColorSchema } from 'src/utils/util';
import TableStyle from '../table.styles';
// component

DonationPledges.propTypes = {
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

export default function DonationPledges({ isLoading, row, handleClickOpen, refetch }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const style = TableStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

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

  const { mutate: downloadDonationReceipt } = useMutation('downloadDonationReceipt', api.downloadDonationReceipt, {
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'donation-receipt.pdf'); // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      console.log('error', error);
      dispatch(setToastMessage({ message: error?.response?.data?.message || 'Download failed.', variant: 'error' }));
    }
  });

  const download = (id) => {
    const payload = {
      ids: [id]
    };
    downloadAllDocuments(payload);
  };

  const downloadReceipt = (donationPledgeId) => {
    downloadDonationReceipt(donationPledgeId);
  };

  const isEdit = ['AWAITING_DONOR_INFO', 'ASSESSMENT_MORE_INFO_REQUIRED'];

  const assessmentMoreInfoRequired = row?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' && row?.adminHaveAllInformation;

  const rejectedStatuses = [
    'DONOR_REJECTED',
    'PLEDGE_REJECTED',
    'ASSESSMENT_REJECTED',
    'ASSESSMENT_IACAD_REJECTED',
    'DOCUMENT_REJECTED'
  ];
  const showTooltip = rejectedStatuses.includes(row?.status);

  const moreInfoRequiredStatuses = [
    'DONOR_MORE_INFO_REQUIRED',
    'ASSESSMENT_MORE_INFO_REQUIRED',
    'DOCUMENT_MORE_INFO_REQUIRED'
  ];
  const showMoreInfoRequiredTooltip = moreInfoRequiredStatuses.includes(row?.status);

  const getContent = (row) => {
    return (
      <Stack alignItems={'center'} flexWrap={'wrap'}>
        <Box component={'span'}>{row?.assessmentNotes || row?.hodNotes || row?.notes}</Box>
        {(row?.assessmentNeedInfoId || row?.hodNeedInfoId || row?.needInfoId || row?.adminNeedInfoId) && (
          <Button
            onClick={() =>
              download(row?.assessmentNeedInfoId || row?.hodNeedInfoId || row?.needInfoId || row?.adminNeedInfoId)
            }
            variant="text"
            sx={style.tooltipAttachment}
            aria-label="Download Attachment"
          >
            Download Attachment
          </Button>
        )}
      </Stack>
    );
  };

  const showDonationIcon =
    row?.status === 'READY_TO_DONATE' ||
    (!row?.onSpotDonation && row?.status === 'FAILED') ||
    (row?.onSpotDonation && row?.paymentThrough === 'PAYMENT-LINK' && row?.status === 'FAILED');

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.donationPledgeId}</TableCell>
        <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
        <TableCell>{getLabelByCode(masterData, 'dpw_foundation_donation_type', row?.donationType) || '-'}</TableCell>
        <TableCell>{row?.eventTitle || '-'}</TableCell>
        <TableCell>{row?.pledgeAmount ? fCurrency(row?.pledgeAmount) : '0.00'}</TableCell>
        <TableCell>{row?.donationAmount ? fCurrency(row?.donationAmount) : '0.00'}</TableCell>
        <TableCell>
          {getLabelByCode(
            masterData,
            'dpw_foundation_donation_instrument',
            row?.donationPaymentResponse?.paymentInstrument
          ) || '-'}
        </TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <>
              {(() => {
                const chip = (
                  <Chip
                    color={donorStatusColorSchema[row?.status]}
                    label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
                    size="small"
                  />
                );

                if (showTooltip) {
                  return (
                    <HtmlTooltip arrow title={row?.notes || '-'}>
                      {chip}
                    </HtmlTooltip>
                  );
                }

                if (showMoreInfoRequiredTooltip) {
                  return (
                    <HtmlTooltip arrow title={getContent(row)}>
                      {chip}
                    </HtmlTooltip>
                  );
                }

                return chip;
              })()}
            </>
          )}
        </TableCell>

        <TableCell>
          {row?.status === 'AWAITING_DOCUMENT_ACCEPTANCE' ? (
            <Tooltip title="View" arrow>
              <IconButton onClick={() => router.push(`/user/my-donations/${row?.id}/accept`)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="View" arrow>
              <IconButton onClick={() => router.push(`/user/my-donations/${row?.id}/view`)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
          {isEdit.includes(row?.status) && !assessmentMoreInfoRequired && (
            <Tooltip title="Edit" arrow>
              <IconButton onClick={() => router.push(`/user/my-donations/${row?.id}/edit`)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {row?.status === 'AWAITING_PLEDGE_APPROVAL' && (
            <Tooltip title="Withdraw" arrow>
              <IconButton onClick={() => setWithdrawDialogOpen(true)}>
                <Withdraw />
              </IconButton>
            </Tooltip>
          )}
          {showDonationIcon && (
            <Tooltip title="Donate" arrow>
              <IconButton onClick={() => handleClickOpen(row, 'donate')}>
                <DonateIcon />
              </IconButton>
            </Tooltip>
          )}
          {row?.status === 'DONATED' && (
            <Tooltip title="Download Receipt" arrow>
              <IconButton onClick={() => downloadReceipt(row?.donationPledgeId)}>
                <DownloadLetterIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>

      {/* Withdraw confirmation dialog */}
      <GeneralDialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
        row={row}
        refetch={refetch}
        textTitle={'Are you sure you want to withdraw pledge request?'}
        type={'donor'}
        endpoint="withDraw"
        btnTitle={'Withdraw'}
      />
    </>
  );
}
