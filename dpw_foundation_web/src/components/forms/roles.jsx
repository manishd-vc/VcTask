'use client';

// Importing necessary libraries and components
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
// mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, FormControlLabel, Grid, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import AccessControl from '../_admin/roles/accessControl';
import AddUserRole from '../dialog/addUserRole';
import { BackArrow } from '../icons';
import FormStyle from './form.styles';

// Lazy load the FieldWithSkeleton component for optimization
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
RolesForm.propTypes = {
  isEdit: PropTypes.bool
};

/**
 * RolesForm component allows the creation and editing of roles.
 * It handles form submission, validation, and user interactions.
 * @param {boolean} isEdit - Determines if the form is in edit mode or create mode.
 */
export default function RolesForm({ isEdit }) {
  const params = useParams(); // Get the route parameters (e.g., role id for edit)
  const theme = useTheme(); // Access Material-UI theme for styling
  const styles = FormStyle(theme); // Use styles specific to the form
  const router = useRouter(); // Router to navigate between pages
  const dispatch = useDispatch(); // Redux dispatcher for global state management
  const [openUserList, setOpenUserList] = useState(false); // Manage the user list modal visibility
  const [edit, setEdit] = useState(false); // Track if in edit mode for user list
  const { accessControl } = useSelector((state) => state?.roles); // Access the roles from redux store
  const { mutate, isLoading } = useMutation(isEdit ? api.updateRole : api.createNewRoles, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' })); // Show success toast
      router.push('/admin/user-management?tab=roles'); // Redirect to the roles management page
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error toast
    }
  });

  const { data } = useQuery(['getRole', params.id], () => api.getRoles(params.id), {
    enabled: !!params.id && !!isEdit, // Fetch data only if edit mode and role id are present
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' })); // Show error toast if API call fails
    }
  });

  // Define the validation schema using Yup
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Role Name is required') // Role name is mandatory
  });

  // Formik setup to manage form state, validation, and submission
  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      description: data?.description || '',
      assignedUserList: data?.assignedUserList || [],
      status: data?.status || 'Active',
      roleId: data?.roleId || ''
    },
    enableReinitialize: true, // Reinitialize form if data changes
    validationSchema: UserSchema, // Attach validation schema
    onSubmit: async (values) => {
      const payload = {
        ...values,
        ...accessControl // Include access control information in the submission
      };
      mutate({ ...payload, id: params.id }); // Trigger the mutation (create or update)
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue } = formik; // Destructure formik helpers

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {/* Back button */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={3}
          spacing={3}
        >
          <Button
            variant="text"
            startIcon={<BackArrow />}
            onClick={() => router.back()}
            sx={{
              mb: { xs: 3 },
              '&:hover': { textDecoration: 'none' }
            }}
          >
            Back
          </Button>
          <Stack
            flexDirection="row"
            justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
            spacing={3}
            alignItems="center"
            gap={3}
            sx={{ width: '100%' }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.back()}
              sx={{
                width: { xs: '48%', sm: 'auto' }
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              width={'100%'}
              type="submit"
              variant="contained"
              size="large"
              loading={isLoading}
              sx={styles.createBtn}
            >
              {isEdit ? 'Save' : 'Create'}
            </LoadingButton>
          </Stack>
        </Stack>

        {/* Form title */}
        <Stack direction="row" spacing={2} mb={5}>
          <Typography textAlign="center" variant="h5" color={'primary.main'} gutterBottom textTransform={'uppercase'}>
            {!params.id ? 'Create New Role' : `Edit Role - ${data?.roleId}`}
          </Typography>
        </Stack>

        {/* Role Form Fields */}
        <Paper>
          <Grid container spacing={2} px={3} pb={2}>
            <Grid item xs={12} md={6}>
              {/* Role Name Field */}
              <FieldWithSkeleton isLoading={isLoading} error={touched.name && errors.name}>
                <TextField
                  id="roleName"
                  variant="standard"
                  label="Role Name"
                  inputProps={{ maxLength: 256 }}
                  required
                  fullWidth
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack flexDirection="row" alignItems="center" gap={2} mt={2}>
                <Typography variant="body1">Status</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.status === 'Active'}
                      onChange={(event) => setFieldValue('status', event.target.checked ? 'Active' : 'Inactive')}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={values.status === 'Active' ? 'Active' : 'Inactive'}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: values.status === 'Active' ? theme.palette.success.main : theme.palette.error.main
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              {/* Role Description Field */}
              <FieldWithSkeleton isLoading={isLoading}>
                <TextField
                  id="roleDescription"
                  variant="standard"
                  label="Role Description"
                  inputProps={{ maxLength: 1000 }}
                  fullWidth
                  multiline
                  rows={1}
                  {...getFieldProps('description')}
                />
              </FieldWithSkeleton>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
                {/* Add Users Button */}
                <Button variant="contained" sx={{ my: 2, textTransform: 'none' }} onClick={() => setOpenUserList(true)}>
                  Add Users to this Role
                </Button>

                {/* Show number of users assigned to the role */}
                {Boolean(values.assignedUserList?.length) && (
                  <Button
                    variant="text"
                    sx={styles.textFormate}
                    onClick={() => {
                      setOpenUserList(true);
                      setEdit(true);
                    }}
                  >
                    {values.assignedUserList?.length} users added to this role
                  </Button>
                )}
              </Stack>

              {/* Open User Role Dialog */}
              {openUserList && <AddUserRole open={openUserList} onClose={() => setOpenUserList(false)} isEdit={edit} />}
            </Grid>
          </Grid>
        </Paper>

        {/* Access Control Section */}
        <Box sx={{ mt: { xs: 1, md: 3 } }}>
          <Typography
            variant="subHeader"
            component="h6"
            mb={3}
            sx={{ textTransform: 'uppercase' }}
            color={'primary.main'}
          >
            Access Control
          </Typography>
          <Paper sx={{ p: 2 }}>
            <AccessControl updateData={data?.roleModule || []} isEdit={isEdit} />
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

// Prop types for the component
RolesForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
