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
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { campaignStatusColorSchema } from 'src/utils/util';
import TableStyle from '../table.styles';
import CharitableTableCellWithSkeleton from './charitableTableCellWithSkeleton';
CharitablePrograms.propTypes = {
  // 'isLoading' is a boolean to indicate if the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'row' is an object with various properties to be validated
  row: PropTypes.shape({
    id: PropTypes.any, // Description of the campaign (string)
    campaignNumericId: PropTypes.string, // Description of the campaign (string)
    campaignTitle: PropTypes.string, // Description of the campaign (string)
    status: PropTypes.string, // Description of the campaign (string)
    quantityAchieved: PropTypes.number, // Quantity achieved for the program (number)
    campaignDescription: PropTypes.string, // Description of the campaign (string)
    projectCountry: PropTypes.string, // Country where the project is located (string)
    projectCity: PropTypes.string, // City where the project is located (string)
    iacadRequired: PropTypes.bool, // Boolean indicating if ICAD is required
    notes: PropTypes.string, // Notes related to the program (string)
    needInfoId: PropTypes.string, // ID for the need info (string)
    assignTo: PropTypes.arrayOf(PropTypes.string), // Array of assignees (strings)
    endDateTime: PropTypes.string, // End date and time of the program (string)
    startDateTime: PropTypes.string, // Start date and time of the program (string)
    targetQuantity: PropTypes.number // Target quantity for the program (number)
  }).isRequired
};

export default function CharitablePrograms({ isLoading, row }) {
  const router = useRouter();
  const theme = useTheme();
  const style = TableStyle(theme);
  const dispatch = useDispatch();
  const [openInfo, setOpenInfo] = useState(false);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [isView, setisView] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const [openUploadDocuments, setOpenUploadDocuments] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setisView(false);
    setOpen(false);
  };
  const openSubmenu = Boolean(anchorEl);

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
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const { masterData } = useSelector((state) => state?.common);

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
  let chipComponent = null;

  if (status === 'IACAD_REJECTED') {
    chipComponent = (
      <Chip
        color={campaignStatusColorSchema['IACAD_REJECTED']}
        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', 'IACAD_REJECTED')}
        size="small"
      />
    );
  } else if ((isNeedMoreInfo || isRejected) && row?.iacadRequired == null && row?.notes) {
    chipComponent = (
      <Tooltip
        arrow
        title={
          <>
            <Box component="span">
              {isRejected && 'Rejected '}
              {isNeedMoreInfo && 'More info requested by the assessment team - '}
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
          </>
        }
      >
        <Chip
          color={campaignStatusColorSchema[status]}
          label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', status)}
          size="small"
        />
      </Tooltip>
    );
  } else {
    chipComponent = (
      <Chip
        color={campaignStatusColorSchema[status]}
        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', status)}
        size="small"
      />
    );
  }

  return (
    <>
      <TableRow hover key={`charitable_row_${row?.campaignNumericId}`}>
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
          sx={{ minWidth: 80 }}
          isLoading={isLoading}
          content={row?.startDateTime && fDateWithLocale(row?.startDateTime, true)}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 80 }}
          isLoading={isLoading}
          content={row?.endDateTime && fDateWithLocale(row?.endDateTime, true)}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 80 }}
          isLoading={isLoading}
          content={row?.targetQuantity ?? '0'}
        />
        <CharitableTableCellWithSkeleton
          sx={{ minWidth: 80 }}
          isLoading={isLoading}
          content={row?.quantityAchieved ?? '0'}
        />

        <TableCell style={{ minWidth: 80 }}>
          <Stack flexDirection="row" alignItems="center" justifyContent="center">
            {isLoading ? <Skeleton variant="text" /> : chipComponent}
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
                {status != 'REJECTED' &&
                  status != 'COMPLETED' &&
                  checkPermissions(rolesAssign, ['fund_manage_add']) && (
                    <Tooltip title="Edit" arrow>
                      <IconButton onClick={() => router.push(`/admin/charity-operations/projects/${row?.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                {checkPermissions(rolesAssign, ['fund_manage_view', 'fund_manage_add']) && (
                  <Tooltip title="View" arrow>
                    <IconButton onClick={() => router.push(`/admin/charity-operations/projects/${row?.id}/view`)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {status !== 'REJECTED' &&
                  status !== 'CANCELLED' &&
                  checkPermissions(rolesAssign, ['fund_manage_add']) && (
                    <>
                      <Tooltip title="More Options" arrow>
                        <IconButton
                          aria-controls={openSubmenu ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openSubmenu ? 'true' : undefined}
                          onClick={handleOpenSubmenu}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
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
                          onClick={() => router.push(`/admin/charity-operations/statistics?tab=projects-statistics`)}
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
                        {status !== 'DRAFT' && (
                          <MenuItem onClick={handleOpenInfo}>
                            {/* Approval Info Icon */}

                            <Tooltip
                              arrow
                              title={
                                <>
                                  <Button
                                    onClick={handleOpenInfo}
                                    variant="text"
                                    sx={style.tooltipAttachment}
                                    aria-label="View approval Tree"
                                  >
                                    View Approval Tree
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
        </TableCell>
      </TableRow>
      {open && (
        <PostAnalysisQuestions
          open={open}
          isView={isView}
          onClose={handleClose}
          id={row?.id}
          rowData={row}
          modalType="charity"
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
