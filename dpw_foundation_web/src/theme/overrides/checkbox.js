import { SvgIcon } from '@mui/material';

function Icon(props) {
  return (
    <SvgIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="black" strokeWidth="1" fill="none" />
    </SvgIcon>
  );
}

function CheckedIcon(props) {
  return (
    <SvgIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0C0C14" />
      <path d="M7 12.5l3 3 6-7" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  );
}

function IndeterminateIcon(props) {
  return (
    <SvgIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0C0C14" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </SvgIcon>
  );
}

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <Icon />,
        checkedIcon: <CheckedIcon />,
        indeterminateIcon: <IndeterminateIcon />
      },

      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.action.disabled
          },
          '& .MuiSvgIcon-fontSizeMedium': {
            width: 24,
            height: 24
          },
          '& .MuiSvgIcon-fontSizeSmall': {
            width: 20,
            height: 20
          },
          svg: {
            fontSize: 24,
            '&[font-size=small]': {
              fontSize: 20
            }
          }
        }
      }
    }
  };
}
