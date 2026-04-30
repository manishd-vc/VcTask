export default function DateTimePicker(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: theme.palette.grey[900]
          }
        }
      }
    }
  };
}
