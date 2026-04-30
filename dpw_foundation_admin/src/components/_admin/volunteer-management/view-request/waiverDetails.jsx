'use client';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ViewWaiverForm from './viewWaiverForm';

export default function WaiverDetails() {
  const [open, setOpen] = useState(false);
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Is Waiver required for this campaign?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignData?.waiverRequired ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
        {volunteerCampaignData?.waiverRequired && (
          <Grid item xs={12}>
            <Box mt={2}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => setOpen(true)}
                disabled={!volunteerCampaignData?.waiverRequired}
              >
                View Waiver Form
              </Button>
            </Box>
          </Grid>
        )}
      </Paper>
      <ViewWaiverForm open={open} handleClose={handleClose} />
    </>
  );
}
