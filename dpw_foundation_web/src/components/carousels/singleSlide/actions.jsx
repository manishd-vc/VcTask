// mui
import { IconButton, Stack } from '@mui/material';
// icons
import { NextWhiteArrowSlider, PrevWhiteArrowSlider } from 'src/components/icons';

/**
 * Actions component to render navigation arrows for carousel pagination.
 *
 * @param {Object} props - Component props
 * @param {boolean} active - State to check if the component is active
 * @param {function} paginate - Function to handle pagination logic
 * @param {Array} data - Data for the carousel (not used in the current implementation but could be used for dynamic rendering)
 * @param {function} setPage - Function to set the current page (not used here but might be for state management)
 */
export default function actions({ paginate }) {
  return (
    <>
      {/* Previous slide button */}
      <Stack
        direction="row"
        alignItems={'center'}
        sx={{
          zIndex: 11,
          position: 'absolute',
          top: '35%',
          left: (theme) => theme.spacing(8),
          transform: 'translateX(-50%)',
          display: { md: 'flex', xs: 'none' } // Hide on small screens
        }}
      >
        <IconButton
          size="large"
          aria-label="back"
          onClick={() => paginate(-1)}
          sx={{ img: { width: 48, height: 48 } }} // Set the size for the icon
        >
          <PrevWhiteArrowSlider /> {/* Custom previous arrow icon */}
        </IconButton>
      </Stack>

      {/* Next slide button */}
      <Stack
        direction="row"
        alignItems={'center'}
        sx={{
          zIndex: 11,
          position: 'absolute',
          top: '35%',
          right: (theme) => theme.spacing(8),
          transform: 'translateX(-50%)',
          display: { md: 'flex', xs: 'none' } // Hide on small screens
        }}
      >
        <IconButton
          size="large"
          aria-label="next"
          onClick={() => paginate(1)}
          sx={{ img: { width: 48, height: 48 } }} // Set the size for the icon
        >
          <NextWhiteArrowSlider /> {/* Custom next arrow icon */}
        </IconButton>
      </Stack>
    </>
  );
}
