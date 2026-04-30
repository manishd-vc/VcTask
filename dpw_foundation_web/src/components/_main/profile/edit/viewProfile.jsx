'use client';
import { Button, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import { ViewIndividualProfile } from './viewIndividualProfile';
import ViewOrganizationProfile from './viewOrganizationProfile';

export default function ViewProfile({ user, setEdit }) {
  //user Type
  return (
    <>
      <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography textAlign="center" variant="h5" color="primary.main" textTransform="uppercase">
          My Profile
        </Typography>
        <Button type="button" size="large" variant="outlined" onClick={() => setEdit(true)}>
          Edit
        </Button>
      </Stack>
      {user?.accountType === 'Individual' ? (
        <ViewIndividualProfile user={user} />
      ) : (
        <ViewOrganizationProfile user={user} />
      )}
    </>
  );
}

// Add PropTypes
ViewProfile.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    mobile: PropTypes.string,
    email: PropTypes.string,
    dob: PropTypes.string,
    accountType: PropTypes.string
  }).isRequired,
  setEdit: PropTypes.func
};
