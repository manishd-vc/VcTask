import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

/**
 * HtmlTooltip - A custom styled tooltip component.
 * This component is used to display tooltips with custom styling applied via MUI's `styled` function.
 *
 * @returns {JSX.Element} - The custom styled Tooltip component.
 */
const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      // Custom background color, font color, and font size for the tooltip
      backgroundColor: '#000',
      color: '#fff',
      fontSize: theme.typography.pxToRem(12) // Use the MUI theme to set font size in rem
    }
  })
);

export { HtmlTooltip };
