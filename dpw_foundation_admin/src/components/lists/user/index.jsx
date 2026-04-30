import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
// redux
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
// mui
import { MenuItem, useMediaQuery, useTheme } from '@mui/material';
// icons

// styles
// hooks
import { useMutation } from 'react-query';
import { deleteCookies } from 'src/hooks/cookies';
import * as api from 'src/services';
import RootStyled from './styled';

UserList.propTypes = {
  user: PropTypes.object.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default function UserList({ ...props }) {
  const { setOpen, user } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mutate } = useMutation('createCampaign', api.logOutApi, {
    onSuccess: async () => {
      await deleteCookies('adminToken');
      await deleteCookies('refreshAdminToken');
      await deleteCookies('assignRoles');
      dispatch(setLogout());
      setOpen(false);
      router.push('/auth/login');
    },
    onError: () => {}
  });

  return (
    <RootStyled>
      {isMobile && (
        <MenuItem className="menu-item" disabled>
          Welcome, {user?.firstName}
        </MenuItem>
      )}
      <MenuItem
        className="menu-item"
        onClick={() => {
          setOpen(false);
          router.push('/admin/my-profile');
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem
        className="menu-item"
        onClick={() => {
          setOpen(false);
          router.push('/admin/change-password');
        }}
      >
        Change Password
      </MenuItem>
      <MenuItem onClick={() => mutate()}>Logout</MenuItem>
    </RootStyled>
  );
}
