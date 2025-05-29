import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseError } from './types';

// Environment validation
function validateEnvironment(): void {
    const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
        throw new DatabaseError(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

let supabaseInstance: SupabaseClient | null = null;

export function initializeDatabase(): SupabaseClient {
    try {
        validateEnvironment();

        if (supabaseInstance) {
            return supabaseInstance;
        }

        supabaseInstance = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true
                },
                db: {
                    schema: 'public'
                }
            }
        );

        return supabaseInstance;
    } catch (error) {
        throw new DatabaseError('Failed to initialize database connection', error as Error);
    }
}

export function getDatabase(): SupabaseClient {
    if (!supabaseInstance) {
        throw new DatabaseError('Database not initialized. Call initializeDatabase() first.');
    }
    return supabaseInstance;
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        const db = getDatabase();
        const { data, error } = await db.from('tool_categories').select('id').limit(1);
        
        if (error) {
            throw error;
        }
        
        return true;
    } catch (error) {
        throw new DatabaseError('Database connection check failed', error as Error);
    }
}

// Cleanup function for graceful shutdown
export function closeDatabaseConnection(): void {
    if (supabaseInstance) {
        // Remove instance reference
        supabaseInstance = null;
    }
}