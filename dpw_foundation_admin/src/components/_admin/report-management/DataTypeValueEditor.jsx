import { FormControl, TextField } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import {
  createBetweenHandlers,
  formatDropdownOptions,
  getBooleanOptions,
  parseBetweenValues,
  renderBetweenFields,
  renderSelect
} from 'src/utils/dataTypeValueHelpers';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { getLocaleDateString } from 'src/utils/formatTime';

function DataTypeValueEditor({ props, moduleFields }) {
  const { masterData } = useSelector((state) => state?.common);
  const selectedField = moduleFields.find((field) => field.backendColumn === props.field);
  const dataType = selectedField?.columnType || 'varchar';
  const masterDataKey = selectedField?.masterDataKey;
  const fieldKey = `${props.field}-${dataType}`;
  const isBetweenOperator = props.operator === 'between' || props.operator === 'notBetween';
  const isInOperator = props.operator === 'in' || props.operator === 'notIn';
  const isDateType = dataType === 'timestamp' || dataType === 'date';
  const prevOperator = useRef(props.operator);

  // Reset value when operator changes
  useEffect(() => {
    if (prevOperator.current !== props.operator) {
      props.handleOnChange('');
      prevOperator.current = props.operator;
    }
  }, [props.operator, props.handleOnChange]);

  // Get dropdown options from masterData using getLabelObject
  const dropdownOptions = masterDataKey ? getLabelObject(masterData, masterDataKey)?.values || [] : [];
  const textField = useMemo(() => {
    const commonProps = {
      variant: 'standard',
      fullWidth: true
    };

    // Handle in/notin operators - comma-separated values
    if (isInOperator) {
      return (
        <TextField
          key={fieldKey}
          {...commonProps}
          label="Enter values"
          value={props.value || ''}
          onChange={(e) => props.handleOnChange(e.target.value)}
        />
      );
    }

    // Handle between operators
    if (isBetweenOperator && (isDateType || dataType === 'numeric')) {
      const { fromValue, toValue } = parseBetweenValues(props.value);
      const { handleFromChange, handleToChange } = createBetweenHandlers(fromValue, toValue, props.handleOnChange);
      const fieldType = isDateType ? 'date' : 'number';

      return renderBetweenFields(
        fieldKey,
        commonProps,
        fromValue,
        toValue,
        handleFromChange,
        handleToChange,
        fieldType
      );
    }
    // Regular single field handling
    const singleFieldProps = {
      ...commonProps,
      value: props.value || '',
      onChange: (e) => props.handleOnChange(e.target.value)
    };

    // If field has masterDataKey, show dropdown
    if (masterDataKey) {
      const formattedOptions = formatDropdownOptions(dropdownOptions);
      return renderSelect(fieldKey, props.value, props.handleOnChange, formattedOptions, 'Select value');
    }

    switch (dataType) {
      case 'boolean':
        return renderSelect(fieldKey, props.value, props.handleOnChange, getBooleanOptions());
      case 'numeric':
        return <TextField key={fieldKey} {...singleFieldProps} label="Enter Number" type="number" />;
      case 'timestamp':
      case 'date':
        return (
          <DatePickers
            key={fieldKey}
            inputFormat={getLocaleDateString(false)}
            value={props.value ? new Date(props.value) : null}
            onChange={(newValue) => props.handleOnChange(newValue ? newValue : '')}
            label="Select Date"
            type={'date'}
            handleClear={() => props.handleOnChange('')}
          />
        );
      case 'text':
        return <TextField key={fieldKey} {...singleFieldProps} label="Enter value" />;
      default:
        return <TextField key={fieldKey} {...singleFieldProps} label="Enter value" />;
    }
  }, [
    dataType,
    props.value,
    props.handleOnChange,
    props.operator,
    fieldKey,
    isBetweenOperator,
    isInOperator,
    isDateType,
    masterDataKey,
    dropdownOptions
  ]);

  return (
    <FormControl fullWidth size="small" variant="standard">
      {textField}
    </FormControl>
  );
}

export default React.memo(DataTypeValueEditor);
