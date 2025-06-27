import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

// Default fallback stories
const defaultStories = [
  {
    summary: 'User Authentication',
    description: 'As a user, I want to securely log in to the application so that I can access my personalized content and features.'
  },
  {
    summary: 'Dashboard Overview',
    description: 'As a user, I want to see a comprehensive dashboard with key metrics and insights so that I can quickly understand the current state of my project.'
  },
  {
    summary: 'Data Export',
    description: 'As a user, I want to export my data in various formats so that I can share it with stakeholders or use it in other tools.'
  }
];

export default function UserStoriesManager({ initialStories = [], onStoryApproved }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate generation with fallback stories
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const storiesToUse = initialStories.length > 0 ? initialStories : defaultStories;
      setStories(storiesToUse.map(s => ({ ...s, approved: false, editing: false })));
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [initialStories]);

  const handleEdit = idx => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, editing: true } : s));
  };

  const handleChange = (idx, field, value) => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSave = idx => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, editing: false } : s));
  };

  const handleApprove = async idx => {
    setLoading(true);
    setError(null);
    const story = stories[idx];
    try {
      const res = await fetch('http://localhost:8000/api/jira/create-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: story.summary, description: story.description })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStories(stories => stories.map((s, i) => i === idx ? { ...s, approved: true } : s));
      if (onStoryApproved) onStoryApproved(story, data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 rounded-xl shadow-lg p-6 max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-4 text-slate-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Generating user stories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 max-w-3xl mx-auto mt-8">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul className="space-y-4">
        {stories.map((story, idx) => (
          <li key={idx} className={`p-4 rounded-lg border ${story.approved ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'}`}>
            {story.editing ? (
              <>
                <input
                  className="w-full border rounded px-2 py-1 mb-2"
                  value={story.summary}
                  onChange={e => handleChange(idx, 'summary', e.target.value)}
                  disabled={loading}
                />
                <textarea
                  className="w-full border rounded px-2 py-1 mb-2"
                  value={story.description}
                  onChange={e => handleChange(idx, 'description', e.target.value)}
                  disabled={loading}
                />
                <Button onClick={() => handleSave(idx)} disabled={loading} className="mr-2">Save</Button>
              </>
            ) : (
              <>
                <div className="font-semibold text-slate-700 mb-1">{story.summary}</div>
                <div className="text-slate-600 mb-2 whitespace-pre-line">{story.description}</div>
                {!story.approved && (
                  <>
                    <Button onClick={() => handleEdit(idx)} disabled={loading} className="mr-2">Edit</Button>
                    <Button onClick={() => handleApprove(idx)} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">Approve & Send to Jira</Button>
                  </>
                )}
                {story.approved && <span className="text-green-600 font-medium">Approved & Sent to Jira</span>}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 