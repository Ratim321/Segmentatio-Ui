import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ darkMode, onToggle }: DarkModeToggleProps) {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onToggle}
        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 
                 hover:bg-gray-100 dark:hover:bg-gray-700 
                 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}