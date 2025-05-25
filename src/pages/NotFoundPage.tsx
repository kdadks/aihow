import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SearchX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <SearchX className="h-24 w-24 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been removed or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/">
            <Button size="lg">
              Return Home
            </Button>
          </Link>
          <Link to="/directory">
            <Button variant="outline" size="lg">
              Browse Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;