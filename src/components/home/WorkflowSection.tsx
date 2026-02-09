import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { GitBranch, ArrowRight } from 'lucide-react';
import { useBundles } from '../../services/api/v2/bundles';

export const WorkflowSection: React.FC = () => {
  const { data: { bundles = [] } = {} } = useBundles({ limit: 2 });

  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ready-to-Use Workflow Bundles</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Pre-configured combinations of complementary AI tools designed to work together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <CardTitle>{bundle.name}</CardTitle>
                </div>
                <p className="mt-2 text-blue-100">{bundle.description}</p>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Estimated subscription cost (Subject to usage)</p>
                      <p className="text-lg font-bold text-gray-900">{bundle.total_cost}</p>
                    </div>
                    <Link to={`/bundle/${bundle.slug}`} className="flex-shrink-0">
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
