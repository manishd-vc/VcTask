import { Typography } from '@mui/material';
import ProfileDetails from './ProfileDetails';

export default function InKindStep1() {
  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Beneficiary information form
      </Typography>
      <ProfileDetails />
    </>
  );
}
