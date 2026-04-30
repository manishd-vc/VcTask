'use client';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PropTypes from 'prop-types';
import { getLocaleDateString } from 'src/utils/formatTime';
import { CalendarIcon } from './icons';
DatePickers.propTypes = {
  // 'onChange' is a function to handle the date change event
  onChange: PropTypes.func.isRequired,

  // 'value' is the selected date value (likely a string or Date object)
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,

  // 'label' is the label for the date picker
  label: PropTypes.string.isRequired,

  // 'minDate' is the minimum allowable date (should be a Date object or string)
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),

  // 'maxDate' is the maximum allowable date (should be a Date object or string)
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),

  // 'disabled' is a boolean to disable the date picker
  disabled: PropTypes.bool,

  // 'type' is the type of the picker, default is 'date'
  type: PropTypes.string,

  // 'handleClear' is a function to handle clearing the selected date
  handleClear: PropTypes.func,

  // 'error' is a boolean indicating whether there is an error
  error: PropTypes.bool,

  // 'helperText' is a string that provides additional helper text
  helperText: PropTypes.string
};

/**
 * DatePickers Component
 *
 * This component provides date and time picker functionalities. It supports both date and datetime
 * pickers and renders a text field with an optional clear button to remove the selected value.
 * The component handles validation and error messages, and it allows the specification of min/max dates.
 *
 * @param {Object} props - The component props.
 * @param {function} props.onChange - The callback function to handle the change in date/time value.
 * @param {Date} props.value - The current selected value of the picker.
 * @param {string} props.label - The label displayed above the picker.
 * @param {Date} [props.minDate] - The minimum selectable date/time.
 * @param {Date} [props.maxDate] - The maximum selectable date/time.
 * @param {boolean} [props.disabled=false] - Whether the picker is disabled.
 * @param {string} [props.type='date'] - The type of picker ('date' or 'datetime').
 * @param {function} props.handleClear - The function to handle the clearing of the selected value.
 * @param {boolean} [props.error=false] - Whether there's an error with the picker input.
 * @param {string} [props.helperText] - The helper text displayed below the input field.
 *
 * @returns {JSX.Element} The rendered DatePicker or DateTimePicker component.
 */
export default function DatePickers({
  onChange,
  value,
  label,
  minDate,
  maxDate,
  disabled,
  type = 'date',
  handleClear,
  error,
  helperText
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Conditionally render DesktopDatePicker or DateTimePicker based on 'type' */}
      {type === 'date' ? (
        <DesktopDatePicker
          label={label}
          renderInput={(params) => (
            <TextField
              fullWidth
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps?.endAdornment}
                    {/* Show clear button if value is selected and picker is not disabled */}
                    {!disabled && value && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )}
                  </>
                )
              }}
              inputProps={{
                ...params.inputProps,
                readOnly: true
              }}
              error={error}
              helperText={helperText}
            />
          )}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          inputFormat={getLocaleDateString(false)}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          components={{
            OpenPickerIcon: CalendarIcon
          }}
        />
      ) : (
        <DateTimePicker
          fullWidth
          label={label}
          renderInput={(params) => (
            <TextField
              fullWidth
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps?.endAdornment}
                    {/* Show clear button for DateTimePicker as well */}
                    {!disabled && value && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )}
                  </>
                )
              }}
              error={error}
              helperText={helperText}
            />
          )}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          inputFormat={getLocaleDateString(true)}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          components={{
            OpenPickerIcon: CalendarIcon
          }}
        />
      )}
    </LocalizationProvider>
  );
}
