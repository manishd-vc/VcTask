'use client';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import * as api from 'src/services';
import { fDateWithLocale, formatTime } from 'src/utils/formatTime';

import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CalendarIcon, ClockIcon, CloseIcon, ICADRequest, LocationIcon, TrueSignIcon } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { getImageUrl } from 'src/utils/util';
import CampaignStyle from './campaign.styles';
import MediaPreview from './mediaPreview';
const MakePldege = React.lazy(() => import('./makePledge'));
CampaignDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    addressLineOne: PropTypes.string,
    addressLineTwo: PropTypes.string,
    projectCity: PropTypes.string,
    projectState: PropTypes.string,
    projectCountry: PropTypes.string,
    bannerId: PropTypes.string,
    campaignTitle: PropTypes.string,
    startDateTime: PropTypes.string,
    campaignTargetRequired: PropTypes.string,
    endDateTime: PropTypes.string,
    volunteersRequiredDescriptions: PropTypes.string,
    campaignDescription: PropTypes.string
  }).isRequired
};
export default function CampaignDetail({ params }) {
  const [address, setAddress] = useState('');
  const theme = useTheme();
  const styles = CampaignStyle(theme);
  const router = useRouter();
  const pathname = usePathname();
  const [openDialog, setOpenDialog] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const style = ModalStyle(theme);
  const { isAuthenticated } = useSelector(({ user }) => user);
  let paramData = JSON.parse(params?.value);
  const { data } = useQuery(['campaignDetails', paramData.slug], () => api.getCampaignDetails(paramData.slug));

  const pledgeDonation = () => {
    gtmEvents.pledgeClick({
      linkName: data?.campaignTitle,
      valueSelected: 'Pledge a Donation',
      sectionName: data?.campaignTitle || 'Fundraising campaigns and Charitable projects'
    });

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (data) {
      let addressDetail = [];
      if (data?.addressLineOne) {
        addressDetail.push(data?.addressLineOne);
      }
      if (data?.addressLineTwo) {
        addressDetail.push(data?.addressLineTwo);
      }
      if (data?.projectCity) {
        addressDetail.push(data?.projectCity);
      }
      if (data?.projectState) {
        addressDetail.push(data?.projectState);
      }
      if (data?.projectCountry) {
        addressDetail.push(data?.projectCountry);
      }
      setAddress(addressDetail.join(','));
    }
  }, [data]);

  const toggleShowImages = () => {
    setShowAllImages(!showAllImages); // Toggle the state
  };

  const handleImageClick = (file) => {
    if (file?.preSignedUrl) {
      setSelectedImage(file.preSignedUrl);
      setOpen(true);
    } else {
      const imageUrl = file instanceof File ? URL.createObjectURL(file) : getImageUrl(file.id);
      setSelectedImage(imageUrl);
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          ...styles.campaignBanner,
          backgroundImage: `url(${getImageUrl(data?.bannerUrl || '')})`
        }}
      >
        <Container maxWidth="xl">
          <Stack sx={styles.bannerContent} alignItems="Center">
            <Typography
              textTransform="uppercase"
              component="h1"
              variant="h1"
              color="text.white"
              textAlign="center"
              sx={{ lineHeight: '1' }}
            >
              <>
                Charitable <br /> project
              </>
            </Typography>
            <Paper variant="plainPaper" sx={{ px: 3, pt: 3, pb: 4, width: 1, mt: 5 }}>
              <Typography
                variant="h5"
                component="h2"
                color="text.secondarydark"
                textTransform="uppercase"
                sx={{ mb: 3 }}
              >
                {data?.campaignTitle}
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                flexWrap={{ xs: 'wrap' }}
                spacing={2}
                sx={{ width: '100%' }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Project Date & Time
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, pr: 3 }}>
                      <CalendarIcon />
                      <Typography component="p" variant="subtitle4" color="text.secondarydark">
                        {data?.publishStartDateTime ? fDateWithLocale(data?.publishStartDateTime) : '-'} {' - '}
                        {data?.publishEndDateTime ? fDateWithLocale(data?.publishEndDateTime) : '-'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <ClockIcon />
                      <Typography component="p" variant="subtitle4" color="text.secondarydark">
                        {data?.publishStartDateTime ? formatTime(data?.publishStartDateTime) : '-'} {' - '}
                        {data?.publishEndDateTime ? formatTime(data?.publishEndDateTime) : '-'}
                      </Typography>{' '}
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Location
                  </Typography>
                  <Typography component="p" variant="subtitle4" color="text.secondarydark" sx={{ mt: 0.5 }}>
                    {address}
                  </Typography>
                </Box>
                {data?.campaignType !== 'CHARITY' && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', lg: 'flex-end' },
                      alignItems: 'flex-start',
                      flexDirection: { xs: 'column', sm: 'row' },
                      width: { xs: '100%', lg: 'auto' },
                      mt: { xs: 2, md: '16px !important' }
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={pledgeDonation}
                      endIcon={<img src="/icons/Arrow-Right.svg" alt="arrow icon" />}
                      sx={{ mr: 2, mt: 0.5 }}
                    >
                      Pledge a donation
                    </Button>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ pt: 7 }}>
        <Typography variant="h5" color="text.secondarydark" component="h2" textTransform="uppercase">
          Introduction
        </Typography>
        <Typography variant="body1" component="p" color="text.secondarydark" sx={{ pt: 3 }}>
          {data?.campaignDescription}
        </Typography>
        <Box sx={{ pt: 4 }}>
          <Typography variant="h5" color="text.secondarydark" component="h2" sx={{ mb: 4 }} textTransform="uppercase">
            Project details
          </Typography>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <LocationIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Location Details
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {address}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <ClockIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Date & Time
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {data?.publishStartDateTime ? fDateWithLocale(data?.publishStartDateTime, true) : '-'}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <TrueSignIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Volunteer Requirement
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {data?.volunteersRequiredDescriptions}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <ICADRequest sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  IACAD Permit Number
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {data?.iacadPermitId || '-'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <>
            <Typography
              variant="h5"
              color="text.secondarydark"
              component="h2"
              sx={{ mb: 2, mt: 3 }}
              textTransform="uppercase"
            >
              Photo Album
            </Typography>
            <Stack alignItems="flex-start" flexDirection="row" gap={2} rowGap={0} flexWrap="wrap" mb={3}>
              {(showAllImages ? data?.photoAlbum || [] : (data?.photoAlbum || []).slice(0, 6))?.map((file) => (
                <Box
                  key={file?.id}
                  onClick={() => handleImageClick(file)}
                  sx={{ ...style.imageWidth, cursor: 'pointer', mt: 2 }}
                >
                  <MediaPreview
                    src={file instanceof File ? URL.createObjectURL(file) : getImageUrl(file.preSignedUrl)}
                    name={file.name}
                    onRemove={() => deletePhotoAlbum(file)}
                    width={120}
                    height={80}
                    layout="intrinsic"
                    isCloseIcon={false}
                    isOverlay={true}
                  />
                </Box>
              ))}

              {data?.photoAlbum?.length > 6 && (
                <Link
                  variant="blue"
                  size="small"
                  underline="always"
                  textTransform="uppercase"
                  sx={{ fontSize: 14, alignSelf: 'center', cursor: 'pointer' }}
                  onClick={toggleShowImages}
                >
                  {showAllImages ? 'Show Less' : 'Show More'}
                </Link>
              )}
            </Stack>
            {data?.photoAlbumLink && (
              <>
                <Typography variant="h6" color="primary.main" component="h2" sx={{ mb: 2 }}>
                  Photo Album Link
                </Typography>
                <Stack alignItems="flex-start" flexDirection="row" gap={2} rowGap={0} flexWrap="wrap">
                  <a
                    href={data?.photoAlbumLink || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', cursor: 'pointer', color: theme.palette.text.secondarydark }}
                  >
                    {data?.photoAlbumLink || '-'}
                  </a>
                </Stack>
              </>
            )}
          </>
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h6"
            color="primary.main"
          >
            Photo Album
          </DialogTitle>
          <IconButton aria-label="close" onClick={() => setOpen(false)} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Image Preview"
                width={800}
                height={600}
                layout="responsive"
                unoptimized={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
      {openDialog && <MakePldege open={openDialog} handleClose={handleCloseDialog} campaignId={data?.id} />}
    </>
  );
}
