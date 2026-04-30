// src/components/timePicker.jsx
'use client';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PropTypes from 'prop-types';

TimePickers.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
  label: PropTypes.string.isRequired,
  handleClear: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string
};

export default function TimePickers({
  onChange,
  value,
  label,
  handleClear,
  disabled,
  error,
  helperText,
  size = 'small',
  variant = 'standard'
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            size={size}
            variant={variant}
            {...params}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps?.endAdornment}
                  {!disabled && value && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear} edge="end" size="small">
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
      />
    </LocalizationProvider>
  );
}
