interface Tab {
    id: string;
    label: string;
}

interface TabGroupProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
    return (
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                            ${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
