import { Button, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow, BackDisabledArrow, NextDisabledArrow } from 'src/components/icons';
import Steppers from 'src/components/stepper/stepper';
import { nextStep, previousStep } from 'src/redux/slices/stepper';
import CampaignStep1 from './CampaignStep1';
import CampaignStep2 from './CampaignStep2';
import CampaignStep3 from './CampaignStep3';

export default function CampaignStepper() {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state) => state?.stepper);
  const buttonStartIcon = activeStep === 0 ? <BackDisabledArrow /> : <BackArrow />;
  const buttonDisabled = activeStep === 0;
  const buttonVariant = activeStep === 0 ? 'contained' : 'outlined';
  const stepCount = 3;

  const handleBack = () => {
    if (activeStep > 0) {
      dispatch(previousStep());
    }
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  return (
    <Steppers stepCount={0} activeStep={activeStep} steps={['Step One', 'Step Two', 'Step Three']}>
      {activeStep === 0 && <CampaignStep1 />}
      {activeStep === 1 && <CampaignStep2 />}
      {activeStep === 2 && <CampaignStep3 />}
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
