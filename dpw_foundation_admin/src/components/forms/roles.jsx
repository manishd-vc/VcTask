'use client';
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
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import AccessControlNew from '../_admin/roles/accessControlNew';
import AddUserRole from '../dialog/addUserRole';
import { BackArrow } from '../icons';
import FormStyle from './form.styles';

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

export default function RolesForm({ isEdit }) {
  // Retrieve the role ID from the URL parameters
  const params = useParams();

  // Access theme-based styles
  const theme = useTheme();
  const styles = FormStyle(theme);

  // Next.js router for navigation
  const router = useRouter();

  // Redux hooks to dispatch actions and access the store
  const dispatch = useDispatch();

  // State for controlling the Add User dialog and edit mode
  const [openUserList, setOpenUserList] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Mutation for creating or updating a role
  const { mutate, isLoading } = useMutation(isEdit ? api.updateRole : api.createNewRoles, {
    onSuccess: async (response) => {
      // Display success toast and redirect on successful mutation
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      router.push('/admin/user-management?tab=roles');
    },
    onError: (err) => {
      // Display error toast on mutation failure
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Query for fetching role details (used only in edit mode)
  const { data } = useQuery(['getRole', params.id], () => api.getRoles(params.id), {
    enabled: !!params.id && !!isEdit, // Enable query only when editing
    onError: (err) => {
      // Display error toast on fetch failure
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  useEffect(() => {
    if (data?.roleModulePermission) {
      setSelectedPermissions(data?.roleModulePermission);
    }
  }, [data, setSelectedPermissions]);

  // Validation schema for the form
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Role Name is required') // Role name is mandatory
  });

  // Initialize Formik for form handling
  const formik = useFormik({
    initialValues: {
      name: data?.name || '', // Prefill with fetched data or leave empty for new roles
      description: data?.description || '',
      assignedUserList: data?.assignedUserList || [],
      status: data?.status || 'Active',
      roleId: data?.roleId || ''
    },
    enableReinitialize: true, // Reinitialize form values when `data` changes
    validationSchema: UserSchema, // Attach the validation schema
    onSubmit: async (values) => {
      // Combine form values with access control data
      const payload = {
        ...values,
        roleModulePermission: selectedPermissions
      };
      // Trigger the mutation with the payload and role ID (if editing)
      mutate({ ...payload, id: params.id });
    }
  });

  // Destructure useful Formik properties for easier usage
  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
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

        <Stack direction="row" spacing={2} mb={5}>
          <Typography textAlign="center" variant="h5" color={'primary.main'} gutterBottom textTransform={'uppercase'}>
            {!params.id ? 'Create New Role' : `Edit Role - ${data?.name}`}
          </Typography>
        </Stack>
        <Paper>
          <Grid container spacing={2} px={3} pb={2}>
            <Grid item xs={12} md={6}>
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
                <Button variant="contained" sx={{ my: 2, textTransform: 'none' }} onClick={() => setOpenUserList(true)}>
                  Add Users to this Role
                </Button>
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
              {openUserList && <AddUserRole open={openUserList} onClose={() => setOpenUserList(false)} isEdit={edit} />}
            </Grid>
          </Grid>
        </Paper>
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
          {/* <Paper sx={{ p: 2 }}>
            <AccessControl updateData={data?.roleModule || []} isEdit={isEdit} />
          </Paper> */}
        </Box>
        <Box sx={{ mt: { xs: 1, md: 3 } }}>
          <Paper sx={{ p: 2 }}>
            <AccessControlNew
              updateData={data?.roleModule || []}
              isEdit={isEdit}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
            />
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

RolesForm.propTypes = {
  isEdit: PropTypes.bool
};
