import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool, WorkflowBundle } from '../types';

interface UserState {
  savedTools: Tool[];
  savedWorkflows: WorkflowBundle[];
  recentlyViewed: Tool[];
  addSavedTool: (tool: Tool) => void;
  removeSavedTool: (toolId: string) => void;
  addSavedWorkflow: (workflow: WorkflowBundle) => void;
  removeSavedWorkflow: (workflowId: string) => void;
  addRecentlyViewed: (tool: Tool) => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      savedTools: [],
      savedWorkflows: [],
      recentlyViewed: [],
      addSavedTool: (tool) =>
        set((state) => ({
          savedTools: [...state.savedTools, tool],
        })),
      removeSavedTool: (toolId) =>
        set((state) => ({
          savedTools: state.savedTools.filter((tool) => tool.id !== toolId),
        })),
      addSavedWorkflow: (workflow) =>
        set((state) => ({
          savedWorkflows: [...state.savedWorkflows, workflow],
        })),
      removeSavedWorkflow: (workflowId) =>
        set((state) => ({
          savedWorkflows: state.savedWorkflows.filter((workflow) => workflow.id !== workflowId),
        })),
      addRecentlyViewed: (tool) =>
        set((state) => ({
          recentlyViewed: [
            tool,
            ...state.recentlyViewed.filter((t) => t.id !== tool.id),
          ].slice(0, 10),
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);