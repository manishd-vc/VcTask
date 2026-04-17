import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import TableDataPage from './pages/TableDataPage.jsx'
import TodoOperationPage from './pages/TodoOperationPage.jsx'
import UserDetailPage from './pages/UserDetailPage.jsx'
import UserListPage from './pages/UserListPage.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          <Route path="to-do-operation" element={<TodoOperationPage />} />
          <Route path="table-data" element={<TableDataPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
