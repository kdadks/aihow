import React from 'react';

interface AdminMFAProps {
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export const AdminMFA: React.FC<AdminMFAProps> = () => {
  // Implementation will be added later
  return (
    <div>
      {/* MFA verification UI will go here */}
    </div>
  );
};