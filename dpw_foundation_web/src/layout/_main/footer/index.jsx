'use client';
import NextLink from 'next/link';
// mui
import { Box, Container, Grid, Link, Stack, Typography, useTheme } from '@mui/material';

// components
import React from 'react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from 'src/components/icons';
import Logo from 'src/components/logo';
import FooterStyles from './footer.styles';
// icons

const MAIN_LINKS = [
  {
    //heading: 'Services',
    list: [
      { id: 'about-us', text: 'ABOUT US', link: 'https://foundation.dpworld.com/en/about-us' },
      { id: 'pillars', text: 'PILLARS', link: 'https://foundation.dpworld.com/en/pillars' },
      { id: 'initiatives', text: 'INITIATIVES', link: 'https://foundation.dpworld.com/en/programmes-and-initiatives' },
      { id: 'news', text: 'NEWS', link: 'https://foundation.dpworld.com/en/programmes-and-initiatives' },
      {
        id: 'cookie',
        text: 'Cookie Preferences',
        onClick: (e) => {
          e.preventDefault();
          if (typeof window !== 'undefined' && window.UC_UI && typeof window.UC_UI.showFirstLayer === 'function') {
            window.UC_UI.showFirstLayer();
          }
        }
      }
    ]
  },
  {
    //heading: 'SMART TRADE',
    list: [
      { id: 'privacy-policy', text: 'Privacy Policy', link: 'https://www.dpworld.com/privacy-policy' },
      { id: 'sitemap', text: 'Sitemap', link: 'https://foundation.dpworld.com/en/sitemap' },
      {
        id: 'terms-and-conditions',
        text: 'Terms and Conditions',
        link: 'https://www.dpworld.com/terms-and-conditions'
      },
      {
        id: 'whistleblowing-hotline',
        text: 'Whistleblowing Hotline',
        link: 'https://www.dpworld.com/whistleblowing-hotline'
      },
      { id: 'modern-slavery-act', text: 'Modern Slavery Act', link: 'https://www.dpworld.com/modern-slavery' }
    ]
  }
];

const SOCIAL_LINKS = [
  {
    //heading: 'Services',
    list: [
      {
        id: 'linkedin',
        icon: <LinkedinIcon height="20px" width="20px" />,
        link: 'https://ae.linkedin.com/showcase/dpworld-foundation/?trk=public_post_feed-actor-name'
      },
      {
        id: 'facebook',
        icon: <FacebookIcon height="20px" width="20px" />,
        link: 'https://www.facebook.com/people/DP-World-Foundation/61557413094847/'
      },
      { id: 'x', icon: <XIcon height="20px" width="20px" />, link: 'https://x.com/dpw_foundation' },
      {
        id: 'instagram',
        icon: <InstagramIcon height="20px" width="20px" />,
        link: 'https://www.instagram.com/dpworldfoundation/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D'
      }
    ]
  }
];

export default function Footer() {
  const theme = useTheme();
  const styles = FooterStyles(theme);
  const currentYear = new Date().getFullYear();
  return (
    <>
      <Box sx={styles.footerBg}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <Box sx={{ maxWidth: '170px', mb: 3 }}>
                <Logo logoType="white" />
              </Box>
            </Grid>
            <Grid item xs={12} md={8} spacing={3}>
              <Grid container>
                {MAIN_LINKS.map((item, index) => (
                  <React.Fragment key={`list_${item?.heading ?? index}`}>
                    <Grid item xs={12} sm={12} md={12} sx={{ mb: 4 }}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="space-between"
                        sx={{ ...(index === 0 && styles.aboutLinks) }}
                      >
                        {item.list.map((linkItem) => (
                          <Link
                            key={`list_${linkItem?.id}`}
                            component={linkItem.link ? NextLink : 'button'}
                            href={linkItem.link ?? '#'}
                            variant="footerlink"
                            underline="hover"
                            color="footerlink"
                            sx={{ pb: 1 }}
                            target={linkItem.link ? '_blank' : undefined}
                            rel={linkItem.link ? 'noopener noreferrer' : undefined}
                            onClick={linkItem.onClick}
                          >
                            {linkItem.text}
                          </Link>
                        ))}
                      </Stack>
                    </Grid>
                    {index !== MAIN_LINKS.length - 1 && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 4 }}>
                          <Box
                            component="hr"
                            sx={{
                              border: 0,
                              height: '1px',
                              backgroundColor: theme.palette.divider
                            }}
                          />
                        </Box>
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ pl: 3 }}>
                <Stack direction="column" spacing={0.3} justifyContent="center">
                  <Typography variant="subtitle2" color="text.white" sx={{ ...styles.linkTitle, fontWeight: '600' }}>
                    Follow us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {SOCIAL_LINKS.map((section) =>
                      section.list.map((item) => (
                        <Link key={`social_${item?.id}`} href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.icon}
                        </Link>
                      ))
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ pt: 2, [theme.breakpoints.down('md')]: { pt: 1 } }}>
                <Typography variant="footerRights" color="text.white">
                  © {currentYear} DP World Foundation. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
