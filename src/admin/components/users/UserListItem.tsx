import { ExtendedUser } from '../../types/user-management';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

interface UserListItemProps {
  user: ExtendedUser;
  selected: boolean;
  onSelect: (userId: string, selected: boolean) => void;
}

export default function UserListItem({ user, selected, onSelect }: UserListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(user.id, e.target.checked)}
          className="form-checkbox"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {user.metadata.firstName} {user.metadata.lastName}
            </h3>
            <Badge variant="outline" className={getStatusColor(user.metadata.status)}>
              {user.metadata.status}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500 mt-1">
            <div>{user.email}</div>
            <div className="flex items-center gap-4 mt-1">
              <span>Role: {user.userRole.name}</span>
              {user.metadata.department && (
                <span>Department: {user.metadata.department}</span>
              )}
              {user.metadata.title && (
                <span>Title: {user.metadata.title}</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last login: {user.metadata.lastLogin 
            ? new Date(user.metadata.lastLogin).toLocaleDateString()
            : 'Never'}
        </div>
      </div>
    </Card>
  );
}