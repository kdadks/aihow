import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './providers/Providers';
import { adminRoutes } from './admin/routes/adminRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { MainLayout } from './components/layout/MainLayout';
import { publicRoutes } from './routes/publicRoutes';

function AppRoutes() {
    return (
        <Routes>
            {/* Main Layout wrapping all routes */}
            <Route path="/" element={<MainLayout />}>
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

                {/* Protected routes */}
                {protectedRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* Public routes */}
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                        index={route.path === '/'}
                    />
                ))}
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
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
    );
}

export default App;
