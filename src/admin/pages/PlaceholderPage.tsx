interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: JSX.Element;
  color?: 'blue' | 'green' | 'purple' | 'amber';
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  color = 'blue'
}: PlaceholderPageProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-600 to-indigo-700',
      bg: 'from-blue-100 to-indigo-100',
      text: 'text-blue-600',
    },
    green: {
      gradient: 'from-green-600 to-emerald-700',
      bg: 'from-green-100 to-emerald-100',
      text: 'text-green-600',
    },
    purple: {
      gradient: 'from-purple-600 to-indigo-700',
      bg: 'from-purple-100 to-indigo-100',
      text: 'text-purple-600',
    },
    amber: {
      gradient: 'from-amber-600 to-orange-700',
      bg: 'from-amber-100 to-orange-100',
      text: 'text-amber-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              {title}
            </h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className={`w-20 h-20 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            This feature is currently under development. Check back soon for updates!
          </p>
          <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-${color}-50 ${colors.text} rounded-lg text-sm font-medium`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>In Development</span>
          </div>
        </div>
      </div>
    </div>
  );
}
