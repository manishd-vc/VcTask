import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedUserId } from './stepperSlice';

const StepSecond = () => {
  const stepperState = useSelector((state) => state.stepperData);
  const dispatch = useDispatch();
  const { userList, selectedUserId } = stepperState;

  const handleCheckboxChange = (event, id) => {
    let stampSelectedUserId = [...selectedUserId];
    if (event.target.checked) {
      stampSelectedUserId = [...stampSelectedUserId, id];
    } else {
      stampSelectedUserId = stampSelectedUserId.filter((item) => item !== id);
    }
    dispatch(updateSelectedUserId(stampSelectedUserId));
  };
  const handleCheckAll = (event) => {
    let userIdList = userList.map((item) => item.id);
    if (event.target.checked) {
      dispatch(updateSelectedUserId(userIdList));
    } else {
      dispatch(updateSelectedUserId([]));
    }
  };
  return (
    <div className='stepSecond'>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                checked={userList.length === selectedUserId.length}
                onChange={(event) => handleCheckAll(event)}
              />
            </th>
            <th>User ID</th>
            <th>User name</th>
            <th>User designation</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type='checkbox'
                  onChange={(event) => handleCheckboxChange(event, item.id)}
                  checked={selectedUserId.includes(item.id)}
                />
              </td>
              <td>{item.id}</td>
              <td>{item.userName}</td>
              <td>{item.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StepSecond;
