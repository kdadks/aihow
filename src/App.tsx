import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './providers/Providers';
import { adminRoutes } from './admin/routes/adminRoutes';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Lazy load the dashboard
const UserDashboard = lazy(() => import('./pages/UserDashboard'));

function AppRoutes() {
    return (
        <Routes>
            {/* Admin routes */}
            {adminRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                >
                    {route.children?.map((child) => (
                        <Route
                            key={child.path || 'index'}
                            path={child.path}
                            element={child.element}
                            index={child.index}
                        />
                    ))}
                </Route>
            ))}

            {/* Main Layout with public routes */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Protected dashboard route */}
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Providers>
            <Router>
                <Suspense
                    fallback={
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    }
                >
                    <AppRoutes />
                </Suspense>
            </Router>
        </Providers>
    );
}

export default App;
