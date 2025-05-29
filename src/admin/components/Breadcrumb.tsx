import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  return paths.map((path, index) => {
    const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
    return {
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      path: fullPath,
    };
  });
}

export function Breadcrumb() {
  const location = useLocation();
  const items = getBreadcrumbItems(location.pathname);

  if (items.length <= 1) return null;

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex space-x-2 text-sm text-gray-600">
        <li>
          <Link to="/admin" className="hover:text-blue-600">
            Dashboard
          </Link>
        </li>
        {items.slice(1).map((item, index) => (
          <li key={item.path} className="flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              to={item.path}
              className={`${
                index === items.length - 2
                  ? 'text-gray-900 font-medium'
                  : 'hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}