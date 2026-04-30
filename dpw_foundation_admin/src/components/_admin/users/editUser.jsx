// components
import PropTypes from 'prop-types';
import UserForm from 'src/components/forms/user';
EditUser.propTypes = {
  // 'isView' is a boolean indicating if the component is in view mode
  isView: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  isProfile: PropTypes.bool.isRequired
};
/**
 * EditUser Component - Renders the UserForm component for editing a user.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isView - Flag to indicate if the form is for viewing (disabled fields).
 * @param {boolean} props.isEdit - Flag to indicate if the form is for editing (enabled fields).
 *
 * @returns {JSX.Element} - The rendered UserForm component with the appropriate flags.
 */
export default function EditUser({ isView, isEdit, isProfile }) {
  return <UserForm isView={isView} isEdit={isEdit} isProfile={isProfile} />;
}
