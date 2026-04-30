'use client';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

// mui
import { Box, Button, Stack, Typography } from '@mui/material';

// components

/**
 * HeaderBreadcrumbs Component
 *
 * This component is responsible for rendering a breadcrumb navigation interface with optional action buttons,
 * headings, and links. It supports both admin and non-admin layouts, and offers flexibility for dynamic
 * actions, links, and styling through props.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.action - Optional action object or node. If provided, it renders an action button.
 * @param {string} props.heading - The heading to display within the breadcrumbs.
 * @param {string | string[]} props.moreLink - A single URL or an array of URLs to render more links.
 * @param {Object} props.sx - Custom styles to apply to the component.
 * @param {boolean} props.admin - Determines if the layout is for an admin or a regular user.
 * @returns {JSX.Element} The rendered HeaderBreadcrumbs component.
 */
export default function HeaderBreadcrumbs({ ...props }) {
  const { action, heading } = props;

  return (
    <>
      <Stack
        mb={4}
        flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
        sx={{ width: '100%' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase' }}>
          {heading}
        </Typography>
        <Box
          sx={{
            mt: { xs: 2, sm: 2, md: 0 } // Add margin top for xs and sm, none for md and up
          }}
        >
          {action ? (
            <>
              {action?.title && (
                <>
                  {action?.type === 'click' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={action?.onClick && action.onClick}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {action.title}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component={NextLink}
                      href={action.href}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {action.title}
                    </Button>
                  )}
                </>
              )}
            </>
          ) : null}
        </Box>
      </Stack>
      {/* <Box
        sx={{
          ...sx,
          width: '100%',
          ...(admin && {
            mb: 4
          }),
          ...(!admin && {
            p: 3,
            mt: 3,
            color: 'common.white',
            position: 'relative',
            overflow: 'hidden',
            background: createGradient(theme.palette.primary.main, theme.palette.primary.dark),
            borderRadius: '8px',
            border: `1px solid ${theme.palette.primary}`,
            '&:before': {
              content: "''",
              position: 'absolute',
              top: '-23%',
              left: '20%',
              transform: 'translateX(-50%)',
              bgcolor: alpha(theme.palette.primary.light, 0.5),
              height: { xs: 60, md: 80 },
              width: { xs: 60, md: 80 },
              borderRadius: '50px',
              zIndex: 0
            },
            '&:after': {
              content: "''",
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '-3%',
              bgcolor: alpha(theme.palette.primary.light, 0.5),
              height: { xs: 60, md: 80 },
              width: { xs: 60, md: 80 },
              borderRadius: '50px',
              zIndex: 0
            },
            '& .MuiBreadcrumbs-separator': {
              color: 'common.white'
            }
          })
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row', lg: 'row' }}
          rowGap={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            ...(!admin && {
              '&:before': {
                content: "''",
                position: 'absolute',
                bottom: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: alpha(theme.palette.primary.light, 0.5),
                height: { xs: 60, md: 80 },
                width: { xs: 60, md: 80 },
                borderRadius: '50px',
                zIndex: 0
              }
            })
          }}
        >
          <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase' }}>
            {heading}
          </Typography>

          {action ? (
            <>
              {action?.title && (
                <>
                  {action?.type === 'click' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={action?.onClick && action.onClick}
                      sx={(theme) => ({
                        width: 'auto',
                        [theme.breakpoints.down(419.95)]: {
                          width: '100%'
                        },
                        '@media (min-width:420px) and (max-width:599.95px)': {
                          width: '60%'
                        }
                      })}
                    >
                      {action.title}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component={NextLink}
                      href={action.href}
                      sx={(theme) => ({
                        width: 'auto',
                        [theme.breakpoints.down(419.95)]: {
                          width: '100%'
                        },
                        '@media (min-width:420px) and (max-width:599.95px)': {
                          width: '60%'
                        }
                      })}
                    >
                      {action.title}
                    </Button>
                  )}
                </>
              )}
            </>
          ) : null}
        </Stack>
      </Box> */}
    </>
  );
}

/**
 * Prop Types for HeaderBreadcrumbs component
 *
 * Defines the expected types for the props used by the HeaderBreadcrumbs component.
 */
HeaderBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.node
    })
  ).isRequired,
  action: PropTypes.oneOfType([
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node
    }),
    PropTypes.node
  ]),
  icon: PropTypes.node,
  heading: PropTypes.string,
  sx: PropTypes.object,
  admin: PropTypes.bool,
  isUser: PropTypes.bool
};
