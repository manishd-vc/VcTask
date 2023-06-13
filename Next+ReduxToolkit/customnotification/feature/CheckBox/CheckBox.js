import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './CheckBox.module.css';

const CheckBox = () => {
  const finalList = useSelector((state) => state.checkBoxList.checkList);
  const buttons = useSelector((state) => state.checkBoxList.buttons);
  const [activeStep, setActiveStep] = useState(1);
  const [checked, setChecked] = useState(() => getLabelCheck(activeStep));
  console.log('checked', checked);
  function getLabelCheck(activeStep) {
    if (activeStep === 4) return;
    let temp = {};
    finalList.forEach(({ id, priority }) => {
      temp = { ...temp, [id]: activeStep === priority };
    });
    return temp;
  }

  const updateActiveStep = (value) => {
    const newValue = +value;
    setActiveStep(newValue);
    if (newValue !== 4) {
      setChecked(getLabelCheck(newValue));
    }
  };

  return (
    <div>
      <div className={styles.buttonWrapper}>
        {buttons?.map((item, index) => (
          <button
            value={+item.value}
            key={index}
            onClick={(e) => updateActiveStep(e.target.value)}
            className={activeStep === item.value ? styles.active : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form>
        {finalList?.map((item) => (
          <div className='checkBoxWrapper' key={item.id}>
            <input
              type='checkbox'
              id={`vehicle${item.id}`}
              name={`vehicle${item.id}`}
              value={`vehicle${item.id}`}
              checked={checked[item?.id] || false}
              onChange={() => {
                setActiveStep(4);
                setChecked((pre) => ({
                  ...pre,
                  [`${item?.id}`]: !pre[item?.id],
                }));
              }}
            />
            <label htmlFor='vehicle1'> {item.text}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default CheckBox;
