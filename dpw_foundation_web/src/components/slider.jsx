// Import required libraries and components
import { useRouter } from 'next-nprogress-bar';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

// Material-UI components and styling utilities
import { Box, Button, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

// Icon
import { IoPricetagOutline } from 'react-icons/io5';

// Custom hooks for currency formatting and conversion
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

/**
 * CustomizedSlider Component
 * A custom slider component for filtering prices, with real-time currency formatting and query string updates.
 *
 * @param {object} props - The component props.
 * @param {Array} props.prices - The minimum and maximum price range for the slider.
 * @param {string} props.path - The URL path for query string updates.
 *
 * @returns {JSX.Element} A price range slider component with reset functionality.
 */
export default function CustomizedSlider({ ...props }) {
  const { prices: filterPrices, path } = props;

  // Currency conversion and formatting hooks
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  // Router and search parameters hooks for navigation and URL manipulation
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const prices = searchParams.get('prices');

  // State for maintaining the slider's current value
  const [state, setState] = React.useState([0, 10000]);

  /**
   * Creates a new query string by updating the specified parameter.
   * @param {string} name - The name of the query parameter to update.
   * @param {string} value - The value to set for the query parameter.
   * @returns {string} The updated query string.
   */
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  /**
   * Deletes a specific query parameter from the current query string.
   * @param {string} name - The name of the query parameter to delete.
   * @returns {string} The updated query string.
   */
  const deleteQueryString = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  // Effect to update the slider state based on query string values
  React.useEffect(() => {
    if (prices) {
      const [min, max] = prices.split('_').map((p) => cCurrency(Number(p)));
      setState([min, max]);
    } else {
      setState([0, 100000]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  return (
    <>
      {/* Header with title and reset button */}
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          color="text.primary"
        >
          <IoPricetagOutline size={20} /> Price Range
        </Typography>
        <Zoom in={Boolean(prices)}>
          <Button
            onClick={() => {
              setState([0, 10000]);
              push(`${path}?${deleteQueryString('prices')}`);
            }}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ float: 'right', mt: '-3px' }}
          >
            Reset
          </Button>
        </Zoom>
      </Stack>

      {/* Slider component */}
      <Box px={1} mt={1}>
        <AirbnbSlider
          valueLabelDisplay="on"
          onChangeCommitted={(e, value) => {
            const prices = Array.isArray(value) && value.join('_');
            push(`${path}?${createQueryString('prices', prices)}`);
          }}
          valueLabelFormat={(x) => fCurrency(x)}
          max={cCurrency(filterPrices[1])}
          components={{ Thumb: AirbnbThumbComponent }}
          value={state}
          onChange={(e, v) => setState(v)}
          disableSwap
        />
      </Box>
    </>
  );
}

// PropTypes for the CustomizedSlider component
CustomizedSlider.propTypes = {
  prices: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

/**
 * ValueLabelComponent
 * A custom tooltip component for displaying slider value labels.
 */
function ValueLabelComponent({ ...props }) {
  const { children, value } = props;
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value} size="small">
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired
};

/**
 * AirbnbSlider
 * A styled Material-UI Slider component with a custom theme.
 */
const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginTop: 20,
  height: 27,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 27,
    width: 27,
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  '& .MuiSlider-track': {
    height: 27,
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.main
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 27,
    borderRadius: '8px'
  }
}));

/**
 * AirbnbThumbComponent
 * A custom thumb component for the Airbnb-styled slider.
 */
function AirbnbThumbComponent({ ...props }) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node
};
