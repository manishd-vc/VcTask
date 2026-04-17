import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { UserListPage } from './pages/UserListPage'
import { UserViewPage } from './pages/UserViewPage'
import { UserEditPage } from './pages/UserEditPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="users/:id/view" element={<UserViewPage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Route>
    </Routes>
  )
}

export default App
