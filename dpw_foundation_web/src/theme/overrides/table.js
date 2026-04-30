import { createGradient } from 'src/theme/palette';

export default function Table(theme) {
  return {
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-head': {}
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          textAlign: 'center',
          fontSize: '16px',
          padding: theme.spacing(1.5),
          lineHeight: '16px',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
          minWidth: '120px',
          color: theme.palette.text.secondarydark,
          '& > p': {
            fontSize: '16px',
            lineHeight: '16px'
          },
          '&:last-child': {
            paddingTop: 0,
            paddingBottom: 0
          }
        },
        head: {
          color: theme.palette.text.secondarydark,
          backgroundColor: 'transparent',
          textTransform: 'capitalize',
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontFamily: theme.typography.subtitle1.fontFamily,
          '&:first-of-type': {
            paddingLeft: theme.spacing(3)
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(3)
          }
        },
        stickyHeader: {
          background: createGradient(theme.palette.primary.main, theme.palette.primary.darker)
        },
        body: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          '&:first-of-type': {
            paddingLeft: theme.spacing(3)
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(3)
          }
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`
        },
        toolbar: {
          height: 64
        },
        select: {
          '&:focus': {
            borderRadius: theme.shape.borderRadius
          }
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: 2
        }
      }
    }
  };
}
