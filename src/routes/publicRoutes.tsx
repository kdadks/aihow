import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const WorkflowsPage = lazy(() => import('../pages/WorkflowsPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const DirectoryPage = lazy(() => import('../pages/DirectoryPage'));
const ComparisonPage = lazy(() => import('../pages/ComparisonPage'));
const ToolDetailPage = lazy(() => import('../pages/ToolDetailPage'));
const ReviewsPage = lazy(() => import('../pages/ReviewsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BundlePage = lazy(() => import('../pages/BundlePage'));
const EnhancedBundlePage = lazy(() => import('../pages/EnhancedBundlePage'));
const TestimonialsPage = lazy(() => import('../pages/TestimonialsPage'));
const ForumPage = lazy(() => import('../pages/ForumPage'));
const RecommendationPage = lazy(() => import('../pages/RecommendationPage'));
const BundleDetailPage = lazy(() => import('../pages/BundleDetailPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const CaseStudyPage = lazy(() => import('../pages/CaseStudyPage'));
const BlogPostDetailPage = lazy(() => import('../pages/BlogPostDetailPage'));

export const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/about',
        element: <AboutPage />
    },
    {
        path: '/privacy',
        element: <PrivacyPolicyPage />
    },
    {
        path: '/terms',
        element: <TermsPage />
    },
    {
        path: '/signup',
        element: <SignupPage />
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
    },
    {
        path: '/workflows',
        element: <WorkflowsPage />
    },
    {   
        path: '/community',
        element: <CommunityPage />
    },
    {
        path: '/contact',
        element: <ContactPage />
    },
    {
        path: '/directory',
        element: <DirectoryPage />
    },
    {
        path: '/directory/:categoryId',
        element: <DirectoryPage />
    },
    {
        path: '/directory/:categoryId/:subcategoryId',
        element: <DirectoryPage />
    },
    {
        path: '/tool/:toolSlug',
        element: <ToolDetailPage />
    },
    {
        path: '/directory/:categoryId/:subcategoryId/:toolSlug',
        element: <ToolDetailPage />
    },
    {
        path: '/compare',
        element: <ComparisonPage />
    },
    {
        path: '/tool-finder',
        element: <RecommendationPage />
    },
    {
        path: '/reviews',
        element: <ReviewsPage />
    },
    {
        path: '/blog',
        element: <BlogPage />
    },
    {
        path: '/blog/:slug',
        element: <BlogPostDetailPage />
    },
    {
        path: '/bundle',
        element: <BundlePage />
    },
    {
        path: '/bundle/:bundleId',
        element: <BundleDetailPage />
    },
    {
        path: '/testimonials',
        element: <TestimonialsPage />
    },
    {
        path: '/forum',
        element: <ForumPage />
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/case-study/:id',
        element: <CaseStudyPage />
    }
];
