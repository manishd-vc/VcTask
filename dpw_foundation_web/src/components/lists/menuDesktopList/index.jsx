import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
// components
import RootStyled from './styled';
// material
import { Box, ListItem, ListSubheader } from '@mui/material';

IconBullet.propTypes = {
  type: PropTypes.string.isRequired
};
function IconBullet({ type = 'item' }) {
  return (
    <Box className="icon-bullet-main">
      <Box component="span" className={`icon-bullet-inner ${type !== 'item' && 'active'}`} />
    </Box>
  );
}
MenuDesktopList.propTypes = {
  parent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};
export default function MenuDesktopList({ ...props }) {
  const { parent, onClose } = props;

  return (
    <RootStyled disablePadding>
      <>
        <ListSubheader
          className="list-subheader"
          onClick={() => {
            onClose();
          }}
          component={NextLink}
          href={'/products/' + parent?.slug}
        >
          {parent?.name}
        </ListSubheader>
        {parent?.subCategories?.map((subCategory) => (
          <React.Fragment key={`data-key_${new Date().getTime()}`}>
            <ListItem
              className="list-item"
              onClick={() => {
                onClose();
              }}
              component={NextLink}
              href={`/products/${parent?.slug}/${subCategory?.slug}`}
            >
              <IconBullet />

              {subCategory?.name}
            </ListItem>
          </React.Fragment>
        ))}
      </>
    </RootStyled>
  );
}
