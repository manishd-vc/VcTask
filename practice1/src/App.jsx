import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import UserListPage from './pages/UserListPage.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UserListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
