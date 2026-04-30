import { Button, Paper, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow, BackDisabledArrow, NextDisabledArrow } from 'src/components/icons';
import Steppers from 'src/components/stepper/stepper';
import { nextStep, previousStep } from 'src/redux/slices/stepper';
import EnrollVolunteerStep1 from './EnrollVolunteerStep1';
import EnrollVolunteerStep2 from './EnrollVolunteerStep2';

export default function EnrollVolunteerRequestStepper() {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state) => state?.stepper);
  const buttonStartIcon = activeStep === 0 ? <BackDisabledArrow /> : <BackArrow />;
  const buttonDisabled = activeStep === 0;
  const buttonVariant = activeStep === 0 ? 'contained' : 'outlined';
  const stepCount = 2;

  const handleBack = () => {
    if (activeStep > 0) {
      dispatch(previousStep());
    }
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  return (
    <Steppers stepCount={0} activeStep={activeStep} steps={['Step One', 'Step Two']}>
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        {activeStep === 0 && <EnrollVolunteerStep1 />}
        {activeStep === 1 && <EnrollVolunteerStep2 />}
      </Paper>
      <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ pt: 2 }}>
        <Button
          variant={buttonVariant}
          type="button"
          disabled={buttonDisabled}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={buttonStartIcon}
        >
          Previous
        </Button>
        <Button
          endIcon={<NextDisabledArrow />}
          type="button"
          onClick={handleNext}
          disabled={activeStep === stepCount - 1}
          variant="contained"
        >
          Next
        </Button>
      </Stack>
    </Steppers>
  );
}
