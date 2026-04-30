// component
import PropTypes from 'prop-types';
import VerifyOTPForm from 'src/components/forms/otp';

/**
 * OTPMain - A component that renders the OTP verification form.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object, passed to the OTP form.
 *
 * @returns {JSX.Element} - The component that renders the OTP verification form.
 */
OTPMain.propTypes = {
  user: PropTypes.object.isRequired
};

export default function OTPMain({ user }) {
  return <VerifyOTPForm user={user} />;
}
