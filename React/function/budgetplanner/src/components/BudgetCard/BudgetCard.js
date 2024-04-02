import Style from './BudgetCard.style';

function BudgetCard(props) {
  const {
    bgColor,
    label,
    value,
    readOnly,
    updateButton,
    onEdit,
    updateValue,
    updateMainBudget,
  } = props;
  return (
    <div
      className='card'
      style={{ ...Style.card, backgroundColor: `${bgColor}` }}
    >
      <label htmlFor={label} style={Style.label}>
        {label}:
      </label>
      <input
        type='text'
        id={label}
        style={Style.input}
        value={value}
        readOnly={readOnly || false}
        onChange={(event) => updateMainBudget(event.target.value)}
      />
      {updateButton && readOnly && (
        <button
          style={{
            ...Style.fieldButton,
            backgroundColor: readOnly ? '#424242' : '#1e8723',
          }}
          onClick={() => onEdit()}
        >
          Edit
        </button>
      )}
      {updateButton && !readOnly && (
        <button
          style={{
            ...Style.fieldButton,
            backgroundColor: readOnly ? '#424242' : '#1e8723',
          }}
          onClick={() => updateValue()}
        >
          Save
        </button>
      )}
    </div>
  );
}

export default BudgetCard;
