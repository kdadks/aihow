import React from 'react';
import { useComparisonStore } from '../stores/comparisonStore';
import { ComparisonTable } from '../components/comparison/ComparisonTable';
import { SearchFilters } from '../components/directory/SearchFilters';
import { ToolCard } from '../components/directory/ToolCard';
import { tools } from '../data/tools';
import { Tool } from '../types';

const ComparisonPage: React.FC = () => {
  const { selectedTools, addTool, removeTool } = useComparisonStore();

  const handleAddTool = (tool: Tool) => {
    if (selectedTools.length < 10 && !selectedTools.some(t => t.id === tool.id)) {
      addTool(tool);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Compare AI Tools</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Select up to 10 tools to compare their features, pricing, and capabilities side by side.
        </p>
      </div>

      {selectedTools.length > 0 && (
        <div className="mb-12">
          <ComparisonTable
            tools={selectedTools}
            onRemoveTool={removeTool}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Tools to Compare</h2>
        <SearchFilters onFilterChange={() => {}} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tools
            .filter(tool => !selectedTools.some(t => t.id === tool.id))
            .map(tool => (
              <div
                key={tool.id}
                onClick={() => handleAddTool(tool)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <ToolCard tool={tool} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;