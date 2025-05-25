import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import * as LucideIcons from 'lucide-react';

export const CategorySection: React.FC = () => {
  // Dynamically get icons from lucide-react
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return Icon ? <Icon className="h-6 w-6" /> : <LucideIcons.Box className="h-6 w-6" />;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explore AI tools organized by functionality to find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                {getIcon(category.icon)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center">{category.name}</h3>
              <p className="mt-2 text-sm text-gray-500 text-center line-clamp-2">
                {category.description}
              </p>
              <span className="mt-3 text-xs text-gray-400">
                {category.subcategories.length} subcategories
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};