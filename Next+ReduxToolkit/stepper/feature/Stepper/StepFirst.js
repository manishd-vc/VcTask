import { useDispatch, useSelector } from 'react-redux';
import SelectBox from './SelectBox';
import { updateSelectedUser } from './stepperSlice';

const userOptions = [
  { value: 'manish', label: 'Option 1' },
  { value: 'raj', label: 'Option 2' },
  { value: 'geroege', label: 'Option 3' },
  { value: 'krunal', label: 'Option 4' },
];

const designationOptions = [
  { value: 'html', label: 'Option 1' },
  { value: 'react', label: 'Option 2' },
  { value: 'node', label: 'Option 3' },
  { value: 'css', label: 'Option 4' },
];
const StepFirst = () => {
  const dispatch = useDispatch();
  const stepperState = useSelector((state) => state.stepperData);

  const { userName, designation } = stepperState.selectedUser;

  const handleUserChange = (event) => {
    dispatch(updateSelectedUser({ [event.target.name]: event.target.value }));
  };
  return (
    <div className='firstStep'>
      <SelectBox
        name='userName'
        label='select user'
        value={userName}
        options={userOptions}
        changeSelect={handleUserChange}
      />
      <SelectBox
        name='designation'
        label='select designation'
        value={designation}
        options={designationOptions}
        changeSelect={handleUserChange}
      />
    </div>
  );
};

export default StepFirst;
