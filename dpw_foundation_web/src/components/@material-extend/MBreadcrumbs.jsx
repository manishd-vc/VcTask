import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { last } from 'lodash';
// mui
import { Typography, Box, Link, Breadcrumbs } from '@mui/material';

/**
 * LinkItem component - Renders a single breadcrumb link with optional icon and styling.
 *
 * @param {Object} props The props for the LinkItem component.
 * @param {Object} props.link The link object containing href, name, and optional icon.
 * @param {string} props.link.href The URL the link points to.
 * @param {string} props.link.name The name to display for the link.
 * @param {React.ReactNode} [props.link.icon] The optional icon to display next to the link.
 * @param {boolean} props.admin If true, applies the admin variant styles.
 *
 * @returns {JSX.Element} The rendered LinkItem component.
 */
function LinkItem({ link, admin }) {
  const { href, name, icon } = link;
  return (
    <Link
      component={NextLink}
      key={name}
      href={href}
      passHref
      variant={admin ? 'body1' : 'body2'}
      sx={{
        lineHeight: 2,
        display: 'flex',
        alignItems: 'center',
        color: admin ? 'text.primary' : 'common.white',
        '& > div': { display: 'inherit' }
      }}
    >
      {icon && (
        <Box
          sx={{
            mr: 1,
            '& svg': {
              width: admin ? 30 : 20,
              height: admin ? 30 : 20,
              color: admin ? 'text.primary' : 'common.white'
            }
          }}
        >
          {icon}
        </Box>
      )}
      {name}
    </Link>
  );
}

// Prop types validation for LinkItem
LinkItem.propTypes = {
  link: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.node
  }).isRequired,
  admin: PropTypes.bool.isRequired
};

/**
 * MBreadcrumbs component - Renders a breadcrumb navigation with optional active last link styling.
 *
 * @param {Object} props The props for the MBreadcrumbs component.
 * @param {Array} props.links An array of link objects to display in the breadcrumbs.
 * @param {boolean} props.admin If true, applies the admin variant styles.
 * @param {boolean} [props.activeLast=false] If true, shows the last breadcrumb link as plain text.
 * @param {Object} [props.other] Other props passed to the Breadcrumbs component.
 *
 * @returns {JSX.Element} The rendered MBreadcrumbs component.
 */
function MBreadcrumbs({ links, admin, activeLast = false, ...other }) {
  const currentLink = last(links)?.name; // Get the name of the last link for active styling

  // Create the breadcrumb links without active styling for the last link
  const listDefault = links?.map((link) => <LinkItem key={link.name} link={link} admin={admin} />);

  // Create the breadcrumb links with the last link styled as text
  const listActiveLast = links?.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} admin={admin} />
      ) : (
        <Typography
          variant={admin ? 'body1' : 'body2'}
          sx={{
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: admin ? 'text.disabled' : 'common.white',
            textOverflow: 'ellipsis'
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <Breadcrumbs separator="›" {...other}>
      {activeLast ? listDefault : listActiveLast}
    </Breadcrumbs>
  );
}

// Prop types validation for MBreadcrumbs
MBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  admin: PropTypes.bool.isRequired,
  icon: PropTypes.node,
  activeLast: PropTypes.bool
};

export default MBreadcrumbs;
