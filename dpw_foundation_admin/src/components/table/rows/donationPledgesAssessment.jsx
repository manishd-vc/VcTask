import PropTypes from 'prop-types';

// mui
import { Box, Button, Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import { AssignToSelf, ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { donorStatusColorSchema } from 'src/utils/util';
import TableStyle from '../table.styles';
// component

DonationPledgesAssessment.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    donationPledgeId: PropTypes.string, // ID for the need info (string),
    createdOn: PropTypes.string, // ID for the need info (string),
    status: PropTypes.string, // ID for the need info (string),
    assignTo: PropTypes.string, // ID for the need info (string),
    eventTitle: PropTypes.string, // ID for the need info (string),
    donationAmount: PropTypes.string, // ID for the need info (string),
    donationPayment: PropTypes.shape({
      paymentInstrument: PropTypes.string // ID for the need info (string),
    }).isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

export default function DonationPledgesAssessment({ isLoading, row, handleClickOpen, donorType }) {
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const dispatch = useDispatch();
  const style = TableStyle(theme);
  const fCurrency = useCurrencyFormatter('AED');
  const route = useRouter();

  const viewStatuses = [
    'ASSESSMENT_MORE_INFO_REQUIRED',
    'ASSESSMENT_REJECTED',
    'READY_TO_DONATE',
    'AWAITING_DOCUMENT_CREATION',
    'AWAITING_DOCUMENT_ACCEPTANCE',
    'AWAITING_DOCUMENT_APPROVAL',
    'DONATED'
  ];

  const renderSelfIcon = () => {
    return (
      !row?.assessmentAssignTo &&
      row?.status === 'AWAITING_APPROVAL' && (
        <Tooltip title="Assign To Self" arrow>
          <IconButton onClick={() => handleClickOpen(row?.id, 'assign', row)}>
            <AssignToSelf />
          </IconButton>
        </Tooltip>
      )
    );
  };
  const renderViewIcon = () => {
    let routingUrl = ``;
    if ((!row?.assessmentAssignTo && row?.status === 'AWAITING_APPROVAL') || viewStatuses.includes(row?.status)) {
      routingUrl = `/admin/donor-assessment/${row?.id}/acceptance-letter?isView=true`;
    } else {
      routingUrl = `/admin/donor-assessment/${row?.id}/approve`;
    }
    return (
      <Tooltip title="View" arrow>
        <IconButton
          onClick={() => {
            route.push(routingUrl);
          }}
        >
          <ViewIcon />
        </IconButton>
      </Tooltip>
    );
  };
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
  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
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

  return (
    <TableRow hover key={`donation_pldeget_${row?.donationPledgeId}`}>
      <TableCell>{row?.donationPledgeId}</TableCell>
      <TableCell>{row?.createdOn && fDateWithLocale(row?.createdOn, true)}</TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpw_foundation_donation_type', row?.donationType) || '-'}</TableCell>
      <TableCell>{row?.eventTitle || '-'}</TableCell>
      <TableCell>{row?.pledgeAmount && fCurrency(row?.pledgeAmount)}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Stack flexDirection="row" justifyContent="center" alignItems="center" gap={1}>
            {showTooltip ? (
              <HtmlTooltip arrow title={row?.notes || '-'}>
                <Chip
                  color={donorStatusColorSchema[row?.status]}
                  label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
                  size="small"
                />
              </HtmlTooltip>
            ) : (
              <>
                {showMoreInfoRequiredTooltip ? (
                  <HtmlTooltip arrow title={getContent(row)}>
                    <Chip
                      color={donorStatusColorSchema[row?.status]}
                      label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
                      size="small"
                    />
                  </HtmlTooltip>
                ) : (
                  <Chip
                    color={donorStatusColorSchema[row?.status]}
                    label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
                    size="small"
                  />
                )}
              </>
            )}
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          {renderSelfIcon()}
          {renderViewIcon()}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
