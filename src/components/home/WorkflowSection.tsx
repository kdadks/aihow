import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { workflowBundles } from '../../data/workflows';
import { GitBranch, ArrowRight, Layers } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ready-to-Use Workflow Bundles</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Pre-configured combinations of complementary AI tools designed to work together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {workflowBundles.slice(0, 2).map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <CardTitle>{workflow.name}</CardTitle>
                </div>
                <p className="mt-2 text-blue-100">{workflow.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 font-medium mb-3">Included Tools:</p>
                <div className="space-y-4">
                  {workflow.tools.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <p className="text-sm text-gray-500">{tool.shortDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Estimated subscription cost (Subject to usage)</p>
                      <p className="text-lg font-bold text-gray-900">{workflow.totalCost}</p>
                    </div>
                    <Link to={`/bundle/${workflow.id}`} className="flex-shrink-0">
                      <Button
                        variant="outline"
                        rightIcon={<ArrowRight className="h-4 w-4" />}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/workflows">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View all workflows
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
