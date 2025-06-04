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
    <nav className="mb-6" aria-label="Breadcrumb">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 shadow-sm">
        <ol className="flex items-center space-x-3 text-sm">
          <li>
            <Link 
              to="/admin" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
              </svg>
              How2doAI Dashboard
            </Link>
          </li>
          {items.slice(1).map((item, index) => (
            <li key={item.path} className="flex items-center">
              <svg
                className="h-4 w-4 text-gray-400 mx-2"
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
                className={`transition-colors duration-200 ${
                  index === items.length - 2
                    ? 'text-gray-900 font-semibold bg-blue-50 px-3 py-1 rounded-lg border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded-md'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}