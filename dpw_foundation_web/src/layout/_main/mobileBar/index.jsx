'use client';
// react
import { sum } from 'lodash';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useSelector } from 'react-redux';

// mui
import { Badge, Box, Button } from '@mui/material';

// icons
import { BsShopWindow } from 'react-icons/bs';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import { HiHome, HiOutlineHome, HiOutlineShoppingBag, HiShoppingBag } from 'react-icons/hi';
import { IoSearch } from 'react-icons/io5';

// styles
import RootStyled from './styled';

// config
import config from 'src/layout/_main/config.json';

const getIcon = (href, totalItems) => {
  switch (href) {
    case '/':
      return <HiOutlineHome size={18} />;
    case '/search':
      return <IoSearch size={18} />;
    case '/cart':
      return (
        <Badge
          showZero
          badgeContent={totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: '4px', right: '-2px' } }}
        >
          <HiOutlineShoppingBag size={18} />
        </Badge>
      );
    case '/products':
      return <BsShopWindow size={18} />;
    default:
      return <FaRegUser size={18} />;
  }
};

const getActiveIcon = (href, totalItems) => {
  switch (href) {
    case '/':
      return <HiHome size={18} />;
    case '/search':
      return <IoSearch size={18} />;
    case '/cart':
      return (
        <Badge
          showZero={false}
          badgeContent={totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: '4px', right: '-2px' } }}
        >
          <HiShoppingBag size={18} />
        </Badge>
      );
    case '/products':
      return <BsShopWindow size={18} />;
    default:
      return <FaUser size={18} />;
  }
};

export default function MobileBar() {
  const { mobile_menu } = config;
  const { push } = useRouter();
  const pathname = usePathname();
  const { product, user } = useSelector((state) => state);
  const { checkout } = useSelector(({ product }) => product);
  const [index, setIndex] = React.useState(0);
  const [setState] = React.useState({
    product: null,
    user: null
  });

  const [cart, setCart] = React.useState([]);
  const totalItems = sum(cart.map((item) => item.quantity));
  const onChangeMenu = (href, i) => () => {
    push(href);
    setIndex(i);
  };

  React.useEffect(() => {
    const isActiveIndex = () => {
      setState({
        product,
        user
      });
      let index = 0;

      if (pathname.includes('/auth') || pathname.includes('/profile')) {
        index = 4;
      } else if (pathname.includes('/cart')) {
        index = 3;
      } else if (pathname.includes('/products')) {
        index = 2;
      } else if (pathname.includes('/search')) {
        index = 1;
      }
      return index;
    };
    setIndex(isActiveIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  React.useEffect(() => {
    setCart(checkout.cart);
  }, [checkout]);

  return (
    <RootStyled>
      <Box className="appbar-wrapper">
        {mobile_menu.map((v, i) => {
          let borderRadius;

          if (i === 0) {
            borderRadius = '0 6px 0 0';
          } else if (i === 4) {
            borderRadius = '6px 0 0 0';
          } else {
            borderRadius = '6px 6px 0 0';
          }

          const fontWeight = index === i ? 600 : 400;
          return (
            <Button
              variant={index === i ? 'contained' : 'text'}
              color={index === i ? 'primary' : 'inherit'}
              startIcon={index === i ? getActiveIcon(v.href, totalItems) : getIcon(v.href, totalItems)}
              key={`moble_${v?.name}`}
              size="large"
              className="nav-button"
              sx={{
                borderRadius: borderRadius,
                fontWeight: fontWeight
              }}
              onClick={onChangeMenu(user?.isAuthenticated && v.isUser ? '/profile' : v.href, i)}
            >
              {v.name}
            </Button>
          );
        })}
      </Box>
    </RootStyled>
  );
}
