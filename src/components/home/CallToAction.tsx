import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Zap } from 'lucide-react';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block p-3 bg-blue-500 rounded-full mb-6">
          <Zap className="h-8 w-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">
          Ready to find your perfect AI workflow?
        </h2>
        <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
          Get personalized recommendations based on your specific needs and start boosting your productivity today.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/tool-finder">
            <Button size="lg" variant="outline" className="border-white bg-white text-blue-600 hover:bg-white hover:text-blue-800">
              Get Started
            </Button>
          </Link>
          <Link to="/directory">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-500">
              Browse All Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};