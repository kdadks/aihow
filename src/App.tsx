import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import RecommendationPage from './pages/RecommendationPage';
import ToolDetailPage from './pages/ToolDetailPage';
import WorkflowsPage from './pages/WorkflowsPage';
import ComparisonPage from './pages/ComparisonPage';
import BundlePage from './pages/BundlePage';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="recommendation" element={<RecommendationPage />} />
          <Route path="tool/:slug" element={<ToolDetailPage />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="compare" element={<ComparisonPage />} />
          <Route path="bundles" element={<BundlePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;