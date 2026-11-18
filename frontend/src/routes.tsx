import { Navigate, Route, Routes } from 'react-router';
import { Layout } from '@/components/Layout';
import { AboutPage } from '@/pages/AboutPage';
import { ModelCardPage } from '@/pages/ModelCardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UploadPage } from '@/pages/UploadPage';
import { WorkspacePage } from '@/pages/WorkspacePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/upload" replace />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="model-card" element={<ModelCardPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
