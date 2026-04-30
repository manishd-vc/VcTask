// component
import PropTypes from 'prop-types';
// components
import ResetPasswordForm from 'src/components/forms/resetPassword';

/**
 * ResetPasswordMain - A component that renders the reset password form.
 *
 * @param {Object} props - The component props.
 * @param {string} props.token - The token used to validate the password reset request.
 *
 * @returns {JSX.Element} - The component that renders the reset password form.
 */
const ResetPasswordMain = ({ token }) => {
  return <ResetPasswordForm token={token} />;
};

ResetPasswordMain.propTypes = {
  token: PropTypes.string.isRequired
};

export default ResetPasswordMain;
