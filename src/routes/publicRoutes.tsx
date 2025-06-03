import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));

export const publicRoutes: RouteObject[] = [
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
    }
];
