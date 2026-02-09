import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayoutNew: FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-30">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumbs or Page Title will go here */}
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {/* This will be replaced by actual page title */}
                </h2>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* System Status */}
                <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">System Online</span>
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Quick Actions */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200/50">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                © {new Date().getFullYear()} <span className="font-semibold text-blue-600">How2doAI</span> - Admin Portal
              </div>
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure Connection</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>v2.5.0</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
