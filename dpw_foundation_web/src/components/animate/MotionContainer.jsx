/**
 * MotionContainer component.
 * - A wrapper that animates its children based on the `open` prop using framer-motion.
 * - Applies staggered animations for child elements when the container is in the "open" state.
 */
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
// mui
import { Box } from '@mui/material';
// components
import { varWrapEnter } from './variants';

export default function MotionContainer({ ...props }) {
  const { open, children, ...other } = props;

  return (
    // The Box component is wrapped with motion.div to enable animation
    <Box
      component={motion.div} // Wrap Box with framer-motion's motion.div to animate
      initial={false} // Do not apply initial state on first render
      animate={open ? 'animate' : 'exit'} // Trigger 'animate' or 'exit' based on the open prop
      variants={varWrapEnter} // Use the variants object for animation behavior
      {...other} // Spread other props onto the Box component
    >
      {children}
    </Box>
  );
}

// Prop types validation
MotionContainer.propTypes = {
  open: PropTypes.bool.isRequired, // `open` prop is required and must be a boolean
  children: PropTypes.node.isRequired // `children` prop is required and must be a valid React node
};
