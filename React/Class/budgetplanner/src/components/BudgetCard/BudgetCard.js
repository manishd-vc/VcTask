import react from 'react';
import Style from './BudgetCard.style';

class BudgetCard extends react.Component {
  render() {
    return (
      <div
        className='card'
        style={{ ...Style.card, backgroundColor: `${this.props.bgColor}` }}
      >
        <label htmlFor={this.props.label} style={Style.label}>
          {this.props.label}:
        </label>
        <input
          type='text'
          id={this.props.label}
          style={Style.input}
          value={this.props.value}
          readOnly={this.props.readOnly || false}
          onChange={(event) => this.props.updateMainBudget(event.target.value)}
        />
        {this.props.updateButton && this.props.readOnly && (
          <button
            style={{
              ...Style.fieldButton,
              backgroundColor: this.props.readOnly ? '#424242' : '#1e8723',
            }}
            onClick={() => this.props.onEdit()}
          >
            Edit
          </button>
        )}
        {this.props.updateButton && !this.props.readOnly && (
          <button
            style={{
              ...Style.fieldButton,
              backgroundColor: this.props.readOnly ? '#424242' : '#1e8723',
            }}
            onClick={() => this.props.updateValue()}
          >
            Save
          </button>
        )}
      </div>
    );
  }
}
export default BudgetCard;
