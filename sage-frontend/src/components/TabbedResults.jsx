import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { agents } from '../constants';
import { getConfidenceColor, truncateText } from '../utils/chatUtils';

// Default fallback stories
const defaultStories = [
  {
    id: "US-001",
    summary: 'User Authentication',
    description: 'As a user, I want to securely log in to the application so that I can access my personalized content and features.',
    priority: "High",
    acceptance: "Given I am on the login page, When I enter valid credentials, Then I am successfully authenticated and redirected to the dashboard."
  },
  {
    id: "US-002",
    summary: 'Dashboard Overview',
    description: 'As a user, I want to see a comprehensive dashboard with key metrics and insights so that I can quickly understand the current state of my project.',
    priority: "High",
    acceptance: "Given I am logged in, When I access the dashboard, Then I can see key metrics, recent activity, and quick access to important features."
  },
  {
    id: "US-003",
    summary: 'Data Export',
    description: 'As a user, I want to export my data in various formats so that I can share it with stakeholders or use it in other tools.',
    priority: "Medium",
    acceptance: "Given I have data to export, When I select export options, Then I can download the data in my preferred format."
  },
  {
    id: "US-004",
    summary: 'Navigation Enhancement',
    description: 'As a user, I want intuitive navigation that allows me to quickly find what I need without getting lost in the interface.',
    priority: "High",
    acceptance: "Given I am on any page, When I look for navigation elements, Then I can easily identify and use them to move between sections."
  },
  {
    id: "US-005",
    summary: 'Customization Options',
    description: 'As a user, I want to personalize the interface to match my preferences and workflow.',
    priority: "Medium",
    acceptance: "Given I want to customize settings, When I access preferences, Then I can modify various aspects of the interface."
  }
];

