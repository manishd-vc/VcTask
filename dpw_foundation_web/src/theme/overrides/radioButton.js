import { Radio, RadioChecked } from 'src/components/icons';

export default function RadioButton(theme) {
  return {
    MuiRadio: {
      defaultProps: {
        icon: <Radio />,
        checkedIcon: <RadioChecked />
      },
      styleOverrides: {
        root: {
          padding: 0,
          marginRight: theme.spacing(3),
          marginBottom: theme.spacing(1),
          marginTop: theme.spacing(1),
          color: theme.palette.secondary.darker
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: theme.palette.common.black
        }
      }
    }
  };
}
