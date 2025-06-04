import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';

interface UserWithProfile extends User {
    profile?: {
        username: string;
        avatar_url?: string;
    };
}

interface AuthContextType {
    user: UserWithProfile | null;
    loading: boolean;
    error: AuthError | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    updateProfile: (data: { username?: string; avatar_url?: string }) => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserWithProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AuthError | null>(null);

    useEffect(() => {
        checkAuth();

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const userWithProfile = await loadUserProfile(session.user);
                setUser(userWithProfile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadUserProfile = async (user: User): Promise<UserWithProfile> => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

        return {
            ...user,
            profile: profile || { username: user.email?.split('@')[0] || 'User' }
        };
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            if (data.user) {
                const userWithProfile = await loadUserProfile(data.user);
                setUser(userWithProfile);
            }
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            if (data.user) {
                const userWithProfile = await loadUserProfile(data.user);
                setUser(userWithProfile);
            }
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            setError(null);
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: { username?: string; avatar_url?: string }) => {
        try {
            setError(null);
            setLoading(true);
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            
            // Reload user profile
            const userWithProfile = await loadUserProfile(user);
            setUser(userWithProfile);
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkAuth = async () => {
        try {
            setError(null);
            setLoading(true);
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (session?.user) {
                const userWithProfile = await loadUserProfile(session.user);
                setUser(userWithProfile);
            } else {
                setUser(null);
            }
        } catch (err) {
            setError(err as AuthError);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        updateProfile,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
