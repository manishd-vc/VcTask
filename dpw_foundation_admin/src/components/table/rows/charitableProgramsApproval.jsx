import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import {
  Box,
  Button,
  Chip,
  Dialog,
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
import GeneralDialog from 'src/components/dialog/approval';
import ApprovalTreeDialog from 'src/components/dialog/approvalTree';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import {
  ApprovalTree,
  AssignToSelf,
  CompleteIcon,
  ICADApproved,
  ICADReject,
  ICADRequest,
  MoreVertIcon,
  QuestionAnswerIcon,
  UploadBlackIcon,
  ViewIcon
} from 'src/components/icons';
import PostAnalysisQuestions from 'src/components/postAnalysisQuestions/postAnalysisQuestions';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { campaignStatusColorSchema } from 'src/utils/util';
import TableStyle from '../table.styles';
import CharitableTableCellWithSkeleton from './charitableTableCellWithSkeleton';

CharitableProgramsApproval.propTypes = {
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
    assignToName: PropTypes.arrayOf(PropTypes.string), // Array of assignees (strings)
    endDateTime: PropTypes.string, // End date and time of the program (string)
    startDateTime: PropTypes.string, // Start date and time of the program (string)
    targetQuantity: PropTypes.number, // Target quantity for the program (number)
    campaignInKindContributions: PropTypes.string, // Start date and time of the program (string)
    aemNumber: PropTypes.string // Start date and time of the program (string)
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  isSupervisor: PropTypes.bool.isRequired
};

export default function CharitableProgramsApproval({ isLoading, row, handleClickOpen, isSupervisor, refetch }) {
  const theme = useTheme();
  const style = TableStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const [openInfo, setOpenInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  const { masterData } = useSelector((state) => state?.common);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSubmenu = Boolean(anchorEl);
  const [campaignId, setCampaignId] = useState(null);
  const [openUploadDocuments, setOpenUploadDocuments] = useState(false);

  const handleOpenSubmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSubmenu = () => {
    setAnchorEl(null);
  };
  const status = row?.status;
  const isRejected = status === 'REJECTED';
  const isNeedMoreInfo = status === 'NEED_MORE_INFO';
  const ariaControls = openSubmenu ? 'account-menu' : undefined;
  const ariaExpanded = openSubmenu ? 'true' : undefined;

  const infoDialogOptions = [
    {
      label: 'Campaign Approver',
      labelColor: '#FFD300',
      radioColor: '#FFD300',
      value: 'APPROVE'
    },
    {
      label: 'IACAD Approval',
      value: 'ICADAPPROVE'
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
  let statusChip = null;

  if (isRejected && row?.iacadRequired) {
    statusChip = (
      <Chip
        color={campaignStatusColorSchema['IACAD_REJECTED']}
        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', 'IACAD_REJECTED')}
        size="small"
      />
    );
  } else if ((isNeedMoreInfo || isRejected) && row?.iacadRequired == null && row?.notes) {
    statusChip = (
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
          color={campaignStatusColorSchema[row?.status]}
          label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status)}
          size="small"
        />
      </Tooltip>
    );
  } else {
    statusChip = (
      <Chip
        color={campaignStatusColorSchema[row?.status]}
        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status)}
        size="small"
      />
    );
  }

  return (
    <>
      <TableRow hover key={`charitable_approval_${row?.campaignNumericId}`}>
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
          sx={{ minWidth: 80 }}
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

        <TableCell style={{ minWidth: 150 }}>
          {isLoading ? <Skeleton variant="text" /> : statusChip}
          {row?.status == 'IACAD_REQUEST' && (
            <>
              <IconButton onClick={() => handleClickOpen(row.id, 'icadapprove')}>
                <ICADRequest />
              </IconButton>
            </>
          )}
          {row?.status == 'APPROVED' && row?.iacadRequired && (
            <IconButton onClick={() => handleClickOpen(row.id, 'icadview', row)}>
              <ICADApproved />
            </IconButton>
          )}

          {row?.status == 'REJECTED' && row?.iacadRequired && (
            <IconButton onClick={() => handleClickOpen(row.id, 'icadview', row)}>
              <ICADReject />
            </IconButton>
          )}

          {isSupervisor && row?.status === 'COMPLETED' && (
            <Tooltip title="Question Answer" arrow>
              <IconButton onClick={() => setOpen(true)}>
                <QuestionAnswerIcon />
              </IconButton>
            </Tooltip>
          )}
          {isSupervisor && row?.status === 'ONGOING' && (
            <Tooltip title="Complete" arrow>
              <IconButton onClick={() => setOpenComplete(true)}>
                <CompleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {/* Complete Campaign Dialog*/}
          <Dialog onClose={() => setOpenComplete(false)} open={openComplete} maxWidth={'sm'}>
            <GeneralDialog
              onClose={() => setOpenComplete(false)}
              id={row?.id}
              refetch={refetch}
              endPoint="completeProjectBySupervisor"
              deleteMessage={'Are you sure you want to complete this Project ?'}
              dialogTitle={'Confirm'}
              btnTitle={'Yes'}
            />
          </Dialog>

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

        {/* <CharitableTableCellWithSkeleton
          isLoading={isLoading}
          content={row?.status !== 'APPROVED' ? '-' : row?.aemNumber || ''}
          width={80}
        /> */}

        <TableCell>
          <Stack direction="row" justifyContent="flex-end">
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
                <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
                <Skeleton variant="circular" width={34} height={34} />
              </>
            ) : (
              <>
                {!row?.assignTo && row?.status == 'PENDING_APPROVAL' && !isSupervisor && (
                  <Tooltip title="Assign To Self" arrow>
                    <IconButton onClick={() => handleClickOpen(row.id, 'assign', row)}>
                      <AssignToSelf />
                    </IconButton>
                  </Tooltip>
                )}
                {row?.status !== 'DRAFT' && (
                  <HtmlTooltip
                    arrow
                    title={
                      <>
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
                    <IconButton onClick={handleOpenInfo}>
                      <ApprovalTree />
                    </IconButton>
                  </HtmlTooltip>
                )}

                <Tooltip title="View" arrow>
                  <IconButton
                    onClick={() =>
                      router.push(
                        `/admin/charitable-administrator/${isSupervisor ? 'projects-supervisor' : 'projects-approvals'}/${row?.id}/${isSupervisor ? 'view' : 'approve'}`
                      )
                    }
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {!isRejected && (
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
                          setCampaignId(row?.id);
                          setOpenUploadDocuments(true);
                        }}
                      >
                        <UploadBlackIcon /> &nbsp; Upload Documents
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      {open && <PostAnalysisQuestions open={open} onClose={() => setOpen(false)} id={row?.id} isSuperior />}
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
