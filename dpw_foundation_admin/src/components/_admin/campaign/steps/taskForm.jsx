'use client';
import { Autocomplete, Box, CircularProgress, Grid, IconButton, TextField, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import { DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import StepperStyle from './stepper.styles';

// Lazy loading FieldWithSkeleton to reduce initial bundle size
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

TaskForm.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isLoading: PropTypes.bool.isRequired
};

// Helper function to check field validation state
const getFieldValidation = (touched, errors, fieldPath) => {
  const fieldTouched = touched.campaignTasks?.[fieldPath.index]?.[fieldPath.field];
  const fieldError = errors.campaignTasks?.[fieldPath.index]?.[fieldPath.field];
  return {
    hasError: fieldTouched && !!fieldError,
    errorMessage: fieldTouched && fieldError
  };
};

// Helper function to format date safely
const formatDateSafely = (value, setFieldValue, fieldName) => {
  if (!value) {
    setFieldValue(fieldName, null);
    return;
  }

  try {
    const formattedValue = format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss");
    setFieldValue(fieldName, formattedValue);
  } catch (error) {
    console.error('Invalid date value:', error);
    setFieldValue(fieldName, null);
  }
};

// Task Description Field Component
const TaskDescriptionField = ({ index, values, handleChange, handleBlur, touched, errors, isLoading, isEdit }) => {
  return (
    <Grid item xs={12} md={12}>
      <FieldWithSkeleton
        isLoading={isLoading}
        error={
          touched[`campaignTasks[${index}].taskDescription`] && !!errors['campaignTasks']?.[index]?.taskDescription
        }
      >
        <TextField
          variant="standard"
          fullWidth
          label={
            <>
              Task Description{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          name={`campaignTasks[${index}].taskDescription`}
          value={values.campaignTasks[index].taskDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched[`campaignTasks[${index}].taskDescription`] && !!errors['campaignTasks']?.[index]?.taskDescription
          }
          helperText={
            touched[`campaignTasks[${index}].taskDescription`] && errors['campaignTasks']?.[index]?.taskDescription
          }
          disabled={!isEdit}
        />
      </FieldWithSkeleton>
    </Grid>
  );
};

// Assign To Field Component
const AssignToField = ({ index, values, setFieldValue, touched, errors, isLoading, userList, userListingLoading }) => {
  const taskAssigneeId = values.campaignTasks[index].taskAssigneeId;

  // Find the full user object from userList if taskAssigneeId is just an ID
  const fieldValue = React.useMemo(() => {
    if (!taskAssigneeId) return null;

    // If taskAssigneeId is already an object with firstName/lastName, return it
    if (typeof taskAssigneeId === 'object' && taskAssigneeId.firstName) {
      return taskAssigneeId;
    }

    // If taskAssigneeId is just an ID, find the matching user object
    const foundUser = userList.find((user) => user.id === taskAssigneeId);
    return foundUser || null;
  }, [taskAssigneeId, userList]);

  return (
    <Grid item xs={12} md={4}>
      <FieldWithSkeleton
        isLoading={isLoading}
        error={touched[`campaignTasks[${index}].taskAssigneeId`] && !!errors['campaignTasks']?.[index]?.taskAssigneeId}
      >
        <Autocomplete
          options={userList}
          value={fieldValue}
          onChange={(event, newValue) => {
            setFieldValue(`campaignTasks[${index}].taskAssigneeId`, newValue);
          }}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName || ''}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <>
                  Assign To{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              variant="standard"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {userListingLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
              error={
                touched[`campaignTasks[${index}].taskAssigneeId`] && !!errors['campaignTasks']?.[index]?.taskAssigneeId
              }
              helperText={
                touched[`campaignTasks[${index}].taskAssigneeId`] && errors['campaignTasks']?.[index]?.taskAssigneeId
              }
            />
          )}
          renderOption={(props, item) => (
            <li {...props} key={item.id}>
              {item.firstName + ' ' + item.lastName}
            </li>
          )}
          sx={{
            '.MuiAutocomplete-inputRoot': {
              minHeight: 42
            }
          }}
        />
      </FieldWithSkeleton>
    </Grid>
  );
};

// Date Field Component
const DateField = ({ index, values, setFieldValue, touched, errors, fieldName, label, minDate, maxDate }) => {
  const fieldPath = `campaignTasks[${index}].${fieldName}`;
  const fieldValue = values.campaignTasks[index][fieldName];

  const handleDateChange = (value) => {
    formatDateSafely(value, setFieldValue, fieldPath);
  };

  const handleClear = () => {
    setFieldValue(fieldPath, null);
  };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <DatePickers
        label={
          <>
            {label}{' '}
            <Box component="span" sx={{ color: 'error.main' }}>
              *
            </Box>
          </>
        }
        inputFormat={'yyyy-MM-dd'}
        onChange={handleDateChange}
        value={fieldValue ? new Date(fieldValue) : null}
        fullWidth
        readOnly={true}
        error={touched[`campaignTasks[${index}].${fieldName}`] && !!errors['campaignTasks']?.[index]?.[fieldName]}
        helperText={touched[`campaignTasks[${index}].${fieldName}`] && errors['campaignTasks']?.[index]?.[fieldName]}
        minDate={minDate}
        maxDate={maxDate}
        handleClear={handleClear}
      />
    </Grid>
  );
};

export default function TaskForm({ isLoading, isEdit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const styles = StepperStyle(theme);
  const [userList, setUserList] = useState([]);

  const { values, handleChange, handleBlur, setFieldValue, touched, errors } = useFormikContext();

  const { isLoading: userListingLoading } = useQuery(['user'], () => api.getUsersList(''), {
    onSuccess: (response) => {
      setUserList(response?.data?.content || []);
    },
    onError: (err) => {
      dispatch(
        setToastMessage({
          message: err.response?.data?.message || 'Error fetching users',
          variant: 'error'
        })
      );
    }
  });

  const getMinDateForAssignment = (index) => {
    return values.startDateTime ? new Date(values.startDateTime) : new Date();
  };

  const getMaxDateForAssignment = () => {
    return values.endDateTime ? new Date(values.endDateTime) : undefined;
  };

  const getMinDateForCompletion = (index) => {
    const assignedDate = values.campaignTasks[index].assignedDate;
    return assignedDate ? new Date(assignedDate) : undefined;
  };

  const canShowDeleteButton = (values, isEdit) => {
    return values.campaignTasks.length > 1 && isEdit;
  };

  return (
    <FieldArray name="campaignTasks">
      {({ remove }) => (
        <>
          {values.campaignTasks.map((item, index) => (
            <Box sx={{ ...styles.moreBox, pb: 1 }} key={item.id || `task-${index}`}>
              <Grid container spacing={3}>
                <TaskDescriptionField
                  index={index}
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  isLoading={isLoading}
                  isEdit={isEdit}
                />

                <AssignToField
                  index={index}
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                  isLoading={isLoading}
                  userList={userList}
                  userListingLoading={userListingLoading}
                />

                <DateField
                  index={index}
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                  fieldName="assignedDate"
                  label="Assign Date"
                  minDate={getMinDateForAssignment(index)}
                  maxDate={getMaxDateForAssignment()}
                />

                <DateField
                  index={index}
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                  fieldName="targetCompletionDate"
                  label="Target Completion Date"
                  minDate={getMinDateForCompletion(index)}
                  maxDate={getMaxDateForAssignment()}
                />

                <Grid item xs={12}>
                  <Box sx={styles.deleteIcon}>
                    {canShowDeleteButton(values, isEdit) && (
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIconRed />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
    </FieldArray>
  );
}
