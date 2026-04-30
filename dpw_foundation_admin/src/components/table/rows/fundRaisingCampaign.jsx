import { useRouter } from 'next-nprogress-bar';

import PropTypes from 'prop-types';

// mui
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  useTheme
} from '@mui/material';

// component
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import ApprovalTreeDialog from 'src/components/dialog/approvalTree';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import {
  AnswerReceivedIcon,
  ApprovalTree,
  EditIcon,
  GrowthIcon,
  MoreVertIcon,
  QuestionIcon,
  UploadBlackIcon,
  ViewIcon
} from 'src/components/icons';
import PostAnalysisQuestions from 'src/components/postAnalysisQuestions/postAnalysisQuestions';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { campaignStatusColorSchema } from 'src/utils/util';
import TableStyle from '../table.styles';
import CharitableTableCellWithSkeleton from './charitableTableCellWithSkeleton';

FundRaisingCampaign.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    campaignNumericId: PropTypes.string,
    campaignTitle: PropTypes.string,
    startDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    campaignTargetRequired: PropTypes.string,
    campaignTargetAchieved: PropTypes.string,
    status: PropTypes.string,
    iacadRequired: PropTypes.string,
    notes: PropTypes.string,
    needInfoId: PropTypes.string,
    assignTo: PropTypes.string,
    campaignTargetRequiredCurrency: PropTypes.string
  }).isRequired
};

