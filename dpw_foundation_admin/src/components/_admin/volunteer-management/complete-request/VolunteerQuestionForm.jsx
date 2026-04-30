import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import QuestionDeleteButton from '../../campaign/steps/questionDeleteButton';
import QuestionTextField from '../../campaign/steps/questionTextField';
import StepperStyle from '../../campaign/steps/stepper.styles';

const VolunteerQuestionForm = ({ values, isLoading, remove, mode, isAnswerMode, isCreateMode }) => {
  const theme = useTheme();

  const styles = StepperStyle(theme);
  const { touched, errors, handleBlur, handleChange } = useFormikContext();

  return (
    <>
      {values.questions?.map((question, index) => (
        <Box sx={{ ...styles.moreBox, pb: 2 }} key={question.id || `volunteer-question-${index}`}>
          {isAnswerMode ? (
            <Grid container rowSpacing={2} spacing={2}>
              <Grid item xs={12} md={4}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Question
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {values?.questions[index]?.questionText || '—'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Target Unit
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {values?.questions[index]?.targetUnit || '—'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Target Value
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {values?.questions[index]?.targetValue || '—'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].achieveValue`}
                  values={values?.questions[index]?.achieveValue}
                  touched={touched?.questions?.[index]?.achieveValue}
                  errors={errors?.questions?.[index]?.achieveValue}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Enter Achieved Value"
                  isNumberOnly={true}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Variance
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {values?.questions[index]?.variance || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack flexDirection={'column'} gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {values?.questions[index]?.rateDifference || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Grid container rowSpacing={2} spacing={2}>
              <Grid item xs={12}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].questionText`}
                  values={values?.questions[index]?.questionText}
                  touched={touched?.questions?.[index]?.questionText}
                  errors={errors?.questions?.[index]?.questionText}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Enter Question"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].targetUnit`}
                  values={values?.questions[index]?.targetUnit}
                  touched={touched?.questions?.[index]?.targetUnit}
                  errors={errors?.questions?.[index]?.targetUnit}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Enter Target Unit"
                  readOnly={isAnswerMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].targetValue`}
                  values={values?.questions[index]?.targetValue}
                  touched={touched?.questions?.[index]?.targetValue}
                  errors={errors?.questions?.[index]?.targetValue}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Enter Target Value"
                  readOnly={isAnswerMode}
                  isNumberOnly={true}
                />
              </Grid>
            </Grid>
          )}

          {isAnswerMode && (
            <>
              {/* <Grid item xs={12} md={6}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].variance`}
                  values={values?.questions[index]?.variance || '-'}
                  touched={false}
                  errors={false}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Variance"
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <QuestionTextField
                  index={index}
                  name={`questions[${index}].rateDifference`}
                  values={
                    values?.questions[index]?.rateDifference ? `${values?.questions[index]?.rateDifference}%` : '-'
                  }
                  touched={false}
                  errors={false}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Success Rate"
                  readOnly={true}
                />
              </Grid> */}
            </>
          )}

          {isCreateMode && <QuestionDeleteButton index={index} remove={remove} />}
        </Box>
      ))}
    </>
  );
};

VolunteerQuestionForm.propTypes = {
  values: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  remove: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  isAnswerMode: PropTypes.bool.isRequired,
  isCreateMode: PropTypes.bool.isRequired
};

export default VolunteerQuestionForm;
