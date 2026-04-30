'use client';
// react
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// mui
import { Box, Button, Card, Container, Paper, Stack, Typography } from '@mui/material';
// framer motion
import { AnimatePresence, motion } from 'framer-motion';
// components
import { NextWhiteArrow } from 'src/components/icons';
import Actions from './actions';

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000, // Slide in from left or right
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000, // Slide out to left or right
      opacity: 0
    };
  }
};

/**
 * Function to calculate swipe power based on the distance (offset) and velocity of the swipe.
 * This helps determine if a swipe is strong enough to paginate.
 *
 * @param {number} offset - The distance of the swipe.
 * @param {number} velocity - The speed of the swipe.
 * @returns {number} - The calculated swipe power.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity; // Formula to calculate swipe power
};

// ----------------------------------------------------------------------
/**
 * CarouselItem displays a single slide in the carousel.
 *
 * @param {Object} props - Carousel item data.
 * @param {Object} item - The data for the current carousel item.
 */
CarouselItem.propTypes = {
  item: PropTypes.shape({
    cover: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    btnPrimary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    }).isRequired,
    btnSecondary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

function CarouselItem({ ...props }) {
  const { item } = props; // Destructure the props to get item data

  return (
    <Paper
      sx={{
        position: 'relative',
        zIndex: 11,
        height: { xs: 120, sm: 300, md: 800, lg: 800 },
        borderRadius: 0,
        img: {
          borderRadius: 0,
          objectPosition: { md: 'center', xs: 'left' }
        }
      }}
    >
      <Image priority src={item.cover} alt="centered-banner" layout="fill" objectFit="cover" draggable="false" />
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: (theme) => theme.palette.secondary.darker,
          opacity: '0.64'
        }}
      />
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" color="text.white" sx={{ maxWidth: '90%', mx: 'auto', textTransform: 'uppercase' }}>
            {item.heading}
          </Typography>
          <Typography variant="h6" color="text.white" sx={{ fontWeight: 300, mt: 5, mb: 8 }}>
            {item.description}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button textAlign="center" size="large" variant="contained" endIcon={<NextWhiteArrow />}>
              {item.btnPrimary.btnText}
            </Button>
            <Button textAlign="center" size="large" variant="contained" endIcon={<NextWhiteArrow />}>
              {item.btnSecondary.btnText}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Paper>
  );
}

/**
 * SingleSlideCarousel handles the logic and display of the carousel, including pagination and automatic sliding.
 *
 * @param {Object} props - Carousel data and control functions.
 * @param {Array} data - Array of carousel items.
 */
export default function SingleSlideCarousel({ ...props }) {
  const { data } = props;
  const { themeMode } = useSelector(({ settings }) => settings); // Retrieve theme mode from Redux state
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % data?.length); // Ensure imageIndex wraps around data length
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]); // Update page and direction
  };

  // Auto-pagination logic that triggers every 12 seconds
  useEffect(() => {
    setTimeout(() => {
      setPage([page + 1, 1]);
    }, 12000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmpty = !data?.length; // Check if data is empty

  return (
    <Card
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        overflow: 'hidden',
        height: { xs: 120, sm: 300, md: 500, lg: 800 },
        borderRadius: '0px',
        boxShadow: 'unset'
      }}
    >
      {/* Display message if no data is available */}
      {isEmpty ? (
        <Stack
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h4" color="text.secondary">
            Slides are not uploaded yet!
          </Typography>
        </Stack>
      ) : (
        // Animate the carousel transition
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              boxShadow: 'unset',
              top: 0
            }}
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x); // Calculate swipe power
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1); // Move to next slide
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1); // Move to previous slide
              }
            }}
          >
            <CarouselItem
              themeMode={themeMode}
              item={data ? data[imageIndex] : null}
              index={data ? data[imageIndex] : null}
              activeStep={imageIndex}
              isActive={imageIndex}
              key={`data-key_${new Date().getTime()}`} // Ensure unique key for each render
            />
          </motion.div>
        </AnimatePresence>
      )}
      {/* Display carousel navigation controls */}
      {data.length && (
        <Actions active={imageIndex} themeMode={themeMode} setPage={setPage} paginate={paginate} data={data} />
      )}
    </Card>
  );
}

/**
 * Prop types for the SingleSlideCarousel component to ensure correct data structure.
 */
SingleSlideCarousel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string.isRequired,
      heading: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      btnPrimary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      }).isRequired,
      btnSecondary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired
};
