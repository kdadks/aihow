import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tool } from '../../types';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
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
              <CardTitle className="text-xl">{tool.name}</CardTitle>
              <p className="text-sm text-gray-500 capitalize">{tool.categoryId.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{tool.rating}</span>
            <span className="text-gray-500 text-sm">({tool.reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600">{tool.shortDescription}</p>
        
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {tool.pricing.hasFreeOption && (
              <Badge variant="success">Free Option</Badge>
            )}
            {tool.trending && (
              <Badge variant="secondary">Trending</Badge>
            )}
            {tool.featured && (
              <Badge variant="primary">Featured</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {tool.subcategoryIds.map((subcategory) => (
              <Badge key={subcategory} variant="outline" className="text-xs capitalize">
                {subcategory.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        {tool.features.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 mb-1">Key Features:</p>
            <ul className="text-sm text-gray-600 pl-5 list-disc space-y-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {tool.pricing.startingPrice ? `From ${tool.pricing.startingPrice}` : 'Free'}
          </span>
          <div className="flex space-x-2">
            <a href={tool.website} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="h-4 w-4" />}>
                Visit Site
              </Button>
            </a>
            <Link to={`/tool/${tool.slug}`}>
              <Button size="sm">Details</Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};