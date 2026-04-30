'use client';
import { Button, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
export default function ViewProfile({ user, setEdit }) {
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
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
              basic details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.employeeId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                First Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {user?.firstName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Second Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {user?.lastName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Email
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.email || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assigned Role(s)
              </Typography>
              {/* <Typography variant="subtitle4" component="p" color="text.secondarydark">
                {user?.roles?.[0] || '-'}
                {user?.roles?.length > 1 && (
                  <Tooltip title={user.roles.join(', ')} arrow>
                    <Typography variant="blueLink" color="text.blue" textTransform="capitalize">
                      {`+${user.roles.length - 1} more`}
                    </Typography>
                  </Tooltip>
                )}
              </Typography> */}
              <Typography variant="subtitle4" component="p" color="text.secondarydark">
                {/* Access the 'name' property of the first role object */}
                {user?.roles?.[0]?.name || '-'}
                {user?.roles?.length > 1 && (
                  <Tooltip title={user.roles.map((role) => role.name).join(', ')} arrow>
                    <Typography variant="blueLink" color="text.blue" textTransform="capitalize">
                      {`+${user.roles.length - 1} more`}
                    </Typography>
                  </Tooltip>
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.mobile || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {user?.gender || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
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
