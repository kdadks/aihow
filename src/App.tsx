import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Providers } from './providers/Providers';
import { LoginForm } from './auth/components/LoginForm';
import { RegisterForm } from './auth/components/RegisterForm';
import { ForgotPassword } from './auth/components/ForgotPassword';
import { ResetPassword } from './auth/components/ResetPassword';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import RecommendationPage from './pages/RecommendationPage';
import ToolDetailPage from './pages/ToolDetailPage';
import WorkflowsPage from './pages/WorkflowsPage';
import ComparisonPage from './pages/ComparisonPage';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import ReviewsPage from './pages/ReviewsPage';
import BlogPage from './pages/BlogPage';
import ForumPage from './pages/ForumPage';
import TestimonialsPage from './pages/TestimonialsPage';

function App() {
  return (
    <Providers>
      <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="directory">
            <Route index element={<DirectoryPage />} />
            <Route path=":categoryId" element={<DirectoryPage />} />
            <Route path=":categoryId/:subcategoryId" element={<DirectoryPage />} />
          </Route>
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="recommendation" element={<RecommendationPage />} />
          <Route path="tool/:slug" element={<ToolDetailPage />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="compare" element={<ComparisonPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </Router>
    </Providers>
  );
}

export default App;