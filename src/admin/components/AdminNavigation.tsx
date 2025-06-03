import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';
import type { AdminPermission } from '../types/permissions';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    requiredPermission?: AdminPermission;
}

export default function AdminNavigation() {
    const location = useLocation();
    const { permissions } = useAdminContext();

    const navigation: NavigationItem[] = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'User Management',
            href: '/admin/users',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            requiredPermission: 'canManageUsers'
        },
        {
            name: 'Content Moderation',
            href: '/admin/moderation',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            requiredPermission: 'canModerateContent'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            requiredPermission: 'canManageSettings'
        },
        {
            name: 'Audit Log',
            href: '/admin/audit',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            requiredPermission: 'canViewMetrics'
        }
    ];

    return (
        <nav className="space-y-1">
            {navigation.map((item) => {
                // Only show items if user has required permission or no permission is required
                if (item.requiredPermission && !permissions[item.requiredPermission]) {
                    return null;
                }

                const current = location.pathname === item.href;

                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`
                            flex items-center px-4 py-2 text-sm font-medium rounded-md
                            ${current
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                        `}
                        aria-current={current ? 'page' : undefined}
                    >
                        <span className={`mr-3 ${current ? 'text-gray-500' : 'text-gray-400'}`}>
                            {item.icon}
                        </span>
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}
