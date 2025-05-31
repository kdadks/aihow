import React from 'react';
import { AdminAuthConfig, AdminSessionInfo } from '../types/adminAuth';

interface AdminSessionTimerProps {
  config: AdminAuthConfig;
  sessionInfo: AdminSessionInfo;
  onSessionExpiring: () => void;
  onSessionExpired: () => void;
}

export const AdminSessionTimer: React.FC<AdminSessionTimerProps> = () => {
  // Implementation will be added later
  // This will handle session timeout warnings and expiration
  return (
    <div>
      {/* Session timeout warning UI will go here */}
    </div>
  );
};