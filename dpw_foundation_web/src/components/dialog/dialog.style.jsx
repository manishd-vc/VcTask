/**
 * ModalStyle - A function to generate the modal styles based on the provided theme.
 * @param {object} theme - The theme object provided by MUI.
 * @returns {object} - The style object for the modal components.
 */
const ModalStyle = (theme) => ({
  /**
   * Styles for the close button.
   * Positioned at the top-right corner of the modal.
   */
  closeModal: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3)
  },

  /**
   * Styles for the modal title.
   * Aligns the title with an icon and adds padding around it.
   */
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(3)} 0 ${theme.spacing(3)} ${theme.spacing(3)}`
  },

  /**
   * Styles for a back button.
   * Defines the width, margin, and padding of the button.
   */
  backBtn: {
    width: '90px',
    margin: `${theme.spacing(3)} 0 0 ${theme.spacing(3)}`,
    paddingLeft: 0,
    '&:hover': { textDecoration: 'none' }
  },

  /**
   * Styles for an image container.
   * Defines width, height, and overflow properties. Ensures the image fits the container.
   */
  imageWidth: {
    width: '120px',
    height: '80px',
    overflow: 'hidden',
    '&:img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  datepickerPosition: {
    position: 'absolute',
    top: '7%',
    m: 0
  }
});

export default ModalStyle;
