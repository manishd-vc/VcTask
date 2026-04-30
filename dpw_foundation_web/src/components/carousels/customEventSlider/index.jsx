// react
'use client';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// mui
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
// icons
// framer motion
// components
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarIcon, NextWhiteArrow, SliderBack, SliderNext } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setToastMessage } from 'src/redux/slices/common';
import {
  setVolunteerEnrollmentData,
  setVolunteerEnrollmentLoading,
  setVolunteerFormData
} from 'src/redux/slices/profile';
import * as volunteerApi from 'src/services/volunteer';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getImageUrl } from 'src/utils/util';
import 'swiper/css';
import 'swiper/css/navigation'; // Add this for navigation styles
import 'swiper/css/pagination'; // Add this for pagination styles
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.css';
const MakePldege = React.lazy(() => import('src/components/_main/campaign/makePledge'));

/**
 * CarouselItem component - Renders a single carousel item with an image, title, date, description, and button.
 *
 * @param {Object} props The props for the CarouselItem component.
 * @param {Object} props.item The campaign data to display in the carousel.
 * @param {boolean} props.isLoading If true, shows loading state.
 * @param {string} props.btnText The text to display on the button.
 * @param {Function} props.onClick The function to call when the button is clicked.
 *
 * @returns {JSX.Element} The rendered CarouselItem component.
 */
function CarouselItem({ ...props }) {
  const { item, btnText, onClick } = props;
  const router = useRouter();

  const handleCampaignClick = () => {
    if (item?.volunteerCampaignTitle) {
      router.push(`/volunteer/${item?.slug}`);
    } else {
      router.push(`/campaign/${item?.slug}`);
    }
  };

  return (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        onClick={handleCampaignClick}
        component="img"
        height="250"
        image={getImageUrl(item?.bannerUrl || item?.coverImageUrl)}
        alt={item?.campaignTitle}
        sx={{ cursor: 'pointer' }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            component="a"
            onClick={handleCampaignClick}
            variant="sectionHeaderSmall"
            textTransform="uppercase"
            color="text.secondarydark"
            sx={{ cursor: 'pointer' }}
          >
            {item?.campaignTitle || item?.volunteerCampaignTitle}
          </Typography>
          <Box display="flex" alignItems="center" my={1.5}>
            <CalendarIcon />
            <Typography variant="subtitle4" color="text.secondarydark" sx={{ pl: 1.5 }}>
              {item?.startDateTime ? fDateWithLocale(item?.startDateTime, true) : '-'}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondarydark"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {item?.campaignDescription || item?.volunteerCampaignDescription}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            onClick={() => onClick(item)}
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            endIcon={<NextWhiteArrow />}
          >
            {btnText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Prop types validation for CarouselItem
CarouselItem.propTypes = {
  item: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

/**
 * CustomEventSlider component - Renders a responsive Swiper slider to display a list of events or campaigns with interactive buttons.
 *
 * @param {Object} props The props for the CustomEventSlider component.
 * @param {Array} props.data An array of campaign objects to display in the slider.
 * @param {boolean} props.isLoading If true, displays a loading state.
 * @param {string} props.btnText The text to display on the button in each carousel item.
 * @param {Function} props.onItemClick Custom click handler for items.
 *
 * @returns {JSX.Element} The rendered CustomEventSlider component.
 */
export default function CustomEventSlider({ ...props }) {
  const { btnText, data, isLoading } = props;
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [row, setRow] = useState(null);
  const { isAuthenticated, user } = useSelector(({ user }) => user);

  const { mutate: enrollVolunteerMutation } = useMutation(volunteerApi.createUpdateVolunteerEnrollment, {
    onSuccess: (data, variables) => {
      console.log('data', data);
      console.log('variables', variables);
      dispatch(setVolunteerFormData(data?.data));
      dispatch(setVolunteerEnrollmentLoading(false));
      enrollVolunteer(variables.volunteerCampaignId);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      dispatch(setVolunteerEnrollmentLoading(false));
    }
  });

  const { mutate: enrollVolunteer } = useMutation(volunteerApi.enrollVolunteer, {
    onSuccess: (data) => {
      dispatch(setVolunteerEnrollmentData(data?.data));
      router.push(`/user/volunteer-enrollment/${data?.data?.volunteerCampaignId}`);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  // Opens the pledge donation dialog if the user is authenticated
  const pledgeDonation = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
    } else {
      setOpenDialog(true);
    }
  };

  // Closes the pledge donation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePledgeBtn = (item) => {
    if (btnText === 'Enroll') {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${pathname}`);
      } else {
        dispatch(setVolunteerEnrollmentLoading(true));
        enrollVolunteerMutation({ userId: user?.userId, volunteerCampaignId: item?.id });
      }
    } else if (item?.campaignType === 'FUNDCAMP') {
      gtmEvents.pledgeClick({
        linkName: item?.campaignTitle,
        valueSelected: 'Pledge a Donation',
        sectionName: 'Fundraising campaigns and Charitable projects' || item?.campaignTitle
      });
      setRow(item);
      pledgeDonation();
    } else {
      if (item?.eventType === 'volunteering') {
        router.push(`/volunteer/${item?.slug}`);
      } else {
        router.push(`/campaign/${item?.slug}`);
      }
    }
  };

  return (
    <>
      {openDialog && <MakePldege open={openDialog} handleClose={handleCloseDialog} campaignId={row?.id} />}
      <Swiper
        slidesPerView={1}
        spaceBetween={4}
        pagination={{
          clickable: true
        }}
        breakpoints={{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 4
          },
          '@0.75': {
            slidesPerView: 1,
            spaceBetween: 7
          },
          '@1.00': {
            slidesPerView: 2,
            spaceBetween: 15
          },
          '@1.50': {
            slidesPerView: 3,
            spaceBetween: 20
          }
        }}
        className="mySwiper"
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev'
        }}
        modules={[Navigation]}
        style={{ padding: '0 0' }}
      >
        {(data ?? []).slice().map((item) => (
          <SwiperSlide key={`data-key_${item?.slug}`}>
            <CarouselItem
              item={data ? item : null}
              index={data ? item : null}
              btnText={btnText || (item?.campaignType === 'FUNDCAMP' ? 'Pledge a Donation' : 'View Details')}
              isLoading={isLoading}
              onClick={() => handlePledgeBtn(item)}
            />
          </SwiperSlide>
        ))}
        <div className="custom-prev">
          <SliderBack />
        </div>
        <div className="custom-next">
          <SliderNext />
        </div>
      </Swiper>
    </>
  );
}

// Prop types validation for CustomEventSlider
CustomEventSlider.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};
