import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AssociateProjects from 'src/components/dialog/AssociateProjects';
import AssociateProjectsView from 'src/components/dialog/AssociateProjectsView';
import ViewPartnership from 'src/components/dialog/ViewPartnership';
import { checkPermissions } from 'src/utils/permissions';

export default function CompleteTerminatePartnership() {
  const { id } = useParams();
  const router = useRouter();
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);

  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openViewPartnership, setOpenViewPartnership] = useState(false);
  const status = ['ACTIVE', 'APPROVED', 'EXPIRE', 'COMPLETE', 'TERMINATE'];

  const viewOnly =
    partnerRequestData?.status === 'EXPIRE' ||
    partnerRequestData?.status === 'COMPLETE' ||
    partnerRequestData?.status === 'TERMINATE';
  const handleComplete = () => {
    router.push(`/admin/partnership-request/${id}/complete`);
  };
  const handleTerminate = () => {
    router.push(`/admin/partnership-request/${id}/terminate`);
  };

  const handleAssociateProjects = () => {
    if (partnerRequestData?.status === 'ACTIVE' || partnerRequestData?.status === 'APPROVED') {
      setOpen(true);
    } else if (viewOnly) {
      setOpenView(true);
    }
  };

  const managerOnly = checkPermissions(rolesAssign, ['partner_manage']);

  const renderCompleteButton =
    managerOnly && (partnerRequestData?.status === 'ACTIVE' || partnerRequestData?.status === 'EXPIRE');
  const renderTerminateButton =
    managerOnly && (partnerRequestData?.status === 'ACTIVE' || partnerRequestData?.status === 'APPROVED');

  const renderAssociateProjectsButton = managerOnly && status.includes(partnerRequestData?.status);

  const labelButton =
    partnerRequestData?.status === 'TERMINATE' ||
    partnerRequestData?.status === 'COMPLETE' ||
    partnerRequestData?.status === 'EXPIRE'
      ? 'Associated'
      : 'Associate';

  return (
    <>
      {renderTerminateButton && (
        <Button
          variant="contained"
          color="error"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          onClick={handleTerminate}
        >
          Terminate
        </Button>
      )}
      {renderCompleteButton && (
        <Button
          variant="contained"
          color="warning"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          onClick={handleComplete}
        >
          Complete
        </Button>
      )}
      {renderAssociateProjectsButton && (
        <Button
          onClick={handleAssociateProjects}
          variant="contained"
          color="primary"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        >
          {labelButton} Projects
        </Button>
      )}
      {(partnerRequestData?.status === 'COMPLETE' || partnerRequestData?.status === 'TERMINATE') && managerOnly && (
        <Button
          variant="contained"
          color="primary"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          onClick={() => setOpenViewPartnership(true)}
        >
          View Partnership Response
        </Button>
      )}

      {open && <AssociateProjects open={open} onClose={() => setOpen(false)} />}
      {openView && <AssociateProjectsView open={openView} onClose={() => setOpenView(false)} />}
      {openViewPartnership && (
        <ViewPartnership
          open={openViewPartnership}
          onClose={() => setOpenViewPartnership(false)}
          status={partnerRequestData?.status}
        />
      )}
    </>
  );
}
