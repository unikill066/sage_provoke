import React from 'react';

export default function Header({ currentAgentIndex, SageLogo, onUserStoriesClick, userStoriesCount = 0 }) {
  return (
    <header className="w-full sticky top-0 z-30 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-6">
          <img src={SageLogo} alt="SAGE Logo" className="h-8 mt-[15px] w-auto" />
        </div>
        <div className="flex items-center gap-4">
          {currentAgentIndex >= 4 && (
            <button
              onClick={onUserStoriesClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">User Stories</span>
              {userStoriesCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {userStoriesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 