export default function FundRaisingCampaign({ isLoading, row }) {
  const theme = useTheme();
  const style = TableStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const fCurrency = useCurrencyFormatter(row?.campaignTargetRequiredCurrency);
  const [openInfo, setOpenInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSubmenu = Boolean(anchorEl);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);

  const [open, setOpen] = useState(false);
  const [isView, setisView] = useState(false);
  const { masterData } = useSelector((state) => state?.common);
  const [campaignId, setCampaignId] = useState(null);
  const [openUploadDocuments, setOpenUploadDocuments] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setisView(false);
    setOpen(false);
  };

  const handleOpenSubmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSubmenu = () => {
    setAnchorEl(null);
  };

  const infoDialogOptions = [
    {
      value: 'campaignApprover',
      label: 'Campaign Approver',
      labelColor: '#FFD300',
      radioColor: '#FFD300'
    },
    {
      value: 'iacadApproval',
      label: 'IACAD Approval'
    }
  ];

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

  const status = row?.status;
  const isRejected = status === 'REJECTED';
  const isNeedMoreInfo = status === 'NEED_MORE_INFO';

  // Extract ternary expressions to reduce cognitive complexity
  const ariaControls = openSubmenu ? 'account-menu' : undefined;
  const ariaExpanded = openSubmenu ? 'true' : undefined;
  const formattedTargetRequired = row?.fundraisingTarget ? fCurrency(row?.fundraisingTarget) : '0.00';
  const formattedTargetAchieved = row?.campaignTargetAchieved ? fCurrency(row?.campaignTargetAchieved) : '0.00';

  return (
    <>
      <TableRow hover key={`fund_${row?.campaignNumericId}`}>
        <CharitableTableCellWithSkeleton
          isLoading={isLoading}
          content={row?.campaignNumericId}
          width={80}
          typographyStyle={{ textTransform: 'capitalize' }}
          variant="subtitle2"
          component="th"
          scope="row"
          noWrap={true}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 300 }}
          isLoading={isLoading}
          content={row?.campaignTitle}
          truncateLength={40}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 200 }}
          isLoading={isLoading}
          content={row?.startDateTime && fDateWithLocale(row?.startDateTime, true)}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 200 }}
          isLoading={isLoading}
          content={row?.endDateTime && fDateWithLocale(row?.endDateTime, true)}
        />
        <CharitableTableCellWithSkeleton isLoading={isLoading} content={formattedTargetRequired} />
        <CharitableTableCellWithSkeleton isLoading={isLoading} content={formattedTargetAchieved} />
        <TableCell style={{ minWidth: 80 }}>
          <Stack flexDirection="row" alignItems="center" justifyContent="center">
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              <>
                {isRejected && row?.iacadRequired ? (
                  <Chip
                    color={campaignStatusColorSchema['IACAD_REJECTED']}
                    label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', 'IACAD_REJECTED')}
                    size="small"
                  />
                ) : (
                  <>
                    {(isNeedMoreInfo || isRejected) && row?.iacadRequired == null && row?.notes ? (
                      <HtmlTooltip
                        arrow
                        title={
                          <Stack alignItems={'center'} flexWrap={'wrap'}>
                            <Box component={'span'}>
                              {isRejected && 'Rejected '}
                              {isNeedMoreInfo && 'More info requested by the assessment team -'}
                            </Box>
                            {isNeedMoreInfo && row?.needInfoId && (
                              <Button
                                onClick={() => download(row?.needInfoId)}
                                variant="text"
                                sx={style.tooltipAttachment}
                                aria-label="Download Attachment"
                              >
                                Download Attachment
                              </Button>
                            )}
                          </Stack>
                        }
                        placement="bottom"
                      >
                        <Chip
                          color={campaignStatusColorSchema[row?.status]}
                          label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status)}
                          size="small"
                        />
                      </HtmlTooltip>
                    ) : (
                      <Chip
                        color={campaignStatusColorSchema[row?.status]}
                        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status)}
                        size="small"
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* Dialog */}
            {openInfo && (
              <ApprovalTreeDialog
                open={openInfo}
                row={row?.id}
                onClose={handleCloseInfo}
                title={`APPROVAL TREE - ${row?.campaignNumericId}`}
                options={infoDialogOptions}
              />
            )}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" justifyContent="flex-end">
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
                <Skeleton variant="circular" width={34} height={34} />
              </>
            ) : (
              <>
                {!isRejected && status !== 'COMPLETED' && checkPermissions(rolesAssign, ['fund_manage_add']) && (
                  <HtmlTooltip title="Edit" arrow>
                    <IconButton onClick={() => router.push(`/admin/charity-operations/campaigns/${row?.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                  </HtmlTooltip>
                )}
                {checkPermissions(rolesAssign, ['fund_manage_view', 'fund_manage_add']) && (
                  <HtmlTooltip title="View" arrow>
                    <IconButton onClick={() => router.push(`/admin/charity-operations/campaigns/${row?.id}/view`)}>
                      <ViewIcon />
                    </IconButton>
                  </HtmlTooltip>
                )}
                {!isRejected && status !== 'CANCELLED' && checkPermissions(rolesAssign, ['fund_manage_add']) && (
                  <>
                    <HtmlTooltip title="More Options" arrow>
                      <IconButton
                        aria-controls={ariaControls}
                        aria-haspopup="true"
                        aria-expanded={ariaExpanded}
                        onClick={handleOpenSubmenu}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </HtmlTooltip>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={openSubmenu}
                      onClose={handleCloseSubmenu}
                      onClick={handleCloseSubmenu}
                    >
                      <MenuItem
                        onClick={() => {
                          setisView(false);
                          handleOpen();
                        }}
                      >
                        <QuestionIcon /> &nbsp; Prepare Post Analysis Questions
                      </MenuItem>
                      {row?.analysisReportStatus === 'COMPLETED' && (
                        <MenuItem
                          onClick={() => {
                            setisView(true);
                            handleOpen();
                          }}
                        >
                          <AnswerReceivedIcon /> &nbsp; View Post Analysis Questions Report
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => router.push(`/admin/charity-operations/statistics?tab=campaign-statistics`)}
                      >
                        <GrowthIcon /> &nbsp; View Project Statistics
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCampaignId(row?.id);
                          setOpenUploadDocuments(true);
                        }}
                      >
                        <UploadBlackIcon /> &nbsp; Upload Documents
                      </MenuItem>
                      {row?.status !== 'DRAFT' && (
                        <MenuItem onClick={handleOpenInfo}>
                          <Tooltip
                            arrow
                            title={
                              <>
                                <Box component={'span'}>{`Awaiting for approval from ${row?.assignToName} - `}</Box>
                                <Button
                                  onClick={handleOpenInfo}
                                  variant="text"
                                  sx={style.tooltipAttachment}
                                  aria-label="View approval Tree"
                                >
                                  View approval Tree
                                </Button>
                              </>
                            }
                          >
                            <Stack flexDirection={'row'} alignItems={'center'}>
                              <ApprovalTree /> &nbsp; View Approval Tree
                            </Stack>
                          </Tooltip>
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                )}
              </>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      {open && (
        <PostAnalysisQuestions
          isView={isView}
          open={open}
          onClose={handleClose}
          id={row?.id}
          rowData={row}
          modalType="campaign"
        />
      )}
      {/* Upload Documents Dialog */}
      {openUploadDocuments && (
        <UploadDocuments
          open={openUploadDocuments}
          onClose={() => setOpenUploadDocuments(false)}
          targetEntityId={campaignId}
        />
      )}
    </>
  );
}
