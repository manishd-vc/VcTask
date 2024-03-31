import { useState } from 'react';
import Style from './AddExpenses.style';

function AddExpenses({updateFunction}) {
  const [id , setId] = useState("");
  const [name , setName] = useState("");
  const [cost , setCost] = useState("");

  const saveList = (event) => {
    event.preventDefault();
    const data = {
      id: new Date().valueOf(),
      name: name,
      cost: cost,
    };
    updateFunction(data);
    setId("");
    setName("");
    setCost("");
  };

  return (
    <form
      style={Style.expenseWrapper}
      onSubmit={(event) => saveList(event)}
    >
      <div className='inputField' style={Style.inputField}>
        <label htmlFor='name' style={Style.fieldLabel}>
          Name
        </label>
        <input
          type='text'
          id='name'
          placeholder='Type Name'
          style={Style.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className='inputField' style={Style.inputField}>
        <label htmlFor='cost' style={Style.fieldLabel}>
          Cost
        </label>
        <input
          type='number'
          id='cost'
          placeholder='Input Cost'
          style={Style.input}
          value={cost}
          onChange={(event) => setCost(event.target.value)}
          required
        />
      </div>
      <button style={Style.saveButton} type='submit'>
        Save
      </button>
    </form>
  );

}

export default AddExpenses;
