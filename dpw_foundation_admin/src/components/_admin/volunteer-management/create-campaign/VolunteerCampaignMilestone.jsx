import {
  Button,
  IconButton,
  Paper,
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
import AddMilestone from './AddMilestone';

export default function VolunteerCampaignMilestone() {
  const { values, setFieldValue } = useFormikContext();
  const [open, setOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const { masterData } = useSelector((state) => state?.common);

  const handleDelete = (id) => {
    setFieldValue(
      'milestones',
      values.milestones.filter((milestone) => milestone.id !== id)
    );
  };

  const handleEdit = (id) => {
    const milestoneToEdit = values.milestones.find((milestone) => milestone.id === id);
    setEditingMilestone(milestoneToEdit);
    setOpen(true);
  };

  const handleAddNew = () => {
    setEditingMilestone(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMilestone(null);
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={3}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black">
          volunteer Campaign milestone
        </Typography>
        <Button size="small" variant="contained" onClick={handleAddNew}>
          Add more Items
        </Button>
      </Stack>
      <AddMilestone
        open={open}
        onClose={handleClose}
        milestones={values.milestones}
        editingMilestone={editingMilestone}
      />
      <TableContainer component="div" sx={{ width: '100%' }}>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Milestone ID</TableCell>
                <TableCell>Milestone Description</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Target Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell>{milestone?.milestoneUniqueId || '-'}</TableCell>
                  <TableCell>{milestone.milestoneDescription || '-'}</TableCell>
                  <TableCell>{getLabelByCode(masterData, 'dpwf_volunteer_unit', milestone.unit) || '-'}</TableCell>
                  <TableCell>{milestone.targetNumber || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(milestone.id || milestone.milestoneUniqueId)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(milestone.id || milestone.milestoneUniqueId)}>
                        <DeleteIconRed />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Paper>
  );
}
