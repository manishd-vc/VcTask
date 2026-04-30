import PropTypes from 'prop-types';
import React, { useState } from 'react';

// mui
import { Box, Stack, IconButton, Skeleton } from '@mui/material';

// icons
import { FaCheck } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';

/**
 * ColorPreview component - Displays a list of color previews with navigation controls.
 *
 * This component renders color preview circles and allows navigation through the colors when there are more than 6 colors.
 * It supports a loading state and handles the selection of a color.
 *
 * @param {Object} props - Component props
 * @param {Array} props.colors - List of colors to display as preview.
 * @param {number} props.color - The currently selected color index.
 * @param {Function} props.setColor - Function to update the selected color.
 * @param {boolean} props.isDetail - Flag to indicate if the component is in detail mode.
 * @param {boolean} props.loading - Flag to indicate if data is still loading.
 *
 * @returns {JSX.Element} The ColorPreview component.
 */
export default function ColorPreview({ colors, color, setColor, isDetail, loading }) {
  const [colorCount, setColorCount] = useState(0);

  // Render color preview buttons with left/right navigation for more than 6 colors
  return (
    <Stack direction="row" spacing={0.5}>
      {/* Left navigation button, only visible when not in detail view and colors exceed 6 */}
      {!isDetail && colors?.length > 6 && (
        <IconButton
          size="small"
          onClick={() => {
            if (colorCount > 0) {
              setColorCount(colorCount - 1);
            }
          }}
          sx={{
            width: 24,
            height: 24,
            p: 0.1,
            svg: {
              color: colorCount === 0 ? 'text.disabled' : 'text.primary'
            }
          }}
          disabled={colorCount === 0}
        >
          <MdKeyboardDoubleArrowLeft size={20} />
        </IconButton>
      )}

      {/* Render the color preview circles */}
      {loading
        ? Array.from(new Array(4)) // Skeleton loading placeholders
        : colors?.slice(colorCount * 6, 6 * (colorCount + 1)).map((v, i) => (
            <React.Fragment key={`color_${v}`}>
              {loading ? (
                <Skeleton variant="circular" width={24} height={24} />
              ) : (
                <Box
                  sx={{
                    height: 24,
                    width: 24,
                    borderRadius: 5,
                    bgcolor: v,
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 0 2px #C4CDD5',
                    ...(color === colorCount * 6 + i && {
                      svg: {
                        position: 'absolute',
                        color: v === 'white' ? 'common.black' : 'common.white',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)'
                      }
                    })
                  }}
                  onClick={() => setColor(colorCount * 6 + i)}
                >
                  {color === colorCount * 6 + i && <FaCheck />}
                </Box>
              )}
            </React.Fragment>
          ))}

      {/* Right navigation button, only visible when not in detail view and more colors exist */}
      {!isDetail && colors?.length > 6 && (
        <IconButton
          disabled={6 * (colorCount + 1) > colors?.length}
          sx={{
            width: 24,
            height: 24,
            p: 0.1,
            svg: {
              color: 6 * (colorCount + 1) > colors?.length ? 'text.disabled' : 'text.primary'
            }
          }}
          size="small"
          onClick={() => {
            if (6 * (colorCount + 1) < colors?.length) {
              setColorCount(colorCount + 1);
            }
          }}
        >
          <MdKeyboardDoubleArrowRight size={20} />
        </IconButton>
      )}
    </Stack>
  );
}

// Prop validation to ensure correct data types
ColorPreview.propTypes = {
  colors: PropTypes.array.isRequired, // List of color values
  color: PropTypes.number.isRequired, // Currently selected color index
  setColor: PropTypes.func.isRequired, // Function to update selected color
  isDetail: PropTypes.bool.isRequired, // Flag for detail view mode
  loading: PropTypes.bool.isRequired // Flag indicating loading state
};
