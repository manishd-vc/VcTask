// Constant for distance used in animations
const DISTANCE = 120;

// Transition configurations for entry and exit animations
const TRANSITION_ENTER = {
  duration: 0.34, // Duration of the entry animation
  ease: [0.43, 0.13, 0.23, 0.96] // Easing function for smooth animation
};

const TRANSITION_EXIT = {
  duration: 0.28, // Duration of the exit animation
  ease: [0.43, 0.13, 0.23, 0.96] // Easing function for smooth animation
};

/**
 * Fade-in animation variant.
 * - Starts with opacity 0 and animates to opacity 1.
 */
export const varFadeIn = {
  initial: { opacity: 0 }, // Initial state: invisible
  animate: { opacity: 1, transition: TRANSITION_ENTER }, // Final state: fully visible
  exit: { opacity: 0, transition: TRANSITION_EXIT } // Exit state: invisible
};

/**
 * Fade-in-up animation variant.
 * - Starts from below (y = DISTANCE) and fades in upwards to its final position.
 */
export const varFadeInUp = {
  initial: { y: DISTANCE, opacity: 0 }, // Initial state: positioned below and invisible
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER }, // Final state: in normal position and visible
  exit: { y: DISTANCE, opacity: 0, transition: TRANSITION_EXIT } // Exit state: positioned below and invisible
};

/**
 * Fade-in-left animation variant.
 * - Starts from the left (x = -DISTANCE) and fades in to its final position.
 */
export const varFadeInLeft = {
  initial: { x: -DISTANCE, opacity: 0 }, // Initial state: positioned off-screen left and invisible
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER }, // Final state: in normal position and visible
  exit: { x: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT } // Exit state: positioned off-screen left and invisible
};

/**
 * Fade-in-down animation variant.
 * - Starts from above (y = -DISTANCE) and fades in downwards to its final position.
 */
export const varFadeInDown = {
  initial: { y: -DISTANCE, opacity: 0 }, // Initial state: positioned above and invisible
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER }, // Final state: in normal position and visible
  exit: { y: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT } // Exit state: positioned above and invisible
};

/**
 * Fade-in-right animation variant.
 * - Starts from the right (x = DISTANCE) and fades in to its final position.
 */
export const varFadeInRight = {
  initial: { x: DISTANCE, opacity: 0 }, // Initial state: positioned off-screen right and invisible
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER }, // Final state: in normal position and visible
  exit: { x: DISTANCE, opacity: 0, transition: TRANSITION_EXIT } // Exit state: positioned off-screen right and invisible
};
