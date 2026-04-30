export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root': {
            right: theme.spacing(2),
            padding: '0.5rem',
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.primary.main
            },
            '&.Mui-disabled': {
              color: theme.palette.action.disabled
            }
          },
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.primary }
          }
        },
        input: {
          padding: theme.spacing(1, 0.5, 1, 0),
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
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary.darker,
          fontSize: '18px',
          fontWeight: 300,
          '&.Mui-focused': {
            color: theme.palette.greytheme[500],
            fontSize: '18px'
          },
          '&.Mui-error': {
            color: theme.palette.greytheme[500]
          },
          '&.Mui-disabled': {
            color: theme.palette.secondary.darker,
            opacity: '0.3'
          }
        }
      }
    },

    MuiInput: {
      styleOverrides: {
        root: {
          '&.MuiInput-root': {
            color: theme.palette.secondary.darker,
            fontWeight: 400,
            '& .Mui-disabled.MuiInputBase-input': {
              WebkitTextFillColor: theme.palette.secondary.darker,
              opacity: '0.3'
            }
          },
          '&.Mui-error': {
            color: theme.palette.error.main
          }
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.greytheme[100]
          },
          '&:after': {
            borderBottomColor: theme.palette.secondary.darker,
            borderBottomWidth: '2px'
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: theme.palette.greytheme[100],
            borderBottomWidth: '1px'
          },
          '&.Mui-error:before': {
            borderBottomColor: theme.palette.error.main,
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid'
          },
          '&.Mui-error:after': {
            borderBottomColor: theme.palette.error.main,
            borderBottomWidth: '2px'
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16]
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground
          }
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56]
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32]
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground
            }
          }
        }
      }
    },
    MuiOtpInput: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          borderRadius: '4px',
          textAlign: 'center',
          margin: '0 8px'
        },
        focused: {
          borderColor: '#1976d2',
          outline: 'none'
        },
        error: {
          borderColor: '#d32f2f'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          position: 'absolute',
          right: theme.spacing(1),
          pointerEvents: 'none'
        }
      }
    }
  };
}
