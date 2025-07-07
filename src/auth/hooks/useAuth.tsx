import { useAuth as useUnifiedAuth } from '../context/UnifiedAuthContext';
import type { AuthContextType } from '../types';

export function useAuth() {
    return useUnifiedAuth();
}

export type { AuthContextType };
