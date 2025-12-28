import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab: controlledActiveTab, onTabChange }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  
  // Use controlled or internal state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActiveTab(index);
    }
  };

  return (
    <div>
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(index)}
              className={`${
                activeTab === index
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};
