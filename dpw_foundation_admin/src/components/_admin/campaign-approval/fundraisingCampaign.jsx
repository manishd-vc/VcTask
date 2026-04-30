'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// component
import { Dialog } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import FundRaisingCampaignApproval from 'src/components/table/rows/fundRaisingCampaignApproval';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';
import IcadApprovalForm from './icadApprovalForm';
import IcadApprovalViewer from './icadApprovalViewer';
/**
 * Table header configuration for the Fundraising Campaign table
 *
 * Defines the columns for the campaign table along with their sorting capabilities and alignment.
 *
 * @constant {Array} TABLE_HEAD - The configuration object for table headers.
 * @property {string} id - The unique identifier for each column.
 * @property {string} label - The display name of the column.
 * @property {boolean} alignRight - Indicates if the column should be aligned to the right.
 * @property {boolean} sort - Indicates if sorting is enabled for this column.
 */
const TABLE_HEAD = [
  { id: 'campaignNumericId', label: 'Campaign ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Campaign Name', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'campaignTargetRequired', label: 'Target Amount', alignRight: false, sort: true },
  { id: 'campaignTargetAchieved', label: 'Target Achieved', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

/**
 * FundraisingCampaign component
 *
 * This component handles the display and interaction of fundraising campaign data, including approval actions.
 *
 * @component
 * @example
 * return <FundraisingCampaign />;
 */
export default function FundraisingCampaign({ isSupervisor }) {
  const dispatch = useDispatch();
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state.common);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const tabParam = searchParams.get('tab');
  const statusParams = searchParams.get('status');
  const sizeParams = searchParams.get('rowsPerPage');

  // Local state hooks to manage table data and modal states
  const [id, setId] = useState(null);
  const [row, setRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [toDate, setToDate] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const [openApproval, setOpenApproval] = useState(false);
  const [openIacadViewer, setOpenIacadViewer] = useState(false);
  const [status, setStatus] = useState([]);
  const apiType = isSupervisor ? 'complete' : 'approval';
  // Fetch campaign statuses on component mount
  useEffect(() => {
    const filterOption = getLabelObject(masterData, 'dpw_foundation_campaign_status');
    const statusOptions =
      filterOption?.values
        .map((item) => ({
          id: item.code,
          name: item.description
        }))
        .filter((item) => item.id !== 'DRAFT') || []; // Exclude the 'DRAFT' status
    setStatus(statusOptions);
  }, [masterData]);

  /**
   * Mutate function to handle campaign approval
   *
   * This function is used to approve or reject a campaign request based on the approval status.
   * It triggers a toast message upon success or failure.
   */
  const { mutate: mutateApprove, isLoading: approveLoading } = useMutation(api.iacadApproveCampaignByAdmin, {
    onSuccess: async () => {
      if (approvalStatus === 'IACAD_REJECTED') {
        dispatch(
          setToastMessage({
            message: 'Campaign request has been rejected by IACAD',
            title: 'Request Rejected',
            variant: 'error'
          })
        );
      } else {
        dispatch(
          setToastMessage({
            message: `Campaign request has been approved by IACAD`,
            title: 'Request Approved',
            variant: 'success'
          })
        );
      }
      refetch();
      handleCloseApproval();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Handles opening of approval modal
   */
  const handleClickOpenApproval = () => {
    setOpenApproval(true);
  };

  /**
   * Handles closing of approval modal
   */
  const handleCloseApproval = () => {
    setOpenApproval(false);
  };

  /**
   * Handles opening of viewer modal
   */
  const handleClickOpenViewer = () => {
    setOpenIacadViewer(true);
  };

  /**
   * Handles closing of viewer modal
   */
  const handleCloseViewer = () => {
    setOpenIacadViewer(false);
  };

  /**
   * Handles campaign approval process
   *
   * @param {Object} values - The values associated with the approval.
   * @param {string} values.approvalStatus - The approval status of the campaign.
   * @param {string} values.iacadRequestId - The IACAD request ID.
   * @param {string} values.iacadPermitId - The IACAD permit ID.
   * @param {Date} values.responseDate - The response date for the approval.
   */
  const handleApproval = (values) => {
    setApprovalStatus(values.approvalStatus);
    mutateApprove({
      slug: id,
      iacadRequestId: values.iacadRequestId,
      iacadPermitId: values.iacadPermitId,
      approvalStatus: values.approvalStatus,
      responseDate: format(values.responseDate, "yyyy-MM-dd'T'HH:mm:ss")
    });
  };

  /**
   * Fetches campaign data based on various query parameters
   *
   * This query fetches the campaign data based on the user's search criteria and updates the table rows.
   */
  const { isLoading, isFetching, refetch } = useQuery(
    ['campaign', pageParam, searchParam, sizeParams, statusParams, tabParam, fromDate, toDate, isSupervisor],
    () =>
      api.getCampaignApprovalByAdminsByAdmin({
        page: +pageParam || 1,
        size: +sizeParams || 10,
        search: searchParam || '',
        type: 'FUNDCAMP',
        status: statusParams,
        fromDate: fromDate ? fDateShortYear(fromDate) : '',
        toDate: toDate ? fDateShortYear(toDate) : '',
        apiPath: apiType
      }),
    {
      onSuccess: (data) => {
        const rows = data?.data?.content;
        const count = data?.data?.totalPages;
        const totalElements = data?.data?.totalElements;
        setTableRows({
          count: count,
          data: rows,
          totalElements: totalElements
        });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  /**
   * Opens the appropriate modal based on the type of action
   *
   * @param {string} prop - The ID of the campaign.
   * @param {string} type - The type of action (e.g., 'icadapprove', 'assign', 'icadview').
   * @param {Object|null} row - The data of the selected row (optional).
   */
  const handleClickOpen = (prop, type, row = null) => {
    setId(prop);
    setRow(row);
    if (type === 'icadapprove') {
      handleClickOpenApproval();
    } else if (type === 'assign') {
      setOpen(true);
    } else if (type === 'icadview') {
      handleClickOpenViewer();
    }
  };

  /**
   * Closes the modal
   */
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate } = useMutation('export-campaign-approval', api.exportCampaignApprovalByAdminsByAdmin, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateSupervisor } = useMutation('export-campaign-approval', api.exportCampaignApprovalBySupervisor, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      page: +pageParam || 1,
      rows: +sizeParams || 10,
      sort: 'campaignTitle',
      type: 'FUNDCAMP',
      search: searchParam || '',
      status: statusParams,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      curentUserId: user?.userId
    };
    if (isSupervisor) {
      mutateSupervisor(obj);
    } else {
      mutate(obj);
    }
  };
  // Component JSX rendering and other logic goes here...

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <GeneralDialog
          onClose={handleClose}
          id={id}
          refetch={refetch}
          endPoint="assignCampaignByAdmin"
          type={'Campaign assigned'}
          deleteMessage={
            'By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action.'
          }
          dialogTitle={'Campaign Ownership'}
          btnTitle={'Yes'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={FundRaisingCampaignApproval}
        setId={setId}
        id={setId}
        isSearch
        totalCountText={`All Campaigns`}
        allCount={tableRows?.totalElements}
        handleClickOpen={handleClickOpen}
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        isExport={true}
        onExport={onExport}
        isSupervisor={isSupervisor}
        refetch={refetch}
      />
      <IcadApprovalForm
        open={openApproval}
        onClose={handleCloseApproval}
        onSubmit={handleApproval}
        isLoading={approveLoading}
        type={'fund'}
      />

      <IcadApprovalViewer open={openIacadViewer} onClose={handleCloseViewer} type={'fund'} row={row} />
    </>
  );
}
