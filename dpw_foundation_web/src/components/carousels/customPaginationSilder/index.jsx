/**
 * CarouselAnimation component - A swipeable, animated carousel for displaying product images
 * with swipe and drag functionality.
 *
 * @param {Object} props - The props object containing the `product` data (images and other product info).
 *
 * @returns {JSX.Element} Carousel component.
 */

'use client';

// react
import PropTypes from 'prop-types';
import { useState } from 'react';
// components
import BlurImage from 'src/components/blurImage';
// mui
import { Box, Stack } from '@mui/material';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
// styles
import RootStyled from './styled';

// -------------------------------------------------------------

/**
 * Variants for animation transitions.
 * These define the entry and exit states of carousel images.
 */
const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000, // Slide in from left or right depending on direction.
      opacity: 0
    };
  },
  center: {
    zIndex: 1, // Ensure the current image stays on top.
    x: 0, // Center the image.
    opacity: 1 // Make the image fully visible.
  },
  exit: (direction) => {
    return {
      zIndex: 0, // Move the image to the background.
      x: direction < 0 ? 1000 : -1000, // Slide out to the left or right.
      opacity: 0 // Fade out.
    };
  }
};

/**
 * Function to calculate the swipe power based on distance and velocity.
 * @param {number} offset - The swipe offset (distance).
 * @param {number} velocity - The swipe velocity.
 * @returns {number} The computed swipe power.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// ----------------------------------------------------------------------
ProductDetailsCarousel.propTypes = {
  item: PropTypes.object.isRequired
};

/**
 * ProductDetailsCarousel component - Displays the product image with an optional blur effect and overlay.
 *
 * @param {Object} props - Contains the `item` (image) to be displayed.
 * @returns {JSX.Element} Carousel image component.
 */
function ProductDetailsCarousel({ ...props }) {
  const { item } = props;

  return (
    <div className="slide-wrapper">
      {item && (
        <BlurImage
          priority
          fill
          objectFit="cover"
          sizes="50%"
          src={item?.url || item?.src}
          alt="hero-carousel"
          placeholder="blur"
          blurDataURL={item.blurDataURL}
        />
      )}
      <Box className="bg-overlay" />
    </div>
  );
}

/**
 * CarouselAnimation component - Controls the entire carousel logic including swipe, drag, and animations.
 *
 * @param {Object} props - Contains the `product` with image data.
 * @returns {JSX.Element} Animated carousel component.
 */
export default function CarouselAnimation({ ...props }) {
  const { product } = props;

  const images = product?.images; // Get the images from the product prop

  const [[page, direction], setPage] = useState([0, 0]); // Current page and direction state
  const imageIndex = Math.abs(page % images?.length); // Normalize the index

  /**
   * Function to handle pagination by updating the page state.
   * @param {number} newDirection - The direction to paginate (1 for next, -1 for previous).
   */
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <RootStyled>
      <div className="carousel-wrap">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            className="motion-dev"
            key={page} // Ensure the unique key for animation
            custom={direction}
            variants={variants} // Use defined variants for the animation
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x" // Enable horizontal drag
            dragConstraints={{ left: 0, right: 0 }} // Prevent dragging beyond bounds
            dragElastic={1} // Elastic drag effect
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x); // Calculate swipe power
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1); // If swipe is strong enough, go to the next image
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1); // If swipe is strong enough, go to the previous image
              }
            }}
          >
            <ProductDetailsCarousel item={images[imageIndex]} /> {/* Display the current image */}
          </motion.div>
        </AnimatePresence>
        <Stack
          direction="row"
          justifyContent={images.length < 6 ? 'center' : 'left'}
          spacing={1}
          className="controls-wrapper"
        >
          {/* Render the thumbnail controls */}
          {images.map((item, i) => (
            <Box
              key={`data-key_${new Date().getTime()}`} // Key should be unique, but using Math.random can be inefficient
              className={`controls-button ${imageIndex === i ? 'active' : ''}`}
              onClick={() => {
                setPage([i, i]); // Set the page to the clicked thumbnail
              }}
            >
              <BlurImage
                priority
                fill
                objectFit="cover"
                sizes="14vw"
                src={item?.src || item?.url}
                alt="hero-carousel"
                placeholder="blur"
                blurDataURL={item.blurDataURL}
              />
            </Box>
          ))}
        </Stack>
      </div>
    </RootStyled>
  );
}

/**
 * Prop types for the CarouselAnimation component.
 */
CarouselAnimation.propTypes = {
  product: PropTypes.object, // The product data which includes images.
  data: PropTypes.object // Additional data if required.
};
