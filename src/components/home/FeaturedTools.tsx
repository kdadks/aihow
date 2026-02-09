import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import { Tool } from '../../types';
import { useFeaturedTools } from '../../services/api/v2/tools';
import { useComparisonStore } from '../../stores/comparisonStore';
import type { ToolV2 } from '../../types/tool.types';

export const FeaturedTools: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: allFeaturedTools = [], isLoading } = useFeaturedTools(50);

  const totalPages = Math.ceil(allFeaturedTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTools = allFeaturedTools.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured AI Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured AI Tools</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover top-rated AI tools that are transforming how people work and create
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTools.map((tool) => (
            <FeaturedToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        {totalPages> 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mb-6"
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/directory">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View all tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

interface FeaturedToolCardProps {
  tool: ToolV2;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  const { selectedTools, addTool, removeTool, isToolSelectable } = useComparisonStore();
  const isSelected = selectedTools.some(t => t.id === tool.id);

  const primarySub = tool.subcategories?.[0];
  const detailUrl = primarySub
    ? `/directory/${primarySub.category_slug}/${primarySub.slug}/${tool.slug}`
    : `/tools/${tool.slug}`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle>{tool.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {primarySub?.category_name ?? ''}
              </p>
            </div>
          </div>
          <Badge variant="primary" className="flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {tool.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600">{tool.short_description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.pricing?.has_free_option && (
            <Badge variant="success">Free Option</Badge>
          )}
          {tool.trending && (
            <Badge variant="secondary">Trending</Badge>
          )}
          {tool.subcategories?.slice(0, 1).map((sub) => (
            <Badge key={sub.id} variant="default">
              {sub.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-sm text-gray-500">Starting from</span>
              <p className="font-medium text-gray-900">
                {tool.pricing?.starting_price ?? 'Free'}
              </p>
            </div>
            <Button
              size="sm"
              variant={isSelected ? "primary" : "secondary"}
              onClick={() => isSelected ? removeTool(tool.id) : addTool(tool as unknown as Tool)}
              disabled={!isSelected && !isToolSelectable(tool as unknown as Tool)}
              leftIcon={<Scale className="h-4 w-4" />}
              className="min-w-[100px] justify-center shadow-sm">
              {isSelected ? 'Selected' : 'Compare'}
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Link to={detailUrl} className="flex-1">
              <Button size="sm" variant="primary" className="w-full">
                View Details
              </Button>
            </Link>
            <a
              href={tool.website_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1">
              <Button
                size="sm"
                variant="secondary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full">
                Visit Site
              </Button>
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
