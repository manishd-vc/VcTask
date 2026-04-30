import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import Scrollbar from 'src/components/Scrollbar';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import AddInKindContributionModal from './AddInKindContributionModal';

export default function AddInKindContribution() {
  const { values, setFieldValue } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const [open, setOpen] = useState(false);
  const [inKindItem, setInKindItem] = useState(null);
  const handleOpen = () => {
    setInKindItem(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (id) => {
    const contributionItem = values.contributionItems.find((contributionItem) => contributionItem.id === id);
    setInKindItem(contributionItem);
    setOpen(true);
  };
  const handleDelete = (id) => {
    setFieldValue(
      'contributionItems',
      values?.contributionItems?.filter((contributionItem) => contributionItem.id !== id)
    );
  };
  return (
    <>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={3}
        sx={{ my: 2 }}
      >
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          In-kind contributions
        </Typography>
        <Button size="small" variant="contained" onClick={handleOpen}>
          Add Item
        </Button>
        {open && <AddInKindContributionModal open={open} onClose={handleClose} inKindItem={inKindItem} />}
      </Stack>
      <TableContainer component="div" sx={{ width: '100%' }}>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Code</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Item Description</TableCell>
                <TableCell>Required Unit</TableCell>
                <TableCell>Required Number</TableCell>
                <TableCell>Unit Rate</TableCell>
                <TableCell>Line Value</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values?.contributionItems?.length > 0 ? (
                values?.contributionItems?.map((contributionItem) => (
                  <TableRow key={contributionItem.id}>
                    <TableCell>{contributionItem?.itemCode || '-'}</TableCell>
                    <TableCell>{contributionItem?.itemName || '-'}</TableCell>
                    <TableCell>{contributionItem?.itemDescription || '-'}</TableCell>
                    <TableCell>
                      {getLabelByCode(masterData, 'dpwf_contribution_required_unit', contributionItem?.requiredUnit) ||
                        '-'}
                    </TableCell>
                    <TableCell>{contributionItem?.requiredNumber || '-'}</TableCell>
                    <TableCell>{contributionItem?.unitRate || '-'}</TableCell>
                    <TableCell>{contributionItem?.lineValue || '-'}</TableCell>
                    <TableCell>
                      {getLabelByCode(masterData, 'dpwf_contribution_category', contributionItem?.type) || '-'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(contributionItem.id || contributionItem.itemCode)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(contributionItem.id || contributionItem.itemCode)}>
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" p={2}>
                      No Data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </>
  );
}
