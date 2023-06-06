import { useDispatch, useSelector } from 'react-redux';
import styles from './CheckBox.module.css';
import { useState } from 'react';
import { updateCheckBox } from './checkBoxSlice';

const buttons = [
  { value: '1', label: '0%' },
  { value: '2', label: '25%' },
  { value: '3', label: '50%' },
  { value: '4', label: '100%' },
];

const CheckBox = () => {
  const dispatch = useDispatch();
  const finalList = useSelector((state) => state.checkBoxList);
  const [activeStep, setActiveStep] = useState('1');

  const updateActiveStep = (value) => {
    setActiveStep(value);
  };

  console.log('activeStep', activeStep);
  console.log('finalList', finalList);
  return (
    <div>
      <div className={styles.buttonWrapper}>
        {buttons?.map((item, index) => (
          <button
            value={item.value}
            key={index}
            onClick={(e) => updateActiveStep(e.target.value)}
            className={item.value === activeStep ? styles.active : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form>
        {finalList?.checkList?.map((item) => (
          <div className='checkBoxWrapper'>
            <input
              type='checkbox'
              id={`vehicle${item.id}`}
              name={`vehicle${item.id}`}
              value={`vehicle${item.id}`}
              checked={item.priority == activeStep ? true : false}
              onChange={() => {
                let tempData = [...finalList?.checkList];

                const selectedIndex = finalList?.checkList.findIndex(
                  (data) => data.id === item?.id
                );

                console.log('tempData', tempData[selectedIndex], activeStep);
                tempData[selectedIndex] = {
                  ...tempData[selectedIndex],
                  priority: activeStep,
                };
                dispatch(updateCheckBox({ updatedList: tempData }));
              }}
            />
            <label for='vehicle1'> {item.text}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default CheckBox;
