import PropTypes from 'prop-types';

// mui
import { Box, Button, Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import {
  AcceptanceLetterIcon,
  AssignToSelf,
  ICADApproved,
  ICADReject,
  ICADRequest,
  ViewIcon
} from 'src/components/icons';
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

export default function DonationPledges({ isLoading, row, handleClickOpen, donorType = 'admin', handleIcadOpen }) {
  const route = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  const style = TableStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');

  const handleAdminType = () => {
    // Same status arrays as before
    const acceptanceStatuses = [
      'AWAITING_DONOR_INFO',
      'PLEDGE_REJECTED',
      'AWAITING_DOCUMENT_CREATION',
      'AWAITING_DOCUMENT_APPROVAL',
      'DONATED',
      'ASSESSMENT_REJECTED',
      'READY_TO_DONATE',
      'DOCUMENT_REJECTED',
      'AWAITING_DOCUMENT_ACCEPTANCE',
      'DONOR_REJECTED',
      'FAILED',
      'DONATION_INITIATIVE',
      'ASSESSMENT_MORE_INFO_REQUIRED',
      'WITHDRAWN'
    ];

    const moreInfoRequiredStatuses = [
      'ASSESSMENT_MORE_INFO_REQUIRED',
      'DOCUMENT_MORE_INFO_REQUIRED',
      'DONOR_MORE_INFO_REQUIRED'
    ];

    // Simple checks - same as your original logic
    const isAcceptanceStatus = acceptanceStatuses.includes(row?.status);
    const isApprovalStatus = row?.status === 'AWAITING_APPROVAL';
    const isMoreInfoRequiredWay2 =
      moreInfoRequiredStatuses.includes(row?.status) ||
      ((row?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' || row?.status === 'DOCUMENT_MORE_INFO_REQUIRED') &&
        row?.adminHaveAllInformation);
    const isMoreInfoRequiredWay1 =
      (row?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' || row?.status === 'DOCUMENT_MORE_INFO_REQUIRED') &&
      !row?.adminHaveAllInformation;
    const shouldRedirectForApproval = isApprovalStatus && row?.assessmentFlowRequired;
    const shouldRedirectForDocumentCreation = row?.status === 'AWAITING_DOCUMENT_CREATION';
    const rowId = row?.id;

    // Define all routes in an array
    const routes = [
      {
        condition: isAcceptanceStatus && !isMoreInfoRequiredWay1 && !isMoreInfoRequiredWay2,
        path: `/admin/donor-admin/${rowId}/acceptance-letter?isView=true`
      },
      {
        condition: shouldRedirectForApproval || isMoreInfoRequiredWay1,
        path: `/admin/donor-admin/${rowId}/acceptance-letter?isView=true`
      },
      {
        condition: shouldRedirectForDocumentCreation,
        path: `/admin/donor-admin/${rowId}/acceptance-letter?isView=true`
      },
      {
        condition: isApprovalStatus && !row?.hodAssignTo,
        path: `/admin/donor-admin/${rowId}/approve`
      },
      {
        condition: moreInfoRequiredStatuses.includes(row?.status) && !row?.hodAssignTo,
        path: `/admin/donor-admin/${rowId}/acceptance-letter`
      },
      {
        condition: isMoreInfoRequiredWay1,
        path: `/admin/donor-admin/${rowId}/acceptance-letter`
      },
      {
        condition: isMoreInfoRequiredWay2,
        path: `/admin/donor-admin/${rowId}/acceptance-letter`
      }
    ];

    // Find first matching route and navigate
    const matchedRoute = routes.find((r) => r.condition);
    if (matchedRoute) {
      route.push(matchedRoute.path);
    } else {
      handleClickOpen(row.id, 'intent', row);
    }
  };

  const handleHodType = () => {
    const acceptanceStatuses = ['AWAITING_DOCUMENT_APPROVAL'];
    const viewStatuses = [
      'DOCUMENT_REJECTED',
      'DOCUMENT_MORE_INFO_REQUIRED',
      'AWAITING_DOCUMENT_APPROVAL',
      'AWAITING_DOCUMENT_ACCEPTANCE',
      'DONOR_MORE_INFO_REQUIRED',
      'DONATED'
    ];

    // Route 1: HOD approval
    if (acceptanceStatuses.includes(row?.status) && row?.hodAssignTo) {
      route.push(`/admin/donor-hod/${row?.id}/approve`);
      return;
    }

    // Route 2: View statuses
    if (viewStatuses.includes(row?.status)) {
      route.push(`/admin/donor-hod/${row?.id}/acceptance-letter?isView=true`);
      return;
    }

    // Default case
    route.push(`/admin/donor-hod/${row?.id}/view?isView=true`);
  };

  const handleView = (type) => {
    if (type === 'admin') {
      handleAdminType();
    } else if (type === 'hod') {
      handleHodType();
    }
  };

  const renderAssignSelf = () => {
    const canAssignToSelf =
      (!row?.assignTo && row?.status === 'AWAITING_PLEDGE_APPROVAL') ||
      (donorType === 'hod' && !row?.hodAssignTo && row?.status === 'AWAITING_DOCUMENT_APPROVAL');
    if (!canAssignToSelf) return null;

    return (
      <Tooltip title="Assign To Self" arrow>
        <IconButton onClick={() => handleClickOpen(row.id, 'assign', row)}>
          <AssignToSelf />
        </IconButton>
      </Tooltip>
    );
  };

  const renderLatterToolTip = () => {
    return row?.pledgeAmount < 50000 ? 'Create Acceptance Letter' : 'Create Agreement Letter';
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
  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };
  const renderIacadIcons = () => {
    if (row?.iacadRequired && row?.donationType === 'GENERAL' && donorType === 'admin' && row?.iacadApproved === null) {
      return <ICADRequest />;
    } else if (
      row?.iacadApproved === false &&
      donorType === 'admin' &&
      row?.donationType === 'GENERAL' &&
      row?.iacadRequired
    ) {
      return <ICADReject />;
    } else if (row?.iacadApproved && donorType === 'admin' && row?.donationType === 'GENERAL' && row?.iacadRequired) {
      return <ICADApproved />;
    }
  };

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
            - Download Attachment
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.donationPledgeId}</TableCell>
      <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpw_foundation_donation_type', row?.donationType) || '-'}</TableCell>
      <TableCell>{row?.eventTitle || '-'}</TableCell>
      <TableCell>{row?.pledgeAmount ? fCurrency(row?.pledgeAmount) : '0.00'}</TableCell>
      <TableCell>{row?.donationAmount ? fCurrency(row?.donationAmount) : '0.00'}</TableCell>
      {/* <TableCell>{row?.donationPayment?.paymentInstrument || '-'}</TableCell> */}
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

            {row?.iacadRequired && row?.donationType === 'GENERAL' && donorType === 'admin' && (
              <Tooltip title="IACAD Request" arrow>
                <IconButton onClick={() => handleIcadOpen(row)}>{renderIacadIcons()}</IconButton>
              </Tooltip>
            )}
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          {renderAssignSelf()}
          {row?.status === 'AWAITING_DOCUMENT_CREATION' && (
            <Tooltip title={renderLatterToolTip()} arrow>
              <IconButton onClick={() => route.push(`/admin/donor-admin/${row?.id}/acceptance-letter`)}>
                <AcceptanceLetterIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="View" arrow>
            <IconButton onClick={() => handleView(donorType)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
