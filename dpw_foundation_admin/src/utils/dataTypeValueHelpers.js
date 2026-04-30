import { Box, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DatePickers from 'src/components/datePicker';

// Helper to parse and handle between operator values
export const parseBetweenValues = (value) => {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return {
    fromValue: values[0] || '',
    toValue: values[1] || ''
  };
};

// Helper to create change handlers for between operators
export const createBetweenHandlers = (fromValue, toValue, handleOnChange) => ({
  handleFromChange: (value) => {
    // If toValue exists and new fromValue is greater, clear toValue
    const newToValue = value && toValue && new Date(value) > new Date(toValue) ? '' : toValue;
    const newValues = [value, newToValue];
    handleOnChange(newValues.join(','));
  },
  handleToChange: (value) => {
    const newValues = [fromValue, value];
    handleOnChange(newValues.join(','));
  }
});

// Helper to render between range fields
export const renderBetweenFields = (
  fieldKey,
  commonProps,
  fromValue,
  toValue,
  handleFromChange,
  handleToChange,
  fieldType
) => {
  const isDate = fieldType === 'date';

  if (isDate) {
    const fromDate = fromValue ? new Date(fromValue) : null;
    const toDate = toValue ? new Date(toValue) : null;

    return (
      <Box key={fieldKey} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'column' }}>
        <DatePickers
          value={fromDate}
          onChange={(newValue) => handleFromChange(newValue ? newValue.toISOString() : '')}
          label="From Date"
          type="date"
          handleClear={() => handleFromChange('')}
        />
        <DatePickers
          value={toDate}
          onChange={(newValue) => handleToChange(newValue ? newValue.toISOString() : '')}
          label="To Date"
          type="date"
          minDate={fromDate}
          handleClear={() => handleToChange('')}
        />
      </Box>
    );
  }

  return (
    <Box key={fieldKey} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        {...commonProps}
        label="From Number"
        type="number"
        value={fromValue}
        onChange={(e) => handleFromChange(e.target.value)}
        sx={{ flex: 1 }}
      />
      <TextField
        {...commonProps}
        label="To Number"
        type="number"
        value={toValue}
        onChange={(e) => handleToChange(e.target.value)}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

// Helper to render dropdown select
export const renderSelect = (fieldKey, value, handleOnChange, options, label = 'Select Value') => (
  <>
    <InputLabel>{label}</InputLabel>
    <Select
      key={fieldKey}
      value={value || ''}
      onChange={(e) => handleOnChange(e.target.value)}
      variant="standard"
      fullWidth
      displayEmpty
    >
      {options.map((option) => (
        <MenuItem key={option.key} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </>
);

// Helper to format dropdown options
export const formatDropdownOptions = (dropdownOptions) =>
  dropdownOptions.map((option) => ({
    key: option.code || option.id,
    value: option.code || option.value || option.id,
    label: option.label || option.name || option.value
  }));

// Helper to get boolean options
export const getBooleanOptions = () => [
  { key: 'true', value: 'true', label: 'True' },
  { key: 'false', value: 'false', label: 'False' }
];

// Helper to get operators for a field
export const parseCommaSeparatedValues = (value) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v);

export const helperLogicalOperator = (combinator) => (combinator ? combinator?.toUpperCase() : 'AND');

export const isCommaSeparated = (value) => typeof value === 'string' && value.includes(',');
