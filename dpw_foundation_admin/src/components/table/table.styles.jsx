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
  textWrap: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },
  CellMaxWidth: {
    maxWidth: '450px',
    width: { xs: '300px', md: '500px' },
    wordBreak: 'break-word',
    lineHeight: '1.5',
    whiteSpace: 'normal',
    display: 'block'
  },
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
  },
  tooltipAttachment: {
    color: '#fff',
    textDecoration: 'underline',
    padding: 0,
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    }
  },
  // tableScroll: {
  //   maxHeight: '500px',
  //   overflowY: 'auto',
  //   position: 'relative',
  //   '&::-webkit-scrollbar': {
  //     width: '5px',
  //     height: '5px'
  //   },
  //   '&::-webkit-scrollbar-track': {
  //     background: theme.palette.grey[200],
  //     borderRadius: '6px'
  //   },
  //   '&::-webkit-scrollbar-thumb': {
  //     background: theme.palette.grey[900],
  //     borderRadius: '6px'
  //   },
  //   '&::-webkit-scrollbar-thumb:hover': {
  //     background: theme.palette.grey[900]
  //   }
  // },
  tableHeadSticky: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.common.white,
    zIndex: 1111
  }
});

export default TableStyle;
