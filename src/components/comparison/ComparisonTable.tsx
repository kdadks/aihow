import React from 'react';
import { Tool } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Star, Download, X, Check } from 'lucide-react';

interface ComparisonTableProps {
  tools: Tool[];
  onRemoveTool?: (tool: Tool) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ tools, onRemoveTool }) => {
  const allFeatures = Array.from(
    new Set(tools.flatMap((tool) => tool.features))
  ).sort();

  const exportComparison = () => {
    const csvContent = [
      ['Feature', ...tools.map((tool) => tool.name)],
      ['Rating', ...tools.map((tool) => tool.rating.toString())],
      ['Price', ...tools.map((tool) => tool.pricing.startingPrice || 'Free')],
      ['Category', ...tools.map((tool) => tool.categoryId)],
      ...allFeatures.map((feature) => [
        feature,
        ...tools.map((tool) => (tool.features.includes(feature) ? '✓' : '✗')),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tool-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 overflow-x-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tool Comparison</h2>
        <Button
          variant="outline"
          onClick={exportComparison}
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export Comparison
        </Button>
      </div>

      <div className="min-w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              {tools.map((tool) => (
                <th
                  key={tool.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center justify-between">
                    <span>{tool.name}</span>
                    {onRemoveTool && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTool(tool)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Rating
              </td>
              {tools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{tool.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Pricing
              </td>
              {tools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge variant="outline">
                    {tool.pricing.startingPrice || 'Free'}
                  </Badge>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Category
              </td>
              {tools.map((tool) => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge variant="secondary" className="capitalize">
                    {tool.categoryId.replace('-', ' ')}
                  </Badge>
                </td>
              ))}
            </tr>
            {allFeatures.map((feature) => (
              <tr key={feature}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {feature}
                </td>
                {tools.map((tool) => (
                  <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tool.features.includes(feature) ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};