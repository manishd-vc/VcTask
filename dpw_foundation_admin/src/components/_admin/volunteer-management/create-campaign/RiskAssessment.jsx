import { Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
import RiskForm from '../../campaign/steps/riskForm';

export default function RiskAssessment() {
  const { values, setFieldValue, touched, errors, handleBlur, setFieldError } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const commonData = getLabelObject(masterData, 'dpw_foundation_common_yes_no');
  const severityData = getLabelObject(masterData, 'dpwf_volunteer_severity');
  const likelyhoodData = getLabelObject(masterData, 'dpwf_volunteer_likelyhood');
  const riskLevelData = getLabelObject(masterData, 'dpwf_volunteer_risk_level');

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Stack
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" textTransform={'uppercase'} color="text.black">
          Risk Assessment
        </Typography>
        {values?.isRiskAssessmentRequired && (
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              setFieldValue('riskAssessments', [
                ...values.riskAssessments,
                {
                  riskCode: '',
                  riskDescription: '',
                  severity: '',
                  likelihood: '',
                  riskLevel: '',
                  controlMeasures: ''
                }
              ])
            }
          >
            Add more Items
          </Button>
        )}
      </Stack>
      <Grid container spacing={2}>
        {values?.isRiskAssessmentRequired && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card variant="bordered" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondarydark">
                      Total Risks
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {values?.riskAssessments?.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FieldWithSkeleton
            isLoading={false}
            error={touched.isRiskAssessmentRequired && errors.isRiskAssessmentRequired}
          >
            <TextFieldSelect
              id="isRiskAssessmentRequired"
              label={
                <>
                  Is risk assessment done ? 
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isRiskAssessmentRequired ? 'yes' : 'no'}
              onChange={(e) => {
                setFieldValue('isRiskAssessmentRequired', e.target.value === 'yes');
                if (e.target.value === 'yes') {
                  setFieldValue('riskAssessments', [
                    {
                      riskCode: '',
                      riskDescription: '',
                      severity: '',
                      likelyhood: '',
                      riskLevel: '',
                      controlMeasure: ''
                    }
                  ]);
                } else {
                  setFieldError('riskAssessments', null);
                  setFieldValue('riskAssessments', []);
                }
              }}
              name="isRiskAssessmentRequired"
              onBlur={handleBlur}
              itemsData={commonData?.values}
              error={touched.isRiskAssessmentRequired && errors.isRiskAssessmentRequired}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      {values?.isRiskAssessmentRequired && (
        <Grid item xs={12} md={12}>
          <RiskForm
            formName="riskAssessments"
            isEdit={true}
            isVolunteer={true}
            severityData={severityData}
            likelyhoodData={likelyhoodData}
            riskLevelData={riskLevelData}
          />
        </Grid>
      )}
    </Paper>
  );
}
