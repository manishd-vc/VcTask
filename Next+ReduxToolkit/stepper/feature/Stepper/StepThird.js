import { useSelector } from 'react-redux';

const StepThird = () => {
  const stepperState = useSelector((state) => state.stepperData);

  const finalListOfUser = stepperState.selectedUserData;
  console.log('finalListOfUser', finalListOfUser);
  return (
    <div className='stepThird'>
      {Boolean(finalListOfUser?.length) && (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User name</th>
              <th>User designation</th>
            </tr>
          </thead>
          <tbody>
            {finalListOfUser.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.userName}</td>
                <td>{item.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StepThird;
