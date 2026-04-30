import { Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import TaskForm from '../../campaign/steps/taskForm';

export default function CampaignRelatedTask() {
  const { values, setFieldValue, touched, errors, handleBlur, setFieldError } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const commonData = getLabelObject(masterData, 'dpw_foundation_common_yes_no');

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={3}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black">
          {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '} related tasks
        </Typography>
        {values?.isSubtaskRequired && (
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              setFieldValue('campaignTasks', [
                ...values.campaignTasks,
                {
                  taskDescription: '',
                  taskMeasure: 'Unit',
                  assignedDate: '',
                  targetCompletionDate: '',
                  taskAssigneeId: ''
                }
              ])
            }
          >
            Add more Items
          </Button>
        )}
      </Stack>
      <Grid container spacing={2}>
        {values?.isSubtaskRequired && (
          <Grid item xs={12} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card variant="bordered">
                  <CardContent>
                    <Typography variant="body2" color="text.secondarydark">
                      Total {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}Related Task
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {values?.campaignTasks.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton isLoading={false} error={touched.isSubtaskRequired && errors.isSubtaskRequired}>
            <TextFieldSelect
              id="isSubtaskRequired"
              label={
                <>
                  Is there any sub task associated with this{' '}
                  {values?.campaignType === 'CHARITY' ? 'Project' : 'Campaign'}?{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isSubtaskRequired ? 'yes' : 'no'}
              onChange={(e) => {
                setFieldValue('isSubtaskRequired', e.target.value === 'yes');
                if (e.target.value === 'yes') {
                  setFieldValue('campaignTasks', [
                    {
                      taskDescription: '',
                      taskMeasure: 'Unit',
                      taskAssigneeId: '',
                      assignedDate: '',
                      targetCompletionDate: ''
                    }
                  ]);
                } else {
                  setFieldError('campaignTasks', null);
                  setFieldValue('campaignTasks', []);
                }
              }}
              name="isSubtaskRequired"
              onBlur={handleBlur}
              itemsData={commonData?.values}
              error={touched.isSubtaskRequired && errors.isSubtaskRequired}
            />
          </FieldWithSkeleton>
        </Grid>
        {values?.isSubtaskRequired && (
          <Grid item xs={12} md={12}>
            <TaskForm isLoading={false} isEdit={true} isVolunteer={true} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
