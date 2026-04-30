import { IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EditInKindItemModal from 'src/components/dialog/EditInKindItemModal';
import { EditIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

export default function InKindItemsRow({ row, refetch }) {
  const { masterData } = useSelector((state) => state?.common);
  const { inKindContributionRequestData } = useSelector((state) => state?.beneficiary);
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.itemCode || '-'}</TableCell>
        <TableCell>{row?.itemName || '-'}</TableCell>
        <TableCell>{row?.itemDescription || '-'}</TableCell>
        <TableCell>
          {getLabelByCode(masterData, 'dpwf_contribution_required_unit', row?.requiredUnit) || row?.requiredUnit || '-'}
        </TableCell>
        <TableCell>{row?.requiredNumber || '-'}</TableCell>
        <TableCell>{row?.unitRate || '-'}</TableCell>
        <TableCell>{row?.lineValue || '-'}</TableCell>
        <TableCell>{getLabelByCode(masterData, 'dpwf_contribution_category', row?.type) || row?.type || '-'}</TableCell>
        <TableCell>{row?.issuesQuantity || '-'}</TableCell>
        <TableCell>{row?.actualValueOfInKind || '-'}</TableCell>
        <TableCell>
          {row?.itemIssuanceStatus
            ? getLabelByCode(masterData, 'dpwf_contribution_item_issued_status', row?.itemIssuanceStatus)
            : '-'}
        </TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="flex-end">
            <Tooltip title="Edit" arrow>
              <IconButton onClick={() => setOpenEditModal(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      {openEditModal && (
        <EditInKindItemModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          item={row}
          contributionId={inKindContributionRequestData?.id}
          refetch={refetch}
        />
      )}
    </>
  );
}
