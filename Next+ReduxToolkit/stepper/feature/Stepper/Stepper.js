import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import StepThird from './StepThird';
import { setNextStep, setPreviousStep } from './stepperSlice';

const stepContent = [
  {
    id: 1,
    content: <StepFirst />,
  },
  {
    id: 2,
    content: <StepSecond />,
  },
  {
    id: 3,
    content: <StepThird />,
  },
];

const Stepper = () => {
  const dispatch = useDispatch();
  const stepperState = useSelector((state) => state.stepperData);
  const { userName, designation } = stepperState.selectedUser;
  const { activeStep, selectedUserId } = stepperState;
  const getDisabled = () => {
    if (activeStep === 1 && userName !== '' && designation !== '') {
      return false;
    } else if (activeStep === 2 && selectedUserId.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div>
      <div className='stepWrapper'>
        {stepperState?.steps?.map((item, index) => (
          <button
            key={index}
            className={`${
              index === stepperState.activeStep - 1 ? 'active' : ''
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className='stepBody'>
        {stepContent?.map((item) => (
          <React.Fragment key={item.id}>
            {item.id === stepperState.activeStep ? item.content : null}
          </React.Fragment>
        ))}
      </div>
      <div className='navigationButton'>
        <button
          className='previousButton'
          onClick={() => dispatch(setPreviousStep())}
        >
          Previous
        </button>
        <button
          className='nextButton'
          disabled={getDisabled()}
          onClick={() => dispatch(setNextStep())}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Stepper;
