import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { Tool, SavedComparison, ComparisonMetric, SupportOptionKey } from '../types';

type SortableField = keyof Pick<Tool, 'name' | 'rating' | 'reviewCount'> | '';

interface Filters {
  features: string[];
  pricing: string[];
  certifications: string[];
  supportOptions: SupportOptionKey[];
}

interface ComparisonState {
  selectedTools: Tool[];
  savedComparisons: SavedComparison[];
  popularComparisons: ComparisonMetric[];
  sortField: SortableField;
  sortDirection: 'asc' | 'desc';
  filters: Filters;
  isToolSelectable: (tool: Tool) => boolean;
  addTool: (tool: Tool) => void;
  removeTool: (toolId: string) => void;
  clearTools: () => void;
  saveComparison: (name: string, isPublic?: boolean) => void;
  loadComparison: (comparisonId: string) => void;
  deleteComparison: (comparisonId: string) => void;
  setSortField: (field: SortableField) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setFilter: (key: keyof Filters, values: string[]) => void;
  clearFilters: () => void;
  trackComparison: () => void;
  exportComparison: (format: 'pdf' | 'csv') => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedTools: [],
      savedComparisons: [],
      popularComparisons: [],
      sortField: '',
      sortDirection: 'asc',
      filters: {
        features: [],
        pricing: [],
        certifications: [],
        supportOptions: [],
      },

      isToolSelectable: (tool) => {
        const { selectedTools } = get();
        if (selectedTools.length >= 4) {
          toast.error('Maximum 4 tools can be compared');
          return false;
        }
        if (selectedTools.some(t => t.id === tool.id)) {
          toast.error('Tool already added to comparison');
          return false;
        }
        return true;
      },

      addTool: (tool) => {
        const state = get();
        if (!state.isToolSelectable(tool)) return;
        
        set((state) => ({
          selectedTools: [...state.selectedTools, tool]
        }));
        toast.success(`${tool.name} added to comparison`);
      },

      removeTool: (toolId) => {
        const tool = get().selectedTools.find(t => t.id === toolId);
        set((state) => ({
          selectedTools: state.selectedTools.filter((t) => t.id !== toolId),
        }));
        if (tool) {
          toast(`${tool.name} removed from comparison`, {
            icon: '❌'
          });
        }
      },

      clearTools: () => {
        set({ selectedTools: [] });
        toast('Comparison cleared', {
          icon: '🗑️'
        });
      },

      saveComparison: (name, isPublic = false) =>
        set((state) => {
          const newComparison: SavedComparison = {
            id: crypto.randomUUID(),
            name,
            toolIds: state.selectedTools.map(tool => tool.id),
            createdAt: new Date(),
            userId: 'current-user', // Replace with actual user ID
            isPublic,
            views: 0
          };
          toast.success('Comparison saved successfully');
          return {
            savedComparisons: [...state.savedComparisons, newComparison]
          };
        }),

      loadComparison: (comparisonId) =>
        set((state) => {
          const comparison = state.savedComparisons.find(c => c.id === comparisonId);
          if (!comparison) {
            toast.error('Comparison not found');
            return state;
          }

          // Increment views
          const updatedComparisons = state.savedComparisons.map(c =>
            c.id === comparisonId ? { ...c, views: c.views + 1 } : c
          );

          toast.success('Comparison loaded');
          return {
            savedComparisons: updatedComparisons,
            selectedTools: [] // Tools should be loaded from the database using toolIds
          };
        }),

      deleteComparison: (comparisonId) =>
        set((state) => {
          toast('Comparison deleted', {
            icon: '🗑️'
          });
          return {
            savedComparisons: state.savedComparisons.filter(c => c.id !== comparisonId)
          };
        }),

      setSortField: (field) => set({ sortField: field }),
      
      setSortDirection: (direction) => set({ sortDirection: direction }),

      setFilter: (key, values) =>
        set((state) => ({
          filters: { ...state.filters, [key]: values }
        })),

      clearFilters: () => set({
        filters: {
          features: [],
          pricing: [],
          certifications: [],
          supportOptions: []
        }
      }),

      trackComparison: () =>
        set((state) => {
          const toolIds = state.selectedTools.map(tool => tool.id).sort();
          const metric = state.popularComparisons.find(
            m => JSON.stringify(m.toolIds.sort()) === JSON.stringify(toolIds)
          );

          if (metric) {
            return {
              popularComparisons: state.popularComparisons.map(m =>
                JSON.stringify(m.toolIds.sort()) === JSON.stringify(toolIds)
                  ? { ...m, count: m.count + 1, lastUsed: new Date() }
                  : m
              )
            };
          }

          return {
            popularComparisons: [...state.popularComparisons, {
              toolIds,
              count: 1,
              lastUsed: new Date()
            }]
          };
        }),

      exportComparison: (format) => {
        // Implementation will be added in the ComparisonGrid component
        toast.success(`Exporting comparison as ${format.toUpperCase()}`);
      },
    }),
    {
      name: 'comparison-storage',
    }
  )
);