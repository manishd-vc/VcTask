// component
import PropTypes from 'prop-types';
import VerifyOTPForm from 'src/components/forms/otp';

OTPMain.propTypes = {
  user: PropTypes.object.isRequired
};

export default function OTPMain({ user }) {
  return <VerifyOTPForm user={user} />;
}
