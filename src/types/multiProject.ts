export type ProjectRole = 'admin' | 'editor' | 'user';

export interface Project {
  id: string; // 'how2doai' | 'nirchal'
  name: string;
  schema_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProjectBinding {
  user_id: string;
  project_id: string;
  role: ProjectRole;
  created_at: string;
  updated_at: string;
}
