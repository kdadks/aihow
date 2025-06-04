import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './providers/Providers';
import { adminRoutes } from './admin/routes/adminRoutes';
import { MainLayout } from './components/layout/MainLayout';
import { publicRoutes } from './routes/publicRoutes';

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
