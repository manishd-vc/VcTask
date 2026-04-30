'use client';

// mui
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useQuery } from 'react-query';
import CustomEventSlider from 'src/components/carousels/customEventSlider';
import * as api from 'src/services';
import { fDateTimeStandard } from 'src/utils/formatTime';
import HomeStyle from '../home.styles';
export default function UpcomingEvents() {
  const { data, isLoading } = useQuery(['get-upcomming'], () =>
    api.getUpcomming({
      publishDateTime: fDateTimeStandard(new Date()),
      isvolunteersRequired: false,
      slug: ''
    })
  );
  const theme = useTheme();
  const styles = HomeStyle(theme);

  return (
    <>
      <Box sx={[styles.bgGrey, styles.sectionPadding, { position: 'relative' }]}>
        <Container maxWidth="xl">
          <Typography
            variant="sectionHeader"
            component="h4"
            align="left"
            color="text.secondarydark"
            textTransform="uppercase"
            pb={4}
          >
            Fundraising campaigns and Charitable projects
          </Typography>
          <CustomEventSlider data={data?.data?.content || []} isLoading={isLoading} />
        </Container>
      </Box>
    </>
  );
}
