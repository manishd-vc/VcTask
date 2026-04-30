'use client';
import { Box, Paper, TableCell, TableRow, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import ReusableTable from 'src/components/table/ReusableTable';
import TableStyle from 'src/components/table/table.styles';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

const tableHeaders = [
  { label: 'Milestone ID', key: 'milestoneUniqueId' },
  { label: 'Milestone Description', key: 'milestoneDescription' },
  { label: 'Unit', key: 'unit' },
  { label: 'Target Number', key: 'targetNumber' }
];

export default function VolunteerCampaignMilestone() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const targetData = volunteerCampaignData?.milestones;
  const theme = useTheme();
  const style = TableStyle(theme);
  const { masterData } = useSelector((state) => state?.common);

  return (
    <Paper sx={{ p: 3 }}>
      {targetData?.length > 0 && (
        <>
          <ReusableTable headers={tableHeaders}>
            {targetData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>
                  <Box sx={style.CellMaxWidth}>{item?.milestoneUniqueId || '-'}</Box>
                </TableCell>
                <TableCell>
                  <Box sx={style.CellMaxWidth}>{item?.milestoneDescription || '-'}</Box>
                </TableCell>
                <TableCell>{getLabelByCode(masterData, 'dpwf_volunteer_unit', item?.unit) || item?.unit}</TableCell>
                <TableCell>{item?.targetNumber || '-'}</TableCell>
              </TableRow>
            ))}
          </ReusableTable>
        </>
      )}
    </Paper>
  );
}
