const UserStyle = (theme) => ({
  profileContainer: {
    position: 'relative',
    width: theme.spacing(12.5),
    height: theme.spacing(16),
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.grey[500]
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: '0.3s ease-in-out'
  },
  overlay: () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.secondary.darker_60,
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    //opacity: hover ? 1 : 0,
    opacity: 1,
    padding: '10px 0',
    transition: 'opacity 0.3s ease-in-out'
  }),
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  imageContainer: {
    '& img': {
      width: 53,
      height: 68
    }
  }
});

export default UserStyle;
