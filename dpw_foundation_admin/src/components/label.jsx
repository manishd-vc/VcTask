'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { alpha, styled, useTheme } from '@mui/material/styles';

/**
 * RootStyle Component
 * A styled component for rendering label elements with custom styles based on color and variant.
 * It is used within the `Label` component to apply styles dynamically based on the props passed.
 *
 * @returns {JSX.Element} A styled span component with dynamic styles based on the owner's state.
 */
const RootStyle = styled('span')(({ theme, ownerState }) => {
  const isLight = theme.palette.mode === 'light'; // Check if the theme is light or dark mode
  const { color, variant } = ownerState; // Destructure color and variant from the ownerState

  // Helper function to style the filled variant
  const styleFilled = (color) => ({
    color: theme.palette[color].contrastText,
    backgroundColor: theme.palette[color].main,
    textTransform: 'capitalize'
  });

  // Helper function to style the outlined variant
  const styleOutlined = (color) => ({
    color: theme.palette[color].main,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette[color].main}`,
    textTransform: 'capitalize'
  });

  // Helper function to style the ghost variant
  const styleGhost = (color) => ({
    color: theme.palette[color][isLight ? 'dark' : 'light'],
    backgroundColor: alpha(theme.palette[color].main, 0.16),
    textTransform: 'capitalize'
  });

  return {
    height: 22,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 4,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,

    // Apply specific styles based on the `color` and `variant` props
    ...(color !== 'default'
      ? {
          ...(variant === 'filled' && { ...styleFilled(color) }),
          ...(variant === 'outlined' && { ...styleOutlined(color) }),
          ...(variant === 'ghost' && { ...styleGhost(color) })
        }
      : {
          ...(variant === 'outlined' && {
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.grey[500_32]}`
          }),
          ...(variant === 'ghost' && {
            color: isLight ? theme.palette.text.secondary : theme.palette.common.white,
            backgroundColor: theme.palette.grey[500_16]
          })
        })
  };
});

/**
 * Label Component
 * A customizable label component that supports different colors and variants (filled, outlined, ghost).
 * It uses the `RootStyle` component to apply the styles dynamically.
 *
 * @param {string} color - The color of the label (default, primary, secondary, customColor).
 * @param {string} variant - The variant style of the label (filled, outlined, ghost).
 * @param {React.ReactNode} children - The content inside the label.
 * @param {Object} other - Other props to pass to the root component.
 *
 * @returns {JSX.Element} A label with dynamic styles based on the `color` and `variant` props.
 */
const Label = ({ color = 'default', variant = 'ghost', children, ...other }) => {
  const theme = useTheme(); // Access the current theme to style components
  return (
    // RootStyle is responsible for applying dynamic styles to the label
    <RootStyle ownerState={{ color, variant }} theme={theme} {...other}>
      {children} {/* Render the children inside the label */}
    </RootStyle>
  );
};

// Define prop types for validation
Label.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'customColor']),
  variant: PropTypes.oneOf(['filled', 'outlined', 'ghost']),
  children: PropTypes.node.isRequired
};

// Set default values for color and variant props
Label.defaultProps = {
  color: 'default',
  variant: 'ghost'
};

export default Label;
