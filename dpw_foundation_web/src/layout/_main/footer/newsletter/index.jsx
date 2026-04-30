'use client';
import React from 'react';
import { toast } from 'react-hot-toast';

// mui
import { LoadingButton } from '@mui/lab';
import { FormControl, Stack, TextField } from '@mui/material';

// formik
import { Form, FormikProvider, useFormik } from 'formik';

// api
import { useMutation } from 'react-query';
import * as api from 'src/services';

export default function NewsLetter() {
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      if (values.email.toLowerCase().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
        setLoading(true);
        mutate(values);
      } else {
        toast.error('Invalid email!');
      }
    }
  });

  const { mutate } = useMutation(api.sendNewsletter, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      formik.resetForm();
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    }
  });

  const { handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack sx={{}} direction="row" alignItems="center" spacing={2}>
          <FormControl fullWidth variant="outlined">
            <TextField
              size="large"
              placeholder="Enter your Email"
              {...getFieldProps('email')}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: (theme) => theme.palette.background.paper
                }
              }}
            />
          </FormControl>
          <LoadingButton
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            loading={loading}
            sx={{ marginTop: 8, paddingX: 4, minHeight: 56 }}
          >
            Subscribe
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
