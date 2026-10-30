import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import LandingPage from '@/pages/LandingPage'
import { DemoPage } from '@/pages/DemoPage'
import { LibraryPage } from '@/pages/library/LibraryPage'
import { AssetDetailPage } from '@/pages/library/AssetDetailPage'
import { UploadPage } from '@/pages/library/UploadPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { UserManagement } from '@/pages/admin/UserManagement'
import { CategoryManagement } from '@/pages/admin/CategoryManagement'
import { AssistantPage } from '@/pages/assistant/AssistantPage'
import { ProcessModelPage } from '@/pages/se-lab/ProcessModelPage'
import { RequirementsPage } from '@/pages/se-lab/RequirementsPage'
import { ArchitecturePage } from '@/pages/se-lab/ArchitecturePage'
import { UMLDiagramsPage } from '@/pages/se-lab/UMLDiagramsPage'
import { BlackBoxPage } from '@/pages/se-lab/BlackBoxPage'
import { WhiteBoxPage } from '@/pages/se-lab/WhiteBoxPage'
import { TestExecutionPage } from '@/pages/se-lab/TestExecutionPage'
import { QualityPage } from '@/pages/se-lab/QualityPage'
import { ConfigMgmtPage } from '@/pages/se-lab/ConfigMgmtPage'
import { EstimationPage } from '@/pages/se-lab/EstimationPage'
import { SyllabusPage } from '@/pages/se-lab/SyllabusPage'
import { VivaPage } from '@/pages/se-lab/VivaPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/demo',
    element: <DemoPage />,
  },
  // Public auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />,
  },
  // Protected app routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Library
      { path: 'library', element: <LibraryPage /> },
      { path: 'library/:id', element: <AssetDetailPage /> },
      {
        path: 'library/upload',
        element: (
          <ProtectedRoute requireAdmin>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      // Admin
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute requireAdmin>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/assets',
        element: (
          <ProtectedRoute requireAdmin>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/categories',
        element: (
          <ProtectedRoute requireAdmin>
            <CategoryManagement />
          </ProtectedRoute>
        ),
      },
      // AI Assistant
      { path: 'assistant', element: <AssistantPage /> },
      // SE Lab
      { path: 'se-lab/process-model', element: <ProcessModelPage /> },
      { path: 'se-lab/requirements', element: <RequirementsPage /> },
      { path: 'se-lab/architecture', element: <ArchitecturePage /> },
      { path: 'se-lab/uml-diagrams', element: <UMLDiagramsPage /> },
      { path: 'se-lab/black-box', element: <BlackBoxPage /> },
      { path: 'se-lab/white-box', element: <WhiteBoxPage /> },
      { path: 'se-lab/test-execution', element: <TestExecutionPage /> },
      { path: 'se-lab/quality', element: <QualityPage /> },
      { path: 'se-lab/config-mgmt', element: <ConfigMgmtPage /> },
      { path: 'se-lab/estimation', element: <EstimationPage /> },
      { path: 'se-lab/syllabus', element: <SyllabusPage /> },
      { path: 'se-lab/viva', element: <VivaPage /> },
    ],
  },
  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
])
