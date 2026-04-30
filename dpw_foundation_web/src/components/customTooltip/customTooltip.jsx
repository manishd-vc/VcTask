/**
 * @file HtmlTooltip.js
 * @description A custom-styled tooltip component using Material-UI's Tooltip and styled API.
 * This component applies specific styles for a dark-themed tooltip.
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

/**
 * HtmlTooltip Component
 * @description This component wraps Material-UI's Tooltip to provide custom styling,
 * including a black background, white text, and a smaller font size.
 * @returns {JSX.Element} A styled tooltip component.
 */
const HtmlTooltip = styled(
  // Styled wrapper for the Tooltip component with dynamic props
  ({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />
)(
  /**
   * Custom styles applied to the tooltip
   * @param {Object} theme - Material-UI theme object for consistent styling.
   */
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#000', // Black background for the tooltip
      color: '#fff', // White text for readability
      fontSize: theme.typography.pxToRem(12) // Font size adjusted using theme utilities
    }
  })
);

export { HtmlTooltip };
