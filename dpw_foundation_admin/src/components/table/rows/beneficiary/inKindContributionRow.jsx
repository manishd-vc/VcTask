import { Chip, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { inKindContributionStatusColorSchema } from 'src/utils/util';

export default function InKindContributionRow({ row }) {
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);

  const handleView = () => {
    router.push(`/admin/in-kind-contribution-requests/${row?.id}/view?beneficiary-list`);
  };

  return (
    <TableRow hover>
      <TableCell>{row?.contributionUniqueId || '-'}</TableCell>
      <TableCell>{row?.requestTitle || '-'}</TableCell>
      <TableCell>
        {getLabelByCode(masterData, 'dpwf_contribution_assistance_requested', row?.assistanceRequested) || '-'}
      </TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpwf_contribution_req_nature', row?.requestNature) || '-'}</TableCell>

      <TableCell>{row?.expectedDateContribution ? fDateWithLocale(row?.expectedDateContribution) : '-'}</TableCell>
      <TableCell>{row?.estimatedValueDonation || '-'}</TableCell>
      <TableCell>{row?.estimatedValueInkind || '-'}</TableCell>
      <TableCell>
        <Chip
          label={getLabelByCode(masterData, 'dpwf_inkind_contribution_status', row?.status) || 'Unknown'}
          color={inKindContributionStatusColorSchema[row?.status] || 'default'}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View Details">
          <IconButton onClick={handleView} size="small">
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
