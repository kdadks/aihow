import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tool } from '../../types';
import { tools } from '../../data/tools';

export const FeaturedTools: React.FC = () => {
  const featuredTools = tools.filter(tool => tool.featured);

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
          {featuredTools.map((tool) => (
            <FeaturedToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="mt-12 text-center">
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
  tool: Tool;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-md overflow-hidden">
              <img 
                src={tool.logo} 
                alt={tool.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle>{tool.name}</CardTitle>
              <p className="text-sm text-gray-500">{tool.categoryId.replace('-', ' ')}</p>
            </div>
          </div>
          <Badge variant="primary" className="flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {tool.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600">{tool.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.pricing.hasFreeOption && (
            <Badge variant="success">Free Option</Badge>
          )}
          {tool.trending && (
            <Badge variant="secondary">Trending</Badge>
          )}
          {tool.subcategoryIds.slice(0, 1).map((subcategory) => (
            <Badge key={subcategory} variant="default">
              {subcategory.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {tool.pricing.startingPrice ? `From ${tool.pricing.startingPrice}` : 'Free'}
          </span>
          <Link to={`/tool/${tool.slug}`}>
            <Button size="sm" variant="outline">View Details</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};