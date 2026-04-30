'use client';

import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import navLinks from 'src/utils/sidebarLinks';

export default function SettingsMenu() {
  const [currentMenu, setCurrentMenu] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.accessToken);

  const { data: moduleList = [] } = useQuery(['module-list'], () => api.getSettingsModules(token), {
    onError: (err) => {
      dispatch(
        setToastMessage({
          message: err?.response?.data?.message || 'Error fetching modules',
          variant: 'error'
        })
      );
    },
    select: (res) => res?.data || []
  });

  const handleMenuClick = (module) => {
    router.push(`/admin/settings-configuration/${module.moduleCode}`);
  };

  return (
    <>
      {currentMenu && (
        <Button variant="text" startIcon={<BackArrow />} onClick={() => setCurrentMenu(null)} sx={{ mb: 2 }}>
          Back
        </Button>
      )}
      <Grid container spacing={3}>
        {moduleList.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.moduleCode} display="flex">
            <Stack flexDirection="column" sx={{ width: '100%' }}>
              <Card onClick={() => handleMenuClick(module)} sx={{ cursor: 'pointer', height: '100%' }}>
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
                    {module.moduleLabel}
                  </Typography>

                  <Box sx={{ pt: 2 }}>
                    {navLinks.map((item) => (item.title === module.moduleLabel ? item.icon : ''))}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
