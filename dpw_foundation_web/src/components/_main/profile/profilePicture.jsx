import { Box, IconButton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { UploadWhiteIcon, UserIcon } from 'src/components/icons';
import ProfileStyle from './profile.style';

const ProfilePicture = ({ imageUrl, onChange, name, updateImage, isView = false }) => {
  const [hover, setHover] = useState(true);
  const theme = useTheme();
  const style = ProfileStyle(theme);

  return (
    <Box sx={style.profileContainer} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Image Preview"
          unoptimized={true}
          width={100}
          height={130}
          layout="intrinsic"
          style={{ objectFit: 'cover' }}
          key={updateImage}
        />
      ) : (
        <Box sx={style.imageContainer}>
          <UserIcon />
        </Box>
      )}

      {!isView && (
        <>
          <Box sx={style.overlay(hover)}>
            <IconButton color="inherit">
              <UploadWhiteIcon fontSize="large" />
            </IconButton>
            <Typography variant="body2" textAlign="center">
              Edit Profile Picture
            </Typography>
          </Box>
          <Box component="input" name={name} type="file" accept="image/*" onChange={onChange} sx={style.hiddenInput} />
        </>
      )}
    </Box>
  );
};

export default ProfilePicture;
