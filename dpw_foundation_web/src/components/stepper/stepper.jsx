'use client';
import { Box, Step, StepConnector, StepLabel, Stepper, styled } from '@mui/material'; // Importing Material UI components
import PropTypes from 'prop-types';
import { TickIcon } from '../icons'; // Importing the custom TickIcon component
// Custom styled StepConnector to hide the default connector and apply custom styles
const CustomConnector = styled(StepConnector)(() => ({
  flex: '1 1 auto', // Flexbox to make the connector flexible
  position: 'relative', // Absolute positioning for the connector
  top: 0,
  left: 0,
  right: 0,
  display: 'none' // Hide the connector line by default
}));

// Custom styled StepLabel to apply custom styles to the labels
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: theme.palette.text.secondary, // Default label color
    fontWeight: 300, // Default font weight
    textTransform: 'capitalize', // Capitalizing the text
    textAlign: 'left', // Align text to the left
    '&.Mui-active': {
      color: theme.palette.text.secondarydark, // Active step label color
      fontSize: '18px', // Active step font size
      fontStyle: 'normal', // Normal font style for active state
      fontWeight: 400, // Font weight for active state
      lineHeight: '28px', // Line height for active state
      borderTop: `2px solid ${theme.palette.text.secondarydark}`, // Active step border top
      paddingTop: '12px', // Padding at the top for active step
      marginTop: '-2px!important', // Adjusting the top margin for active state
      paddingLeft: '3rem' // Padding left for active state
    },
    '&.Mui-completed': {
      color: 'theme.palette.text.secondarydark', // Completed step label color
      marginTop: '12px' // Margin top for completed step
    }
  }
}));

// Placeholder component for custom step icon, can be customized with icons
function StepIconComponent() {
  return <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>;
}

// Main Steppers component to display the steps and their custom styles
export default function Steppers({ steps = ['Step one', 'Step Two'], children, activeStep, tick = [] }) {
  return (
    <>
      <Stepper
        alternativeLabel // Positions the label under the stepper
        activeStep={activeStep} // Sets the current active step
        connector={<CustomConnector />} // Custom connector for steps
        sx={{
          maxWidth: '600px', // Limiting the width of the stepper
          gap: '32px', // Space between steps
          '.MuiStep-root.Mui-completed': {
            borderTop: (theme) => `2px solid ${theme.palette.grey[400]}`, // Completed step border style
            paddingLeft: 0, // No padding for completed steps
            paddingRight: 0, // No padding for completed steps
            color: 'red', // Completed step color
            '.MuiStepLabel-root': { flexDirection: 'row' } // Step label direction
          },
          '.MuiStepLabel-root.Mui-disabled': {
            cursor: 'default', // Disable the cursor for disabled steps
            borderTop: (theme) => `2px solid ${theme.palette.grey[400]}`, // Disabled step border style
            marginTop: '0' // No top margin for disabled steps
          }
        }}
      >
        {/* Loop through steps and render each step */}
        {steps.map((label, index) => (
          <Step key={`data-key_${label}`} completed={tick[index]}>
            <CustomStepLabel StepIconComponent={StepIconComponent}>
              {tick[index] && <TickIcon />} {/* Display tick icon if step is completed */}
              {label} {/* Display step label */}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
      {children} {/* Render any children passed to the Steppers component */}
    </>
  );
}
Steppers.propTypes = {
  // 'steps' is an array of strings, representing the step names or titles
  steps: PropTypes.arrayOf(PropTypes.string),

  // 'children' can be any valid React node (components, elements, text, etc.)
  children: PropTypes.node,

  // 'activeStep' is a number, representing the index of the currently active step
  activeStep: PropTypes.number.isRequired,

  // 'tick' is an array, which can contain any elements (used for tracking completed steps, for example)
  tick: PropTypes.array
};
