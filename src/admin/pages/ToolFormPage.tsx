import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ToolFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  website_url: string;
  features: string[];
  limitations: string[];
  integrations: string[];
  pricing: {
    type: string;
    starting_price?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  trending: boolean;
}

export default function ToolFormPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!toolId;

  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    website_url: '',
    features: [''],
    limitations: [''],
    integrations: [''],
    pricing: { type: 'free' },
    status: 'pending',
    featured: false,
    trending: false,
  });

  // Fetch tool data if editing
  const { data: tool, isLoading } = useQuery({
    queryKey: ['admin', 'tool', toolId],
    queryFn: async () => {
      if (!toolId) return null;
      const { data, error } = await supabase
        .from('tools_v2')
        .select('*')
        .eq('id', toolId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditMode,
  });

  // Populate form when tool data is loaded
  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name || '',
        slug: tool.slug || '',
        short_description: tool.short_description || '',
        description: tool.description || '',
        website_url: tool.website_url || '',
        features: Array.isArray(tool.features) && tool.features.length > 0 ? tool.features : [''],
        limitations: Array.isArray(tool.limitations) && tool.limitations.length > 0 ? tool.limitations : [''],
        integrations: Array.isArray(tool.integrations) && tool.integrations.length > 0 ? tool.integrations : [''],
        pricing: typeof tool.pricing === 'object' ? tool.pricing : { type: 'free' },
        status: tool.status || 'pending',
        featured: tool.featured || false,
        trending: tool.trending || false,
      });
    }
  }, [tool]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEditMode ? prev.slug : generateSlug(name),
    }));
  };

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ToolFormData) => {
      // Clean up empty strings from arrays
      const cleanedData = {
        ...data,
        features: data.features.filter(f => f.trim() !== ''),
        limitations: data.limitations.filter(l => l.trim() !== ''),
        integrations: data.integrations.filter(i => i.trim() !== ''),
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('tools_v2')
          .update(cleanedData)
          .eq('id', toolId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tools_v2')
          .insert([cleanedData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tools'] });
      navigate('/admin/tools');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleArrayFieldChange = (
    field: 'features' | 'limitations' | 'integrations',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: 'features' | 'limitations' | 'integrations') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (field: 'features' | 'limitations' | 'integrations', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              {isEditMode ? 'Edit Tool' : 'Add New Tool'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update tool information' : 'Create a new AI tool entry'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/tools')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tool Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., ChatGPT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., chatgpt"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (auto-generated from name)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              maxLength={500}
              value={formData.short_description}
              onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Brief description (max 500 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Detailed description of the tool..."
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Features</h2>
            <button
              type="button"
              onClick={() => addArrayField('features')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Feature
            </button>
          </div>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Feature description"
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('features', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Limitations</h2>
            <button
              type="button"
              onClick={() => addArrayField('limitations')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Limitation
            </button>
          </div>
          {formData.limitations.map((limitation, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={limitation}
                onChange={(e) => handleArrayFieldChange('limitations', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Limitation description"
              />
              {formData.limitations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('limitations', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Integrations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
            <button
              type="button"
              onClick={() => addArrayField('integrations')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Integration
            </button>
          </div>
          {formData.integrations.map((integration, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={integration}
                onChange={(e) => handleArrayFieldChange('integrations', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Integration name"
              />
              {formData.integrations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('integrations', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type
              </label>
              <select
                value={formData.pricing.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, type: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            {formData.pricing.type !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price
                </label>
                <input
                  type="text"
                  value={formData.pricing.starting_price || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, starting_price: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., $20/month"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status & Flags */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Status & Flags</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Trending</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/tools')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : isEditMode ? 'Update Tool' : 'Create Tool'}
          </button>
        </div>

        {saveMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              Error: {(saveMutation.error as Error).message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
