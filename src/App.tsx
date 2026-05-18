import { Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from '@/hooks/useAppData';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import ChecklistsPage from '@/pages/ChecklistsPage';
import UsersPage from '@/pages/UsersPage';
import CareersPage from '@/pages/CareersPage';
import CareersJobPage from '@/pages/CareersJobPage';

export default function App() {
  return (
    <AppDataProvider>
      <Routes>
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:jobId" element={<CareersJobPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="checklists" element={<ChecklistsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppDataProvider>
  );
}
