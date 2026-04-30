// Import the RolesForm component
import RolesForm from 'src/components/forms/roles';

/**
 * editRole Component
 *
 * This component renders the `RolesForm` for editing an existing role.
 * It passes the `isEdit` prop to indicate that the form is in edit mode.
 *
 * @returns {JSX.Element} - Rendered editRole component
 */
export default function editRole() {
  return <RolesForm isEdit />;
}
