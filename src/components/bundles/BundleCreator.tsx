import React, { useState } from 'react';
import { Tool } from '../../types';
import { tools } from '../../data/tools';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Plus, X, Calculator, Save } from 'lucide-react';

interface BundleCreatorProps {
  onSave?: (bundle: { name: string; tools: Tool[]; totalCost: number }) => void;
}

export const BundleCreator: React.FC<BundleCreatorProps> = ({ onSave }) => {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [bundleName, setBundleName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const calculateTotalCost = (tools: Tool[]): number => {
    return tools.reduce((total, tool) => {
      const price = tool.pricing.startingPrice
        ? parseFloat(tool.pricing.startingPrice.replace(/[^0-9.]/g, ''))
        : 0;
      return total + price;
    }, 0);
  };

  const filteredTools = tools.filter(tool => 
    !selectedTools.includes(tool) &&
    (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.categoryId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddTool = (tool: Tool) => {
    setSelectedTools([...selectedTools, tool]);
  };

  const handleRemoveTool = (tool: Tool) => {
    setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
  };

  const handleSaveBundle = () => {
    if (onSave && bundleName && selectedTools.length > 0) {
      onSave({
        name: bundleName,
        tools: selectedTools,
        totalCost: calculateTotalCost(selectedTools)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Custom Bundle</h2>
        
        <div className="mb-6">
          <label htmlFor="bundleName" className="block text-sm font-medium text-gray-700 mb-2">
            Bundle Name
          </label>
          <input
            type="text"
            id="bundleName"
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a name for your bundle"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="toolSearch" className="block text-sm font-medium text-gray-700 mb-2">
            Search Tools
          </label>
          <input
            type="text"
            id="toolSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name or category"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{tool.name}</CardTitle>
                <Button
                  size="sm"
                  onClick={() => handleAddTool(tool)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{tool.shortDescription}</p>
                <div className="mt-2">
                  <Badge variant="outline">{tool.pricing.startingPrice || 'Free'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTools.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Tools</h3>
            <div className="space-y-4">
              {selectedTools.map(tool => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{tool.name}</h4>
                    <p className="text-sm text-gray-500">{tool.pricing.startingPrice || 'Free'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTool(tool)}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">
                  Total Cost: ${calculateTotalCost(selectedTools)}/month
                </span>
              </div>
              <Button
                onClick={handleSaveBundle}
                disabled={!bundleName || selectedTools.length === 0}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Bundle
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};