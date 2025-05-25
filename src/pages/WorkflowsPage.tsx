import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { workflowBundles } from '../data/workflows';
import { GitBranch, ArrowRight, MoveRight } from 'lucide-react';

const WorkflowsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">AI Workflow Bundles</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Discover pre-configured combinations of AI tools designed to work together to solve specific problems and streamline your workflow.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-6 md:mb-0 md:mr-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">What are workflow bundles?</h2>
            <p className="text-gray-700">
              Workflow bundles are carefully selected combinations of complementary AI tools that work together to solve specific problems. Each bundle provides a complete solution with implementation guides to help you get started quickly.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button rightIcon={<MoveRight className="h-4 w-4" />}>
              Create Custom Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {workflowBundles.map((workflow) => (
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
                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                      <img src={tool.logo} alt={tool.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{tool.name}</h4>
                      <p className="text-sm text-gray-500">{tool.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Implementation Steps:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                  {workflow.implementationSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 pt-4">
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-lg font-bold text-gray-900">{workflow.totalCost}</p>
                </div>
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Get Started
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a custom workflow?</h2>
          <p className="text-gray-700 mb-6">
            Don't see a workflow bundle that fits your specific needs? We can help you create a custom workflow with the perfect combination of AI tools for your unique requirements.
          </p>
          <Button size="lg">Contact Our Team</Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowsPage;