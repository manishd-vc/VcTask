// Constant for distance used in animations
const DISTANCE = 120;

// Transition configurations for entry and exit animations
const TRANSITION_ENTER = {
  duration: 0.64, // Duration of the entry animation
  ease: [0.43, 0.13, 0.23, 0.96] // Easing function for smooth animation
};

const TRANSITION_EXIT = {
  duration: 0.48, // Duration of the exit animation
  ease: [0.43, 0.13, 0.23, 0.96] // Easing function for smooth animation
};

/**
 * Fade-out animation variant.
 * - Starts with full opacity (1) and animates to 0 opacity.
 */
export const varFadeOut = {
  initial: { opacity: 1 }, // Initial state: fully visible
  animate: { opacity: 0, transition: TRANSITION_ENTER }, // Final state: invisible
  exit: { opacity: 1, transition: TRANSITION_EXIT } // Exit state: fully visible again
};

/**
 * Fade-out-up animation variant.
 * - Starts from normal position (y = 0) and fades out upwards (y = -DISTANCE).
 */
export const varFadeOutUp = {
  initial: { y: 0, opacity: 1 }, // Initial state: normal position and fully visible
  animate: { y: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER }, // Final state: moved up and invisible
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT } // Exit state: back to normal position and fully visible
};

/**
 * Fade-out-down animation variant.
 * - Starts from normal position (y = 0) and fades out downwards (y = DISTANCE).
 */
export const varFadeOutDown = {
  initial: { y: 0, opacity: 1 }, // Initial state: normal position and fully visible
  animate: { y: DISTANCE, opacity: 0, transition: TRANSITION_ENTER }, // Final state: moved down and invisible
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT } // Exit state: back to normal position and fully visible
};

/**
 * Fade-out-left animation variant.
 * - Starts from normal position (x = 0) and fades out towards the left (x = -DISTANCE).
 */
export const varFadeOutLeft = {
  initial: { x: 0, opacity: 1 }, // Initial state: normal position and fully visible
  animate: { x: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER }, // Final state: moved left and invisible
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT } // Exit state: back to normal position and fully visible
};

/**
 * Fade-out-right animation variant.
 * - Starts from normal position (x = 0) and fades out towards the right (x = DISTANCE).
 */
export const varFadeOutRight = {
  initial: { x: 0, opacity: 1 }, // Initial state: normal position and fully visible
  animate: { x: DISTANCE, opacity: 0, transition: TRANSITION_ENTER }, // Final state: moved right and invisible
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT } // Exit state: back to normal position and fully visible
};