export default function TabbedResults({ 
  phaseResults, 
  currentAgentIndex, 
  isProcessing,
  processingPhases,
  expandedCard,
  expandedDescriptions,
  toggleCardExpansion,
  toggleDescriptionExpansion,
  motion,
  Separator,
  Button: ButtonComponent
}) {
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storiesError, setStoriesError] = useState(null);

  // Initialize stories when User Story Development tab is ready
  useEffect(() => {
    if (phaseResults[4] && stories.length === 0) {
      setStoriesLoading(true);
      const timeoutId = setTimeout(() => {
        setStories(defaultStories.map(s => ({ ...s, approved: false, editing: false })));
        setStoriesLoading(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [phaseResults[4], stories.length]);

  const handleEditStory = idx => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, editing: true } : s));
  };

  const handleStoryChange = (idx, field, value) => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSaveStory = idx => {
    setStories(stories => stories.map((s, i) => i === idx ? { ...s, editing: false } : s));
  };

  const handleApproveStory = async idx => {
    setStoriesLoading(true);
    setStoriesError(null);
    const story = stories[idx];
    try {
      const res = await fetch('http://localhost:8000/api/jira/create-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          summary: story.summary, 
          description: story.description 
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStories(stories => stories.map((s, i) => i === idx ? { ...s, approved: true } : s));
    } catch (e) {
      setStoriesError(e.message);
    } finally {
      setStoriesLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex-1 flex flex-col items-center w-full"
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="strategy" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-600">
            {agents.map((agent, index) => (
              <TabsTrigger
                key={agent.id}
                value={agent.id}
                className={`data-[state=active]:bg-gradient-to-r ${agent.color} data-[state=active]:text-white transition-all duration-200`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">{agent.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    phaseResults[index] ? 'bg-green-500' : 
                    processingPhases.includes(index) ? 'bg-blue-500 animate-pulse' : 
                    'bg-slate-500'
                  }`} />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {agents.map((agent, index) => (
            <TabsContent key={agent.id} value={agent.id} className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                      <Badge className={`${
                        phaseResults[index] ? getConfidenceColor(85) : 
                        processingPhases.includes(index) ? 'bg-blue-500' : 
                        'bg-slate-500'
                      } text-white`}>
                        {phaseResults[index] ? 'Complete' : 
                         processingPhases.includes(index) ? 'Processing...' : 
                         'Pending'}
                      </Badge>
                    </div>
                    
                    {phaseResults[index] ? (
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                          <h3 className="text-lg font-semibold text-white mb-2">Analysis Results</h3>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {phaseResults[index]}
                          </p>
                        </div>
                        
                        {index === 2 && (
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Design Options</h3>
                            <Accordion type="single" collapsible className="w-full">
                              {[
                                {
                                  text: "Minimalist & Clean Design",
                                  confidence: 95,
                                  description: "A clean, minimalist approach focusing on simplicity and clarity. Uses plenty of white space, typography hierarchy, and subtle animations. Perfect for professional applications where clarity and ease of use are paramount. Features include: clean typography, minimal color palette, intuitive navigation, and subtle micro-interactions.",
                                  previewClass: "bg-gradient-to-br from-slate-50 to-slate-100"
                                },
                                {
                                  text: "Bold & Modern Interface",
                                  confidence: 88,
                                  description: "A bold, modern design with vibrant colors and dynamic elements. Emphasizes visual impact and user engagement through bold typography, gradient backgrounds, and interactive elements. Ideal for applications targeting younger demographics or creative industries. Features include: vibrant color schemes, bold typography, interactive animations, and card-based layouts.",
                                  previewClass: "bg-gradient-to-br from-purple-50 to-purple-100"
                                },
                                {
                                  text: "Accessibility-First Design",
                                  confidence: 92,
                                  description: "A design approach that prioritizes accessibility and inclusivity from the ground up. Features high contrast ratios, clear navigation, keyboard-friendly interactions, and screen reader compatibility. Perfect for applications that need to serve diverse user populations. Features include: high contrast colors, large touch targets, clear navigation, and comprehensive accessibility features.",
                                  previewClass: "bg-gradient-to-br from-blue-50 to-blue-100"
                                }
                              ].map((option, optionIndex) => (
                                <AccordionItem key={optionIndex} value={`item-${optionIndex}`} className="border-slate-600">
                                  <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-start justify-between w-full">
                                      <h3 className="text-lg font-semibold text-white">{option.text}</h3>
                                      <div className="flex items-center gap-3">
                                        <Badge className={getConfidenceColor(option.confidence)}>
                                          {option.confidence}% confidence
                                        </Badge>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="p-6 bg-slate-800/50 rounded-lg">
                                      <h4 className="font-semibold text-white mb-3">Why {option.confidence}% Confidence?</h4>
                                      <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        {option.description}
                                      </p>
                                      
                                      <div className="mt-4 mb-6">
                                        <h4 className="font-semibold text-white mb-3">Design Preview</h4>
                                        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                                          {optionIndex === 0 && (
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between">
                                                <div className="h-4 bg-slate-200 rounded w-24"></div>
                                                <div className="h-4 bg-slate-200 rounded w-16"></div>
                                              </div>
                                              <div className="flex space-x-4">
                                                <div className="h-3 bg-slate-200 rounded w-12"></div>
                                                <div className="h-3 bg-slate-200 rounded w-16"></div>
                                                <div className="h-3 bg-slate-200 rounded w-14"></div>
                                              </div>
                                              <div className="space-y-2">
                                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                                              </div>
                                              <div className="h-8 bg-slate-300 rounded w-20"></div>
                                            </div>
                                          )}
                                          {optionIndex === 1 && (
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between">
                                                <div className="h-6 bg-purple-200 rounded w-32"></div>
                                                <div className="h-6 bg-purple-200 rounded w-24"></div>
                                              </div>
                                              <div className="flex space-x-4">
                                                <div className="h-8 bg-purple-200 rounded-lg w-20"></div>
                                                <div className="h-8 bg-purple-200 rounded-lg w-24"></div>
                                                <div className="h-8 bg-purple-200 rounded-lg w-20"></div>
                                              </div>
                                              <div className="space-y-3">
                                                <div className="h-7 bg-purple-200 rounded w-full"></div>
                                                <div className="h-5 bg-purple-200 rounded w-full"></div>
                                                <div className="h-5 bg-purple-200 rounded w-5/6"></div>
                                                <div className="h-5 bg-purple-200 rounded w-4/5"></div>
                                              </div>
                                              <div className="h-12 bg-purple-300 rounded-lg w-32"></div>
                                            </div>
                                          )}
                                          {optionIndex === 2 && (
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between">
                                                <div className="h-6 bg-blue-200 rounded w-32"></div>
                                                <div className="h-6 bg-blue-200 rounded w-24"></div>
                                              </div>
                                              <div className="flex space-x-4">
                                                <div className="h-8 bg-blue-200 rounded-lg w-20"></div>
                                                <div className="h-8 bg-blue-200 rounded-lg w-24"></div>
                                                <div className="h-8 bg-blue-200 rounded-lg w-20"></div>
                                              </div>
                                              <div className="space-y-3">
                                                <div className="h-7 bg-blue-200 rounded w-full"></div>
                                                <div className="h-5 bg-blue-200 rounded w-5/6"></div>
                                                <div className="h-5 bg-blue-200 rounded w-4/5"></div>
                                              </div>
                                              <div className="h-12 bg-blue-300 rounded-lg w-32"></div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        )}

                        {index === 4 && (
                          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
                            <h3 className="text-2xl font-bold text-white mb-6">User Stories</h3>
                            {storiesError && (
                              <div className="text-red-400 mb-4 p-3 bg-rose-900/20 rounded-lg border border-rose-500/30">
                                Error: {storiesError}
                              </div>
                            )}

                            {storiesLoading && stories.length === 0 ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-4 text-slate-400">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                                  <span className="text-lg font-medium">Generating user stories...</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {stories.map((story, storyIndex) => (
                                  <Card
                                    key={storyIndex}
                                    className={`border transition-all ${
                                      story.approved
                                        ? 'border-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.15)]'
                                        : 'border-slate-700'
                                    } bg-slate-800/80`}
                                  >
                                    <CardContent className="p-5">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Badge variant="outline" className="text-xs font-mono bg-slate-900/80 border-slate-700 text-slate-400">
                                          {story.id}
                                        </Badge>
                                        <Badge
                                          className={
                                            story.priority === "High"
                                              ? "bg-rose-500/80 text-white"
                                              : story.priority === "Medium"
                                              ? "bg-yellow-400/80 text-slate-900"
                                              : "bg-green-500/80 text-white"
                                          }
                                        >
                                          {story.priority}
                                        </Badge>
                                        {story.approved && (
                                          <Badge className="bg-green-600/80 text-white border border-green-400">
                                            ✓ Sent to Jira
                                          </Badge>
                                        )}
                                      </div>

                                      {story.editing ? (
                                        <div className="space-y-3">
                                          <Input
                                            className="bg-slate-900 border-slate-700 text-white"
                                            value={story.summary}
                                            onChange={e => handleStoryChange(storyIndex, 'summary', e.target.value)}
                                            placeholder="Story title"
                                            disabled={storiesLoading}
                                          />
                                          <textarea
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white resize-none"
                                            rows="3"
                                            value={story.description}
                                            onChange={e => handleStoryChange(storyIndex, 'description', e.target.value)}
                                            placeholder="Story description"
                                            disabled={storiesLoading}
                                          />
                                          <div className="flex gap-2">
                                            <Button 
                                              onClick={() => handleSaveStory(storyIndex)} 
                                              disabled={storiesLoading}
                                              className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                              Save
                                            </Button>
                                            <Button 
                                              onClick={() => handleStoryChange(storyIndex, 'editing', false)} 
                                              disabled={storiesLoading}
                                              variant="outline"
                                              className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <h4 className="text-white font-semibold mb-2">{story.summary}</h4>
                                          <p className="text-slate-300 text-sm mb-3">{story.description}</p>
                                          <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-3 mb-3">
                                            <h5 className="text-slate-200 font-medium text-sm mb-2">Acceptance Criteria:</h5>
                                            <p className="text-slate-400 text-sm">{story.acceptance}</p>
                                          </div>
                                          {!story.approved && (
                                            <div className="flex gap-2">
                                              <Button 
                                                onClick={() => handleEditStory(storyIndex)} 
                                                disabled={storiesLoading}
                                                className="bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600 hover:text-white"
                                              >
                                                Edit
                                              </Button>
                                              <Button 
                                                onClick={() => handleApproveStory(storyIndex)} 
                                                disabled={storiesLoading}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                              >
                                                {storiesLoading ? 'Sending...' : 'Approve & Send to Jira'}
                                              </Button>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : processingPhases.includes(index) ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-4 text-slate-300">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <span className="text-lg font-medium">
                            Processing {agent.name}...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-slate-400 text-lg">
                            {agent.description}
                          </p>
                          <p className="text-slate-500 text-sm mt-2">
                            {index === 0 ? 'Enter your initial prompt to begin analysis.' : 'This phase will be processed automatically.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  );
} 