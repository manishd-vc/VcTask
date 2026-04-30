'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// api
// component
import { Dialog } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import CharitableProgramsApproval from 'src/components/table/rows/charitableProgramsApproval';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';
import AFENumberForm from './afeNumberForm';
import IcadApprovalForm from './icadApprovalForm';
import IcadApprovalViewer from './icadApprovalViewer';
/**
 * Table header configuration for the Charitable Programs table
 *
 * Defines the columns for the charitable program table along with their sorting capabilities and alignment.
 *
 * @constant {Array} TABLE_HEAD - Configuration object for table headers.
 * @property {string} id - The unique identifier for each column.
 * @property {string} label - The display name of the column.
 * @property {boolean} alignRight - Indicates if the column should be aligned to the right.
 * @property {boolean} sort - Indicates if sorting is enabled for this column.
 */
const TABLE_HEAD = [
  { id: 'campaignNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Project Name', alignRight: false, sort: true },
  // { id: 'targetQuantity', label: 'Target Quantity (In Kind)', alignRight: false, sort: true },
  // { id: 'quantityAchieved', label: 'Quantity Achieved', alignRight: false, sort: true },
  // { id: 'projectCountry', label: 'Project Country', alignRight: false, sort: true },
  // { id: 'projectCity', label: 'Sector / Pillar/focus area', alignRight: false, sort: true },
  // { id: 'campaignDescription', label: 'Project Description', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  // { id: 'aefNumber', label: 'AFE Number', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

/**
 * CharitablePrograms component
 *
 * This component handles the display and interaction of charitable program data, including approval and AFE number updates.
 *
 * @component
 * @example
 * return <CharitablePrograms />;
 */
export default function CharitablePrograms({ isSupervisor }) {
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
  const [openIacadViewer, setOpenIacadViewer] = useState(false);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const [openApproval, setOpenApproval] = useState(false);
  const [openAFENumber, setOpenAFENumber] = useState(false);
  const [status, setStatus] = useState([]);
  const apiType = isSupervisor ? 'complete' : 'approval';
  /**
   * Fetch campaign statuses on component mount
   *
   * Initializes the status list based on the campaign status schema, excluding the 'DRAFT' status.
   */
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
   * Mutation hook for approving a campaign request
   *
   * This function handles the approval or rejection of a campaign request by IACAD and triggers toast messages on success or failure.
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
            message: 'Campaign request has been approved by IACAD',
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
   * Mutation hook for updating the AFE number for a campaign
   *
   * This function handles the update of the AFE number for a campaign and triggers toast messages on success or failure.
   */
  const { mutate: mutateAFEApprove, isLoading: afeLoading } = useMutation(api.afeNumberCampaignByAdmin, {
    onSuccess: async () => {
      dispatch(setToastMessage({ message: 'AFE Number Updated', title: 'AEF Number Added', variant: 'success' }));
      refetch();
      handleCloseAFENumber();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Opens the approval modal for campaign approval
   */
  const handleClickOpenApproval = () => {
    setOpenApproval(true);
  };

  /**
   * Closes the approval modal
   */
  const handleCloseApproval = () => {
    setOpenApproval(false);
  };

  /**
   * Handles the campaign approval process
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
   * Opens the AFE number modal
   */
  const handleClickOpenAFENumber = () => {
    setOpenAFENumber(true);
  };

  /**
   * Closes the AFE number modal
   */
  const handleCloseAFENumber = () => {
    setOpenAFENumber(false);
  };

  /**
   * Opens the viewer modal for IACAD documents
   */
  const handleClickOpenViewer = () => {
    setOpenIacadViewer(true);
  };

  /**
   * Closes the viewer modal for IACAD documents
   */
  const handleCloseViewer = () => {
    setOpenIacadViewer(false);
  };

  /**
   * Handles the AFE number update process
   *
   * @param {Object} values - The values associated with the AFE number update.
   * @param {string} values.aefNumber - The new AFE number.
   * @param {number} values.fundsRequired - The funds required for the campaign.
   * @param {number} values.fundsAlloted - The funds allotted for the campaign.
   */
  const handleAFENumber = (values) => {
    mutateAFEApprove({
      slug: id,
      aefNumber: values.aefNumber,
      fundsRequired: values.fundsRequired,
      fundsAlloted: values.fundsAlloted
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
        type: 'CHARITY',
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
   * @param {string} type - The type of action (e.g., 'icadapprove', 'assign', 'icadview', 'aefnumber').
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
    } else if (type === 'aefnumber') {
      handleClickOpenAFENumber();
    }
  };

  /**
   * Closes the modal for assigning tasks or other actions
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
      type: 'CHARITY',
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

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'sm'}>
        <GeneralDialog
          onClose={handleClose}
          id={id}
          refetch={refetch}
          endPoint="assignCampaignByAdmin"
          type={'Campaign assigned'}
          deleteMessage={
            'By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action.'
          }
          dialogTitle={'Project Ownership'}
          btnTitle={'Yes'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={CharitableProgramsApproval}
        setId={setId}
        id={setId}
        isSearch
        totalCountText={`Charitable Programs`}
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
        type={'charitable'}
      />
      <AFENumberForm
        row={row}
        open={openAFENumber}
        onClose={handleCloseAFENumber}
        onSubmit={handleAFENumber}
        isLoading={afeLoading}
        type={'charitable'}
      />
      <IcadApprovalViewer open={openIacadViewer} onClose={handleCloseViewer} type={'fund'} row={row} />
    </>
  );
}
