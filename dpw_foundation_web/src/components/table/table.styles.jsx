const TableStyle = (theme) => ({
  activeStatus: {
    border: `0.0625rem solid ${theme.palette.success.main}`,
    backgroundColor: theme.palette.success.main,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.25),
    textAlign: 'center',
    color: theme.palette.common.white,
    fontSize: 12,
    minWidth: 82,
    letterSpacing: 0.2,
    lineHeight: '16px'
  },
  deactiveStatus: {
    border: `0.0625rem solid ${theme.palette.error.main}`,
    backgroundColor: theme.palette.error.main,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.25),
    textAlign: 'center',
    color: theme.palette.common.white,
    minWidth: 82,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: '16px'
  },
  warningStatus: {
    border: `0.0625rem solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.main,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.25),
    textAlign: 'center',
    color: theme.palette.common.black,
    minWidth: 82,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: '16px'
  },
  textTurncate: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'block',
    maxWidth: '300px'
  },
  tooltipAttachment: {
    color: '#fff',
    padding: 0,
    minWidth: 'auto',
    marginLeft: '4px',
    marginTop: '-6px',
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'none'
    }
  },
  // textTurncate: {
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis'
  // },
  paginationStyle: {
    '.MuiTablePagination-toolbar': { justifyContent: 'center' },
    '.MuiTablePagination-selectLabel': {
      color: 'text.secondarydark'
    },
    '.MuiInputBase-root': {
      '& .MuiTablePagination-select': {
        width: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '300',
        color: 'text.secondarydark'
      },
      '.MuiSelect-icon': { marginTop: '-3px' }
    },
    '.MuiTablePagination-displayedRows': { color: 'text.secondarydark' },
    '.MuiTablePagination-actions .MuiIconButton-root': {
      color: 'text.secondarydark'
    },
    '.MuiTablePagination-actions .MuiIconButton-root.Mui-disabled': {
      color: 'text.disabled'
    }
  }
});

export default TableStyle;
