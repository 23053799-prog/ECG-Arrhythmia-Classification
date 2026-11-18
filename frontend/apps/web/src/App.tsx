import { Route, Routes } from "react-router"

import { Layout } from "./components/Layout"

import { OverviewPage } from "./pages/OverviewPage"
import { UploadPage } from "./pages/UploadPage"
import { WorkspacePage } from "./pages/WorkspacePage"
import { ModelCardPage } from "./pages/ModelCardPage"
import { AboutPage } from "./pages/AboutPage"
import { NotFoundPage } from "./pages/NotFoundPage"

export function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route index element={<OverviewPage />} />

        <Route path="upload" element={<UploadPage />} />

        <Route path="workspace" element={<WorkspacePage />} />

        <Route path="model-card" element={<ModelCardPage />} />

        <Route path="about" element={<AboutPage />} />

        <Route path="*" element={<NotFoundPage />} />

      </Route>

    </Routes>
  )
}