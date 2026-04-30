import { FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import TextEditor from 'src/components/textEditor/textEditor';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';

export default function WaiverDetails() {
  const { values, setFieldValue } = useFormikContext();
  const [waiverFormContent, setWaiverFormContent] = useState('');
  const dispatch = useDispatch();

  useQuery(['volunteer_waiver_template'], volunteerApi.getVolunteerWaiverTemplate, {
    enabled: values.waiverRequired && !waiverFormContent,
    onSuccess: (response) => {
      if (values.waiverRequired && !waiverFormContent) {
        const content = response?.data?.content || '';
        setWaiverFormContent(content);
        setFieldValue('waiverFormContent', content);
      }
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response?.data?.message || 'Failed to load waiver template',
          variant: 'error'
        })
      );
    }
  });

  useEffect(() => {
    setWaiverFormContent(values?.waiverFormContent || '');
  }, [values?.waiverFormContent]);

  const handleWaiverFormContentChange = (content) => {
    setWaiverFormContent(content);
    setFieldValue('waiverFormContent', content);
  };

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Waiver Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="waiver-radio-buttons-group-label" sx={{ mb: 1 }}>
              <Typography variant="body3" component="p" color="text.secondary">
                Is Waiver required for this campaign?
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={values.waiverRequired ? 'true' : 'false'}
              onChange={(e) => {
                setFieldValue('waiverRequired', e.target.value === 'true');
                if (e.target.value === 'false') {
                  setWaiverFormContent('');
                  setFieldValue('waiverFormContent', '');
                }
              }}
            >
              <FormControlLabel value="true" control={<Radio />} sx={{ mr: 3 }} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      {values.waiverRequired && (
        <TextEditor
          setLatterValues={handleWaiverFormContentChange}
          latterValues={waiverFormContent}
          paperSx={{ padding: 0 }}
        />
      )}
    </Paper>
  );
}
