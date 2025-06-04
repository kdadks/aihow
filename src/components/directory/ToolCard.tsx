import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tool } from '../../types';

interface ToolCardProps {
  tool: Tool;
  isSelected?: boolean;
  onCompare?: () => void;
  isCompareDisabled?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isSelected = false,
  onCompare,
  isCompareDisabled = false
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">{tool.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="capitalize text-xs">
                    {tool.categoryId.replace('-', ' ')}
                  </Badge>
                  <div className="flex items-center ml-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium ml-1">{tool.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({tool.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <p className="text-gray-600">{tool.shortDescription}</p>
        
        <div className="space-y-3">
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
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Key Features</p>
            <ul className="grid gap-2">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-sm text-gray-500">Starting from</span>
              <p className="font-medium text-gray-900">
                {tool.pricing.startingPrice ? tool.pricing.startingPrice : 'Free'}
              </p>
            </div>
            {onCompare && (
              <Button
                size="sm"
                variant={isSelected ? "primary" : "secondary"}
                onClick={onCompare}
                disabled={isCompareDisabled}
                leftIcon={<Scale className="h-4 w-4" />}
                className="min-w-[100px] justify-center shadow-sm"
              >
                {isSelected ? 'Selected' : 'Compare'}
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <Link to={`/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`} className="flex-1">
              <Button size="sm" variant="primary" className="w-full">
                View Details
              </Button>
            </Link>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                size="sm"
                variant="secondary"
                rightIcon={<ExternalLink className="h-4 w-4" />}
                className="w-full"
              >
                Visit Site
              </Button>
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
