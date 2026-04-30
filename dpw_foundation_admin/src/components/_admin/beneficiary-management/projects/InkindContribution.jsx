'use client';
import { Box, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ReusableTable from 'src/components/table/ReusableTable';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import Export from '../../campaign/steps/export';

export default function InkindContribution({ campaignData }) {
  const { masterData } = useSelector((state) => state?.common);
  const tableHeader = [
    { label: 'Item Code', key: 'itemCode' },
    { label: 'Item Name', key: 'itemName' },
    { label: 'Type', key: 'type' },
    { label: 'Item Description', key: 'itemDescription' },
    { label: 'Required Unit', key: 'requiredUnit' },
    { label: 'Available in store', key: 'availableInStore' },
    { label: 'Contribution Value (AED)', key: 'contributionValue' },
    { label: 'Location', key: 'location' },
    { label: 'Issued By', key: 'issuedBy' }
  ];

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" textTransform="uppercase" color="primary.main" sx={{ mb: 2 }}>
        In-kind distribution progress
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box sx={{ minWidth: 150 }}>
          <Typography variant="subHeader" component="h6" color="primary.main">
            all In-kind items ({campaignData?.campaignInKindContributions?.length || 0})
          </Typography>
        </Box>
        <Export id={campaignData?.id} type={'IN_KIND_CONTRIBUTION'} />
      </Stack>
      <ReusableTable headers={tableHeader}>
        {campaignData?.campaignInKindContributions?.map((item) => (
          <TableRow key={item?.id}>
            <TableCell>{item?.inKindItemCode || '-'}</TableCell>
            <TableCell>{item?.inKindItem || '-'}</TableCell>
            <TableCell>{item?.inKindType || '-'}</TableCell>
            <TableCell>{item?.inKindItemDescription || '-'}</TableCell>
            <TableCell>{item?.inKindUnit || '-'}</TableCell>

            <TableCell>{item?.availableInStore ? 'Yes' : 'No' || '-'}</TableCell>
            <TableCell>{item?.contributionValue || '-'}</TableCell>
            <TableCell>
              {getLabelByCode(masterData, 'dpw_foundation_campaign_item_location', item?.location) || '-'}
            </TableCell>
            <TableCell>{item?.storeManager || '-'}</TableCell>
          </TableRow>
        ))}
      </ReusableTable>
    </Paper>
  );
}
