export async function createJiraStory(summary, description) {
  const res = await fetch('/api/jira/create-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary, description })
  });
  return await res.json();
} 