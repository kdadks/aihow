import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool } from '../types';

interface ComparisonState {
  selectedTools: Tool[];
  addTool: (tool: Tool) => void;
  removeTool: (toolId: string) => void;
  clearTools: () => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      selectedTools: [],
      addTool: (tool) =>
        set((state) => ({
          selectedTools: state.selectedTools.length < 10 
            ? [...state.selectedTools, tool]
            : state.selectedTools,
        })),
      removeTool: (toolId) =>
        set((state) => ({
          selectedTools: state.selectedTools.filter((tool) => tool.id !== toolId),
        })),
      clearTools: () => set({ selectedTools: [] }),
    }),
    {
      name: 'comparison-storage',
    }
  )
);