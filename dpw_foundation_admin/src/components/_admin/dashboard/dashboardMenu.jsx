// mui imports
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { checkPermissions } from 'src/utils/permissions';
import navLinks from 'src/utils/sidebarLinks';

export default function DashboardMenu() {
  const [currentMenu, setCurrentMenu] = useState(null);
  const router = useRouter();
  const assignedRoles = useSelector((state) => state?.roles?.assignedRoles);
  const handleMenuClick = (menu) => {
    if (menu.subMenu) {
      setCurrentMenu(menu);
    } else {
      router.push(menu.path);
      setCurrentMenu(null);
    }
  };
  const dashboardItem = navLinks.find((item) => item.slug === 'dashboard'); // or use item.id === 'dashboard'
  const restItems = (currentMenu ? currentMenu.subMenu : navLinks).filter(
    (item) => item.slug !== 'dashboard' && checkPermissions(assignedRoles, item?.permission)
  );

  return (
    <>
      {currentMenu && (
        <Button variant="text" startIcon={<BackArrow />} onClick={() => setCurrentMenu(null)} sx={{ mb: 2 }}>
          Back
        </Button>
      )}
      <Grid container spacing={3}>
        {!currentMenu && dashboardItem && (
          <Grid item xs={12} sm={6} md={4} key={dashboardItem.id} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Card onClick={() => handleMenuClick(dashboardItem)} sx={{ cursor: 'pointer', height: '100%' }}>
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
                    {dashboardItem.title}
                  </Typography>
                  {dashboardItem.icon && <Box sx={{ pt: 2 }}>{dashboardItem.icon}</Box>}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        )}

        {restItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Card onClick={() => handleMenuClick(item)} sx={{ cursor: 'pointer', height: '100%' }}>
                <CardContent>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase" component="h4">
                    {item.title}
                  </Typography>
                  {item.icon && <Box sx={{ pt: 2 }}>{item.icon}</Box>}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
