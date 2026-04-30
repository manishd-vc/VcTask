'use client';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import DistributionRow from 'src/components/table/rows/distribution';
import Table from 'src/components/table/table';
import DistributionForm from './distributionForm';
// Table header definition
const TABLE_HEAD = [
  { id: 'distributionCategory', label: 'Sector', alignRight: false, sort: true },
  { id: 'estimatedDistributionValue', label: 'EST distribution Value (AED)', alignRight: false, sort: true },
  { id: 'distributionSource', label: 'Project Fund Source', alignRight: false, sort: true },
  { id: 'beneficiaryType', label: 'Beneficiary Type', alignRight: false, sort: true },
  { id: 'targetBeneficiaryNo', label: 'Target Beneficiary', alignRight: false, sort: true },
  { id: 'distributionStartTime', label: 'Est Distribution Start Date', alignRight: false, sort: true },
  { id: 'distributionEndTime', label: 'Est Distribution End Date', alignRight: false, sort: true },
  { id: 'distributionSource', label: 'Project Fund Source', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function Distributions() {
  const { setFieldValue, values } = useFormikContext();
  const [setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [distribution, setDistribution] = useState(null);
  const [distributions, setDistributions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Toggle for opening and closing the Add PO modal
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (value) => {
    const distributions = [...values.distributions];
    if (selectedIndex === -1) {
      distributions.push(value);
    } else {
      distributions[selectedIndex] = value;
    }
    setFieldValue('distributions', distributions);
    setSelectedIndex(-1);
    setDistribution(null);
    handleClose();
  };

  const handleClickDelete = (index, type) => {
    setSelectedIndex(index);
    if (type === 'delete') {
      const distributions = [...values.distributions];
      distributions.splice(index, 1);
      setFieldValue('distributions', distributions);
    } else {
      const distributions = [...values.distributions];
      setDistribution(distributions[index]);
      handleClickOpen();
    }
  };

  useEffect(() => {
    if (values.distributions && values.distributions.length > 0) {
      setDistributions(values.distributions);
    }
  }, [values.distributions]);

  return (
    <Box>
      <Box>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            All Distributions
          </Typography>
          <Button variant="contained" size="small" onClick={handleClickOpen}>
            Add Distribution
          </Button>
        </Stack>
      </Box>
      <Table
        allCount={distributions.length || 0}
        totalCountText={''}
        headData={TABLE_HEAD}
        data={
          {
            data: distributions
          } || []
        }
        isLoading={false}
        row={DistributionRow}
        setId={setId}
        id={setId}
        isSearch={false}
        handleClickOpen={handleClickDelete}
        isDatePicker={false}
        isPagination={false}
        className="innerTable"
      />
      <DistributionForm
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={false}
        distribution={distribution}
      />
    </Box>
  );
}
