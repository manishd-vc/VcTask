import { DropDownArrow } from 'src/components/icons';

export default function Select(theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: DropDownArrow
      },
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.primary }
          },
          '& .MuiSelect-icon': {
            position: 'absolute',
            right: '1rem!important',
            top: 'calc(50% - 0.5em)',
            pointerEvents: 'none',
            color: '#A9A9AC'
          }
        },
        select: {
          height: '1.75rem',
          paddingTop: '0.375rem',
          paddingRight: '2.375rem',
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.primary
          },
          '&.MuiInputBase-input': {
            fontWeight: 400
          },
          '&:not(:placeholder-shown)': {
            fontWeight: 400
          }
        }
      }
    }
  };
}
