'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="rounded-lg shadow p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Dark Mode</span>
          <button
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
            onClick={() => setDarkMode((v) => !v)}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Notifications</span>
          <button
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${notifications ? 'bg-primary' : 'bg-gray-300'}`}
            onClick={() => setNotifications((v) => !v)}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${notifications ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 