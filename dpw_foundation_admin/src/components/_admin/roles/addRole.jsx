// Import the RolesForm component
import RolesForm from 'src/components/forms/roles';

/**
 * addRole Component
 *
 * This component renders the `RolesForm` for creating a new role.
 * It does not pass the `isEdit` prop, indicating that the form is in add mode.
 *
 * @returns {JSX.Element} - Rendered addRole component
 */
export default function addRole() {
  return <RolesForm />;
}
