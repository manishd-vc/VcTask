// components
import EditUser from 'src/components/_admin/users/editUser';
// api

export default async function page() {
  return <EditUser isEdit isProfile />;
}
