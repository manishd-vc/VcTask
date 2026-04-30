'use client';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import VolunteeringSupportDocumentsTable from 'src/components/table/VolunteeringSupportDocumentsTable';

export default function SupportingDocuments({ enrollmentData }) {
  const { volunteeringSupportDocuments } = enrollmentData || {};

  return (
    <>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" mb={2} mt={1}>
        Volunteering Supporting Documents
      </Typography>
      <VolunteeringSupportDocumentsTable
        data={volunteeringSupportDocuments || []}
        isEditable={false}
        showHeader={false}
        showAddButton={false}
      />
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="volunteerReleaseAccepted"
                checked={enrollmentData?.volunteerReleaseAccepted || false}
                disabled
              />
            }
            label={<span>Volunteer Release and Undertaking</span>}
          />
        </Grid>
      </Grid>
    </>
  );
}
