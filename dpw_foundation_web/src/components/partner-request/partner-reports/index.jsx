'use client';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/_admin/my-donations/generalDialog';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import PartnerReportsRow from 'src/components/table/rows/partnerReports';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import { setPartnerRequestData } from 'src/redux/slices/partner';
import * as partnerApi from 'src/services/partner';
import AddPartnerReportDialog from './AddPartnerReportDialog';
import ViewPartnerReportDialog from './ViewPartnerReportDialog';

export default function PartnerReports() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get('page') || '1';
  const rowsPerPageParam = searchParams?.get('rowsPerPage') || '10';
  const [openAddReport, setOpenAddReport] = useState(false);
  const [openViewReport, setOpenViewReport] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [deletingReport, setDeletingReport] = useState(null);

  const partnerRequestData = useSelector((state) => state?.partner?.partnerRequestData);
  const { status } = partnerRequestData || {};

  useQuery(['partnerRequest', partnerApi.fetchPartnerRequestById, id], () => partnerApi.fetchPartnerRequestById(id), {
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setPartnerRequestData(data));
    }
  });

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const { isLoading: reportsLoading, refetch } = useQuery(
    ['partnerReports', id, pageParam, rowsPerPageParam],
    () => partnerApi.getPartnerReports(id, +pageParam - 1 || 0, +rowsPerPageParam || 10),
    {
      enabled: !!id,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        setTableRows({
          count,
          data: rows,
          totalElements
        });
      },
      onError: (err) => {
        setTableRows({
          count: 0,
          data: [],
          totalElements: 0
        });
        dispatch(
          setToastMessage({ message: err?.response?.data?.message || 'Failed to load reports', variant: 'error' })
        );
      }
    }
  );

  const tableHeadData = [
    { id: 'reportPeriodFrom', label: 'Report Period From' },
    { id: 'reportPeriodTo', label: 'Report Period To' },
    { id: 'reportType', label: 'Report Type' },
    { id: 'reportTitle', label: 'Report Title' },
    { id: 'submissionDate', label: 'Submission Date' },
    { id: 'actions', label: 'Actions' }
  ];

  const canAddReports = status === 'ACTIVE' || status === 'APPROVED';

  const handleAddReport = () => {
    setEditingReport(null);
    setOpenAddReport(true);
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setOpenAddReport(true);
  };

  const handleViewReport = (report) => {
    setViewingReport(report);
    setOpenViewReport(true);
  };

  const handleCloseDialog = () => {
    setOpenAddReport(false);
    setEditingReport(null);
  };

  const handleCloseViewDialog = () => {
    setOpenViewReport(false);
    setViewingReport(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingReport(null);
  };

  const handleReportSaved = () => {
    refetch();
    handleCloseDialog();
  };

  const { mutate: deleteReport } = useMutation(partnerApi.deletePartnerReport, {
    onSuccess: () => {
      dispatch(setToastMessage({ message: 'Report deleted successfully', variant: 'success' }));
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: 'Failed to delete report', variant: 'error' }));
    }
  });

  const { mutate: exportReports } = useMutation(
    ({ partnershipId, type }) => partnerApi.exportPartnerReports({ partnershipId, type }),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message || 'Reports exported successfully', variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err?.response?.data?.message || 'Export failed', variant: 'error' }));
      }
    }
  );

  const handleDeleteReport = (report) => {
    setDeletingReport(report);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deletingReport) {
      deleteReport({ partnershipId: id, reportId: deletingReport.id });
      handleCloseDeleteDialog();
    }
  };

  const onExport = () => {
    const obj = {
      partnershipId: id,
      type: 'PARTNER_REPORTS'
    };
    exportReports(obj);
  };

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        spacing={3}
      >
        <Button
          sx={{ paddingLeft: 0 }}
          color="primary"
          onClick={() => router.push('/user/my-partnerships')}
          startIcon={<BackArrow sx={{ marginRight: '5px' }} />}
        >
          Back
        </Button>
        <Stack
          flexDirection="row"
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          spacing={3}
          alignItems="center"
          gap={3}
          sx={{ width: '100%' }}
        >
          {canAddReports && (
            <Button variant="contained" color="primary" onClick={handleAddReport}>
              Add Partnership Report
            </Button>
          )}
        </Stack>
      </Stack>
      <HeaderBreadcrumbs admin heading="Partnership Reports" />
      <Table
        headData={tableHeadData}
        data={tableRows}
        isLoading={reportsLoading}
        row={PartnerReportsRow}
        totalCountText="Partnership Reports"
        allCount={tableRows?.totalElements}
        isSearch={false}
        isExport={true}
        onExport={onExport}
        onEdit={handleEditReport}
        onDelete={handleDeleteReport}
        onView={handleViewReport}
        refetch={refetch}
      />

      {openAddReport && (
        <AddPartnerReportDialog
          open={openAddReport}
          onClose={handleCloseDialog}
          onSave={handleReportSaved}
          partnershipId={id}
          editingReport={editingReport}
        />
      )}

      {openViewReport && (
        <ViewPartnerReportDialog
          open={openViewReport}
          onClose={handleCloseViewDialog}
          partnershipId={id}
          reportId={viewingReport?.id}
        />
      )}
      <GeneralDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleConfirmDelete}
        textTitle="Are you sure you want to delete this Partnership Report?"
        btnTitle="Delete"
      />
    </>
  );
}
