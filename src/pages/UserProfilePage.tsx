import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';
import { UserProfile } from '../auth/types';
import { checkDatabaseAccess } from '../lib/supabase';

interface ExtendedUserProfile extends UserProfile {
  bio?: string;
  email?: string;
  created_at?: string;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, updateProfile } = useAuth();
  
  // State management
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  const verifyAccess = useCallback(async () => {
    if (accessChecked) return true;
    
    try {
      const { profilesAccess, error: accessError } = await checkDatabaseAccess();
      if (!profilesAccess) {
        console.error('No database access:', accessError);
        await logout();
        navigate('/login', { 
          state: { error: 'Database access denied. Please log in again.' }
        });
        return false;
      }
      setAccessChecked(true);
      return true;
    } catch (error) {
      console.error('Access check failed:', error);
      setError('Failed to verify database access');
      return false;
    }
  }, [accessChecked, logout, navigate]);

  // Initial profile load
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.profile || initialLoadComplete) return;

      setLoading(true);
      try {
        const hasAccess = await verifyAccess();
        if (!hasAccess) return;

        const extendedProfile = {
          ...user.profile,
          email: user.email,
          created_at: user.created_at
        };

        setProfile(extendedProfile);
        setFormData({
          username: user.profile.username || '',
          full_name: user.profile.full_name || '',
          bio: '',
          avatar_url: user.profile.avatar_url || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    loadProfile();
  }, [user, verifyAccess, initialLoadComplete]);

  const handleSave = async () => {
    if (!user || !profile) {
      console.error('No user or profile available for update');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const hasAccess = await verifyAccess();
      if (!hasAccess) {
        throw new Error('No database access');
      }

      await updateProfile({
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        avatar_url: formData.avatar_url.trim(),
        roles: profile.roles
      });

      setProfile(prev => ({
        ...prev!,
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        avatar_url: formData.avatar_url.trim()
      }));

      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
    setEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state
  if (!user || (!profile && (loading || authLoading))) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {!user ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
              <p className="text-gray-600">
                Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to view your profile.
              </p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
          >
            Dashboard
          </Button>
          <Button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.full_name || profile?.username || 'User'}
              </h2>
              <p className="text-gray-600 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {profile?.email}
              </p>
              {profile?.created_at && (
                <p className="text-gray-500 text-sm flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {formatDate(profile.created_at)}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => editing ? handleCancel() : setEditing(true)}
            variant="outline"
            className="flex items-center"
          >
            {editing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {profile?.username || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {profile?.full_name || 'Not set'}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[100px]">
                {profile?.bio || 'No bio provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            {editing ? (
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {profile?.avatar_url || 'No avatar set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500">
              {profile?.email} (cannot be changed here)
            </p>
          </div>

          {editing && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePage;
