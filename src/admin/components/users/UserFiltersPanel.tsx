import React, { useState } from 'react';
import { UserFilters, UserMetadata } from '../../types/user-management';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface UserFiltersPanelProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const STATUS_OPTIONS: UserMetadata['status'][] = ['active', 'inactive', 'suspended'];
const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Support', 'Product', 'Design'];

export default function UserFiltersPanel({ filters, onFiltersChange }: UserFiltersPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleFilterChange = (key: keyof UserFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const handleReset = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users..."
            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="submit">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Status:</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">Department:</label>
            <select
              value={filters.department || 'all'}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <Button 
            onClick={handleReset}
            variant="secondary"
            className="ml-auto"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}