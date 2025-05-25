import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Facebook, Instagram, Github as GitHub } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">how2AI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Discover and compare the best AI tools for your workflow. Our platform helps you find the perfect AI solutions for your specific needs.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <GitHub className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/directory" className="text-sm text-gray-600 hover:text-gray-900">
                  Tool Directory
                </Link>
              </li>
              <li>
                <Link to="/recommendation" className="text-sm text-gray-600 hover:text-gray-900">
                  Tool Finder
                </Link>
              </li>
              <li>
                <Link to="/workflows" className="text-sm text-gray-600 hover:text-gray-900">
                  Workflow Bundles
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/reviews" className="text-sm text-gray-600 hover:text-gray-900">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-sm text-gray-600 hover:text-gray-900">
                  Forum
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-sm text-gray-600 hover:text-gray-900">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} how2AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};