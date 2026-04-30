import { DropDownArrow } from 'src/components/icons';

export default function AutoComplete() {
  return {
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: <DropDownArrow />
      },
      styleOverrides: {
        root: {
          '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
            paddingRight: 75
          }
        }
      }
    }
  };
}
