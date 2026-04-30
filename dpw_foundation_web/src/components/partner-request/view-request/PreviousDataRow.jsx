import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as partnerApi from 'src/services/partner';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
const columns = [
  {
    id: 'projectId',
    label: 'Project ID'
  },
  {
    id: 'sectorFocusArea',
    label: 'Sector / Focus Area'
  },
  {
    id: 'projectTitle',
    label: 'Project Title'
  },
  {
    id: 'actualFundsDispensed',
    label: 'Actual Funds Dispensed'
  },
  {
    id: 'projectStartDate',
    label: 'Project Start Date'
  },
  {
    id: 'projectEndDate',
    label: 'Project End Date'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'purchaseOrderNo',
    label: 'Purchase Order No'
  }
];

export default function PreviousDataRow() {
  const { masterData } = useSelector((state) => state?.common);
  const partnerRequestData = useSelector((state) => state?.partner?.partnerRequestData);
  const { partnerId } = partnerRequestData || {};
  const { data } = useQuery('getPreviouslyProject', () => partnerApi.getPreviouslyProject({ partnerId }), {
    enabled: !!partnerId
  });
  return (
    <>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ pb: 3 }}>
        Projects Previously Done with DPWF
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" p={2}>
                    Previous Projects not available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {data?.length > 0 &&
              data?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.projectId || '-'}</TableCell>
                  <TableCell>{item?.sectorFocusArea || '-'}</TableCell>
                  <TableCell>{item?.projectTitle || '-'}</TableCell>
                  <TableCell>{item?.actualFundsDispensed || '-'}</TableCell>
                  <TableCell>{item?.projectStartDate ? fDateWithLocale(item?.projectStartDate, true) : '-'}</TableCell>
                  <TableCell>{item?.projectEndDate ? fDateWithLocale(item?.projectEndDate, true) : '-'}</TableCell>
                  <TableCell>
                    {getLabelByCode(masterData, 'dpw_foundation_campaign_status', item?.status || '-')}
                  </TableCell>
                  <TableCell>{item?.purchaseOrderNo || '-'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
