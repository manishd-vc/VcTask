const SelectBox = ({ value, label, options, name, changeSelect }) => {
  return (
    <div className='selectBoxWrapper'>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} onChange={changeSelect}>
        <option value=''>Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
