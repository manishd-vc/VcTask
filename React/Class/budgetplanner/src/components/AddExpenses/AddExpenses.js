import react from 'react';
import Style from './AddExpenses.style';

class AddExpenses extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      cost: '',
    };
  }
  getName = (event) => {
    this.setState({
      name: event.target.value,
    });
  };
  getCost = (event) => {
    this.setState({
      cost: event.target.value,
    });
  };
  saveList = (event) => {
    event.preventDefault();
    const data = {
      id: new Date().valueOf(),
      name: this.state.name,
      cost: this.state.cost,
    };
    this.props.updateFunction(data);
    this.setState({
      id: '',
      name: '',
      cost: '',
    });
  };

  render() {
    return (
      <form
        style={Style.expenseWrapper}
        onSubmit={(event) => this.saveList(event)}
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
            value={this.state.name}
            onChange={(event) => this.getName(event)}
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
            value={this.state.cost}
            onChange={(event) => this.getCost(event)}
            required
          />
        </div>
        <button style={Style.saveButton} type='submit'>
          Save
        </button>
      </form>
    );
  }
}
export default AddExpenses;
