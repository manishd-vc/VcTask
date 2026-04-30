const ProfileStyle = (theme) => ({
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
  overlay: (hover) => ({
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
    justifyContent: 'center',
    opacity: hover ? 1 : 0,
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
  },
  deleteIcon: {
    position: 'absolute', // Absolute positioning for the delete icon
    right: theme.spacing(2), // Positioned 2 spacing units from the right
    top: theme.spacing(1), // Positioned 1.5 spacing units from the top
    zIndex: 9, // Ensure the delete icon is on top of other content
    cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
    '&:hover': {
      opacity: 0.8 // Slight opacity change on hover to indicate interaction
    }
  },
  documentCard: {
    background: theme.palette.grey[100],
    p: 3,
    mt: 2,
    position: 'relative'
  }
});

export default ProfileStyle;
