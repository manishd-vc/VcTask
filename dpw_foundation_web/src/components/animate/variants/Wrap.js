/**
 * Wrap enter animation variant.
 * - Staggered children animations with a delay of 0.1 seconds between each child animation.
 */
export const varWrapEnter = {
  animate: {
    transition: { staggerChildren: 0.1 } // Stagger the children animations by 0.1 seconds
  }
};

/**
 * Wrap exit animation variant.
 * - Staggered children animations with a delay of 0.1 seconds during the exit phase.
 */
export const varWrapExit = {
  exit: {
    transition: { staggerChildren: 0.1 } // Stagger the children animations by 0.1 seconds during exit
  }
};

/**
 * Wrap both enter and exit animation variant.
 * - For the enter phase: staggered children animations with a delay of 0.1 seconds, and a slight delay for the children themselves.
 * - For the exit phase: stagger the children animations by 0.05 seconds in reverse order (staggerDirection: -1).
 */
export const varWrapBoth = {
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 } // Stagger children animations by 0.07s and delay children by 0.1s
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 } // Reverse stagger direction during exit with 0.05s delay between children
  }
};
