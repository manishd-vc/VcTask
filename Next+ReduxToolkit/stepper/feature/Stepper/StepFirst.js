import { useDispatch, useSelector } from 'react-redux';
import SelectBox from './SelectBox';
import { setDesignation, setUser } from './stepperSlice';

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
  console.log('stepperState', stepperState);
  const handleUserChange = (event) => {
    dispatch(setUser(event.target.value));
  };
  const handleDesignationChange = (event) => {
    dispatch(setDesignation(event.target.value));
  };
  return (
    <div className='firstStep'>
      <SelectBox
        name='user'
        label='select user'
        value={stepperState.selectedUser}
        options={userOptions}
        changeSelect={handleUserChange}
      />
      <SelectBox
        name='designation'
        label='select designation'
        value={stepperState.selectedDesignation}
        options={designationOptions}
        changeSelect={handleDesignationChange}
      />
      {/* <select name='user' id='user'>
        <option value='manish'>Manish</option>
        <option value='raj'>Raj</option>
        <option value='george'>George</option>
        <option value='krunal'>Krunal</option>
      </select>
      <select name='designation' id='designation'>
        <option value='html'>Html</option>
        <option value='node'>Node</option>
        <option value='ionic'>Ionic</option>
        <option value='react'>React</option>
      </select> */}
    </div>
  );
};

export default StepFirst;
