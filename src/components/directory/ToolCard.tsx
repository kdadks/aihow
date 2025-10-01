import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tool } from '../../types';

import { Helmet } from 'react-helmet-async';

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
    <Card className="h-full flex flex-col group">
      <CardHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
                  {tool.name}
                </CardTitle>
                <div className="flex items-center flex-wrap gap-3">
                  <Badge variant="outline" className="capitalize text-xs bg-gradient-to-r from-gray-50 to-white shadow-sm">
                    {tool.categoryId.replace('-', ' ')}
                  </Badge>
                  <div className="flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium ml-1.5 text-yellow-700">{tool.rating}</span>
                    <span className="text-yellow-600 text-sm ml-1.5">({tool.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <p className="text-gray-600 text-base leading-relaxed">{tool.shortDescription}</p>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tool.pricing.hasFreeOption && (
              <Badge variant="success" className="group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <span className="mr-1">💎</span> Free Option
              </Badge>
            )}
            {tool.trending && (
              <Badge variant="secondary" className="group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <span className="mr-1">🔥</span> Trending
              </Badge>
            )}
            {tool.featured && (
              <Badge variant="primary" className="group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <span className="mr-1">⭐</span> Featured
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tool.subcategoryIds.map((subcategory) => (
              <Badge 
                key={subcategory} 
                variant="outline" 
                className="text-xs capitalize bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 transition-colors duration-200"
              >
                {subcategory.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        {tool.features.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-4">Key Features</p>
            <ul className="grid gap-3">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start group/feature">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform duration-200">
                    <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between pb-4">
            <div>
              <span className="text-sm text-gray-500 block">Starting from</span>
              <p className="font-semibold text-gray-900 text-lg mt-1">
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
                className="min-w-[120px] justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {isSelected ? 'Selected' : 'Compare'}
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <Link 
              to={`/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`} 
              className="flex-1"
            >
              <Button 
                size="lg" 
                variant="primary" 
                className="w-full shadow-sm hover:shadow-md transition-shadow duration-200"
              >
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
                size="lg"
                variant="secondary"
                rightIcon={<ExternalLink className="h-4 w-4 ml-1.5" />}
                className="w-full shadow-sm hover:shadow-md transition-shadow duration-200"
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
