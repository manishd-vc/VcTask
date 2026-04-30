'use client';
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AddInKindItem from 'src/components/dialog/addInKindItem';
import GeneralDialog from 'src/components/dialog/approval';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import Export from '../export';

const tableHeader = [
  { label: 'Item Code', key: 'itemCode' },
  { label: 'Item Name', key: 'itemName' },
  { label: 'Type', key: 'type' },
  { label: 'Item Description', key: 'itemDescription' },
  { label: 'Required Unit', key: 'requiredUnit' },
  { label: 'Available in store', key: 'availableInStore' },
  { label: 'Contribution Value (AED)', key: 'contributionValue' },
  { label: 'Location', key: 'location' },
  { label: 'Issued By', key: 'issuedBy' },
  { label: 'Action', key: 'action' }
];

const Header = [
  { label: 'Item Code', key: 'itemCode' },
  { label: 'Item Name', key: 'itemName' },
  { label: 'Type', key: 'type' },
  { label: 'Item Description', key: 'itemDescription' },
  { label: 'Required Unit', key: 'requiredUnit' }
];
export default function ContributionSectionView({ refetchCampaignApi, isSupervisor }) {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const { masterData } = useSelector((state) => state?.common);

  const [open, setOpen] = useState(false);
  const [inKindItem, setInKindItem] = useState({});
  const [id, setId] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  const handleOpen = (item) => {
    setOpen(true);
    setInKindItem(item);
  };

  const handleAddItem = () => {
    setOpen(true);
    setInKindItem({});
  };

  const handleDelete = (id) => {
    setIsDelete(true);
    setId(id);
  };
  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
          {campaignUpdateData?.campaignType === 'FUNDCAMP'
            ? 'Campaign Funding and Sector Details'
            : 'Project Funding and Distribution Details'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Is in-kind Contribution required?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.isKindContributionRequired === true ? 'Yes' : 'No'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {isSupervisor && (
          <Typography variant="h6" textTransform={'uppercase'} color="text.black" pb={3}>
            Update In kind distribution progress
          </Typography>
        )}
        {campaignUpdateData?.isKindContributionRequired === true && (
          <>
            <Stack
              direction="row"
              spacing={3}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Typography variant="subtitle5" textTransform={'uppercase'} color="text.black">
                In Kind Items ({campaignUpdateData?.campaignInKindContributions?.length})
              </Typography>
              <Stack flexDirection="row" gap={3}>
                <Export id={campaignUpdateData?.id} type={'IN_KIND_CONTRIBUTION'} />
                {isSupervisor && (
                  <Button variant="contained" onClick={handleAddItem}>
                    Add Item
                  </Button>
                )}
              </Stack>
            </Stack>
            <ReusableTable headers={isSupervisor ? tableHeader : Header}>
              {campaignUpdateData?.campaignInKindContributions?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.inKindItemCode || '-'}</TableCell>
                  <TableCell>{item?.inKindItem || '-'}</TableCell>
                  <TableCell>{item?.inKindType || '-'}</TableCell>
                  <TableCell>{item?.inKindItemDescription || '-'}</TableCell>
                  <TableCell>{item?.inKindUnit || '-'}</TableCell>
                  {isSupervisor && (
                    <>
                      {' '}
                      <TableCell>{item?.availableInStore ? 'Yes' : 'No' || '-'}</TableCell>
                      <TableCell>{item?.contributionValue || '-'}</TableCell>
                      <TableCell>
                        {getLabelByCode(masterData, 'dpw_foundation_campaign_item_location', item?.location) || '-'}
                      </TableCell>
                      <TableCell>{item?.storeManager || '-'} </TableCell>
                      <TableCell>
                        <Tooltip title="Edit" arrow>
                          <IconButton onClick={() => handleOpen(item)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {item?.allowDelete && (
                          <Tooltip title="Delete" arrow>
                            <IconButton onClick={() => handleDelete(item?.id)}>
                              <DeleteIconRed />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </ReusableTable>

            {/* IN-KIND DISTRIBUTION PROGRESS Section */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                mb: 2
              }}
            >
              <Typography variant="subtitle5" textTransform={'uppercase'} color="text.black">
                In-Kind Distribution Progress
              </Typography>
              <Button variant="outlined" size="small">
                Export
              </Button>
            </Stack>

            <ReusableTable
              headers={[
                { label: 'Item Code', key: 'itemCode' },
                { label: 'Item Name', key: 'itemName' },
                { label: 'Type', key: 'type' },
                { label: 'Item Description', key: 'itemDescription' },
                { label: 'Required Unit', key: 'requiredUnit' },
                { label: 'Available in store', key: 'availableInStore' },
                { label: 'Contribution Value (AED)', key: 'contributionValue' },
                { label: 'Location', key: 'location' },
                { label: 'Issued By', key: 'issuedBy' }
              ]}
            >
              {/* Mock data - replace with actual distribution progress data */}
              <TableRow>
                <TableCell>IC1</TableCell>
                <TableCell>Glucose Package</TableCell>
                <TableCell>Medicine</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>10</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>20,000</TableCell>
                <TableCell>Head Office</TableCell>
                <TableCell>Shahida</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>IC2</TableCell>
                <TableCell>Fruit Package</TableCell>
                <TableCell>Goods</TableCell>
                <TableCell>Item Description</TableCell>
                <TableCell>200</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>20,000</TableCell>
                <TableCell>HeadOffice</TableCell>
                <TableCell>Shahida</TableCell>
              </TableRow>
            </ReusableTable>
          </>
        )}
        {open && (
          <AddInKindItem
            open={open}
            onClose={() => setOpen(false)}
            inKindData={inKindItem}
            refetchCampaignApi={refetchCampaignApi}
          />
        )}
        {isDelete && (
          <Dialog onClose={() => setIsDelete(false)} open={isDelete} maxWidth={'sm'}>
            <GeneralDialog
              onClose={() => setIsDelete(false)}
              id={id}
              refetch={refetchCampaignApi}
              endPoint="deleteInKindItemBySupervisor"
              deleteMessage={'Are you sure you want to delete this Item ?'}
              dialogTitle={'Confirm'}
              btnTitle={'Yes'}
            />
          </Dialog>
        )}
      </Paper>
    </>
  );
}
