export function getConfidenceColor(confidence) {
  if (confidence >= 90) return "bg-emerald-600";
  if (confidence >= 80) return "bg-blue-600";
  if (confidence >= 70) return "bg-amber-600";
  return "bg-red-600";
}

export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function parseUserStoriesFromMessages(messages) {
  const last = [...messages].reverse().find(m => m.sender === 'system' && m.text && m.text.toLowerCase().includes('user story'));
  if (!last) return [];
  return last.text.split(/\n(?=\d+\.|- )/).map(line => {
    const [summary, ...desc] = line.replace(/^\d+\.|^- /, '').split(':');
    return {
      summary: summary.trim(),
      description: desc.join(':').trim() || summary.trim()
    };
  }).filter(s => s.summary);
} 