import PropTypes from 'prop-types';

// guard
import GuestGuard from 'src/guards/guest';
// mui
// component
import ResetPasswordMain from 'src/components/_main/auth/resetPassword';

/**
 * ResetPassword Page Component
 *
 * The ResetPassword page is protected by the GuestGuard, ensuring that only unauthenticated users can access it.
 * It renders the main reset password form, passing the token from the URL params to the form for validation.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.params - The URL parameters.
 * @param {string} props.params.token - The password reset token.
 * @returns {JSX.Element} The ResetPassword page component.
 */
export default function ResetPassword({ params }) {
  const { token } = params;
  return (
    <GuestGuard>
      <ResetPasswordMain token={token} />
    </GuestGuard>
  );
}

ResetPassword.propTypes = {
  params: PropTypes.shape({
    token: PropTypes.string.isRequired
  }).isRequired
};
