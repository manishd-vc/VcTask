import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { partnershipStatusColorSchema } from 'src/utils/util';

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

export default function PreviouslyProject({ rowData = [] }) {
  const { masterData } = useSelector((state) => state?.common);
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
            {rowData?.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" p={2}>
                    Previous Projects not available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {rowData?.length > 0 &&
              rowData?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.projectId || '-'}</TableCell>
                  <TableCell>{item?.sectorFocusArea || '-'}</TableCell>
                  <TableCell>{item?.projectTitle || '-'}</TableCell>
                  <TableCell>{item?.actualFundsDispensed || '-'}</TableCell>
                  <TableCell>{item?.projectStartDate ? fDateWithLocale(item?.projectStartDate, true) : '-'}</TableCell>
                  <TableCell>{item?.projectEndDate ? fDateWithLocale(item?.projectEndDate, true) : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      color={partnershipStatusColorSchema[item?.status]}
                      label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', item?.status || '-')}
                      size="small"
                    />
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
