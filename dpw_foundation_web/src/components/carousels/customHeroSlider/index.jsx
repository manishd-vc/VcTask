'use client';
// react
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// mui
import { Box, Button, Card, Container, Stack, Typography, useTheme } from '@mui/material';
// framer motion
// components
import { HeroSliderNext, HeroSliderPrev, NextWhiteArrow } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { usePathname } from 'next/navigation';
import MakePldege from 'src/components/_main/campaign/makePledge';
import HeroStyle from './hero.styles';
CarouselItem.propTypes = {
  themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  index: PropTypes.number.isRequired, // index of the item
  activeStep: PropTypes.number.isRequired, // current active step
  isActive: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    cover: PropTypes.string.isRequired, // cover image URL or path
    heading: PropTypes.string.isRequired, // heading text
    description: PropTypes.string.isRequired, // description text
    btnPrimary: PropTypes.shape({
      btnText: PropTypes.string.isRequired // primary button text
    }).isRequired,
    btnSecondary: PropTypes.shape({
      btnText: PropTypes.string.isRequired // secondary button text
    }).isRequired
  }).isRequired
};

/**
 * CarouselItem component - Renders a single carousel item with background image, heading, description, and two buttons.
 *
 * @param {Object} props The props for the CarouselItem component.
 * @param {Object} props.item The data for the carousel item including image, heading, description, and buttons.
 * @param {number} props.index The index of the current carousel item.
 *
 * @returns {JSX.Element} The rendered CarouselItem component.
 */
function CarouselItem({ ...props }) {
  const { item } = props;
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const styles = HeroStyle(theme);
  const [openDialog, setOpenDialog] = useState(false);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const handlePledgeDonation = (user) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
    } else {
      gtmEvents.pledgeClick({
        linkName: item?.description,
        valueSelected: 'Pledge a Donation',
        sectionName: item?.heading
      });
      setOpenDialog(true);
    }
  };

  // Render the carousel item with background image and content
  return (
    <>
      <Box
        sx={{
          ...styles.sliderBg,
          backgroundImage: `url(${item.cover})` // Set background image for the slider
        }}
      >
        <Box sx={styles.sliderOverlay} />
        <Box sx={styles.sliderContent}>
          <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
            <Typography
              variant="bannerHeader"
              color="text.white"
              component="h1"
              sx={{ maxWidth: '90%', mx: 'auto', textTransform: 'uppercase', mb: 4, whiteSpace: 'pre-line' }}
            >
              {item.heading} {/* Display the heading */}
            </Typography>
            <Typography variant="subtitle4" color="text.white" component="p" sx={{ pb: 4, maxWidth: '90%', m: 'auto' }}>
              {item.description} {/* Display the description */}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={3} onClick={handlePledgeDonation}>
              <Button
                sx={{ textAlign: 'center', boxShadow: 'none' }}
                size="large"
                variant="contained"
                endIcon={<NextWhiteArrow />}
              >
                {item.btnPrimary.btnText}
              </Button>
              {/* <Button sx={{ textAlign: 'center' }} size="large" variant="contained" endIcon={<NextWhiteArrow />}>
                {item.btnSecondary.btnText}
              </Button> */}
            </Stack>
          </Container>
        </Box>
      </Box>
      {openDialog && <MakePldege open={openDialog} handleClose={() => setOpenDialog(false)} />}
    </>
  );
}

/**
 * CustomHeroSlider component - Displays a carousel slider with multiple slides, each containing a background image, heading, description, and buttons.
 *
 * @param {Object} props The props for the CustomHeroSlider component.
 * @param {Array} props.data The array of slide data to be displayed in the carousel.
 *
 * @returns {JSX.Element} The rendered CustomHeroSlider component.
 */
export default function CustomHeroSlider({ ...props }) {
  const theme = useTheme();
  const styles = HeroStyle(theme);
  const { data } = props;
  const { themeMode } = useSelector(({ settings }) => settings);
  const [page] = useState([0]);
  const imageIndex = Math.abs(page % data?.length); // Calculate current image index

  const isEmpty = !data?.length; // Check if the data array is empty

  return (
    <Card
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        borderRadius: '0px',
        boxShadow: 'unset'
      }}
    >
      {/* Show a message if there is no data */}
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
        <>
          {/* Swiper component for the carousel */}
          <Swiper
            loop={true} // Loop the slides
            spaceBetween={30} // Space between slides
            effect={'fade'} // Fade effect for slide transition
            modules={[EffectFade, Navigation, Autoplay]} // Add necessary modules
            className="mySwiper"
            navigation={{
              nextEl: '.banner-next', // Next button class
              prevEl: '.banner-prev' // Previous button class
            }}
          >
            {/* Map through the data and display each carousel item */}
            {(data || []).map((item, index) => (
              <SwiperSlide key={`${item.heading}-${item.description}`}>
                <CarouselItem
                  themeMode={themeMode}
                  item={item}
                  index={index}
                  activeStep={imageIndex}
                  isActive={index === imageIndex} // Highlight active slide
                />
              </SwiperSlide>
            ))}
            {/* Custom next and previous buttons */}
            <Box className="banner-next" sx={styles.prevIcon}>
              {/* <PrevWhiteArrowSlider /> */}
              <HeroSliderPrev />
            </Box>
            <Box className="banner-prev" sx={styles.nextIcon}>
              <HeroSliderNext />
            </Box>
          </Swiper>
        </>
      )}
    </Card>
  );
}

// Prop types validation for CustomHeroSlider
CustomHeroSlider.propTypes = {
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
