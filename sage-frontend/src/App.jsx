import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import SageLogo from "./assets/SAGE-LOGO.png";
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import DesignOptionsModal from './components/DesignOptionsModal';
import UserStoriesManager from './components/UserStoriesManager';
import UserStoriesDrawer from './components/UserStoriesDrawer';
import WelcomeScreen from './components/WelcomeScreen';
import TabbedResults from './components/TabbedResults';
import { agents } from './constants';
import { getConfidenceColor, truncateText, parseUserStoriesFromMessages } from './utils/chatUtils';
import useChatPhases from './hooks/useChatPhases';

const initialMessage = {
  id: 1,
  sender: "system",
  text: "Welcome to SAGE, your Strategic Analysis & Guidance Engine. Describe your strategic initiative or project requirements to begin the comprehensive planning process.",
  type: "welcome"
};

function parseDesignOptions(prompt) {
  if (!prompt) return [];
  const options = prompt.split(/\n\s*\n|\n(?=\d+\.|- )/).filter(Boolean);
  return options.slice(0, 3).map((text, idx) => ({
    text: text.split('\n')[0].replace(/^\d+\.|^- /, '').trim() || `Option ${idx + 1}`,
    confidence: 90 - idx * 5,
    description: text.trim(),
    previewClass: idx === 0 ? 'bg-gradient-to-br from-slate-50 to-slate-100' : idx === 1 ? 'bg-gradient-to-br from-purple-50 to-purple-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'
  }));
}

// Helper function to check if 24 hours have passed
function shouldShowWelcomeScreen() {
  const lastShown = localStorage.getItem('sage-welcome-last-shown');
  if (!lastShown) return true;
  
  const lastShownTime = new Date(lastShown).getTime();
  const currentTime = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (currentTime - lastShownTime) >= twentyFourHours;
}

// Helper function to mark welcome screen as shown
function markWelcomeScreenAsShown() {
  localStorage.setItem('sage-welcome-last-shown', new Date().toISOString());
}

export default function App() {
  const chat = useChatPhases(initialMessage);
  const [userStoriesDrawerOpen, setUserStoriesDrawerOpen] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(shouldShowWelcomeScreen());
  const [showTabs, setShowTabs] = React.useState(false);
  const [phaseResults, setPhaseResults] = React.useState([]);
  const [processingPhases, setProcessingPhases] = React.useState([]);

  async function makeAllAPICalls(initialPrompt) {
    setProcessingPhases([0, 1, 2, 3, 4]); // Mark all phases as processing
    const results = [];
    
    try {
      // Phase 1: Strategic Planning
      const response1 = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: initialPrompt, phase: 1 })
      });
      const data1 = await response1.json();
      results[0] = data1.prompt || 'No response received';
      setPhaseResults(prev => {
        const newResults = [...prev];
        newResults[0] = results[0];
        return newResults;
      });
      setProcessingPhases(prev => prev.filter(p => p !== 0));

      // Phase 2: Business Requirements (using Phase 1 results)
      const response2 = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: `Based on the strategic analysis: ${results[0]}\n\nGenerate detailed business requirements and specifications.`,
          phase: 2 
        })
      });
      const data2 = await response2.json();
      results[1] = data2.prompt || 'No response received';
      setPhaseResults(prev => {
        const newResults = [...prev];
        newResults[1] = results[1];
        return newResults;
      });
      setProcessingPhases(prev => prev.filter(p => p !== 1));

      // Phase 3: Design & UX (using Phase 2 results)
      const response3 = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: `Based on the business requirements: ${results[1]}\n\nGenerate 3 design and UX approaches.`,
          phase: 3 
        })
      });
      const data3 = await response3.json();
      results[2] = data3.prompt || 'No response received';
      setPhaseResults(prev => {
        const newResults = [...prev];
        newResults[2] = results[2];
        return newResults;
      });
      setProcessingPhases(prev => prev.filter(p => p !== 2));

      // Phase 4: Feature Architecture (using Phase 3 results)
      const response4 = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: `Based on the design approach: ${results[2]}\n\nGenerate feature architecture and functionality planning.`,
          phase: 4 
        })
      });
      const data4 = await response4.json();
      results[3] = data4.prompt || 'No response received';
      setPhaseResults(prev => {
        const newResults = [...prev];
        newResults[3] = results[3];
        return newResults;
      });
      setProcessingPhases(prev => prev.filter(p => p !== 3));

      // Phase 5: User Stories (using Phase 4 results)
      const response5 = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: `Based on the feature architecture: ${results[3]}\n\nGenerate user stories and acceptance criteria.`,
          phase: 5 
        })
      });
      const data5 = await response5.json();
      results[4] = data5.prompt || 'No response received';
      setPhaseResults(prev => {
        const newResults = [...prev];
        newResults[4] = results[4];
        return newResults;
      });
      setProcessingPhases(prev => prev.filter(p => p !== 4));

      // Add all results to chat messages
      results.forEach((result, index) => {
        const assistantMessage = {
          id: Date.now() + index + 1,
          text: result,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString()
        };
        chat.setMessages(prev => [...prev, assistantMessage]);
      });

    } catch (error) {
      console.error('Error making API calls:', error);
      setProcessingPhases([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!chat.input.trim() || chat.isProcessing) return;
    
    const userMessage = {
      id: Date.now(),
      text: chat.input,
      sender: 'user',
      type: 'user-input',
      timestamp: new Date().toLocaleTimeString()
    };
    
    chat.setMessages(prev => [...prev, userMessage]);
    chat.setInput("");
    chat.setIsProcessing(true);
    
    // If this is the first prompt, switch to tabs view and make all API calls
    if (chat.messages.filter(m => m.sender === 'user' && m.type === 'user-input').length === 0) {
      setShowTabs(true);
      await makeAllAPICalls(chat.input);
    } else {
      // For subsequent prompts, just make a single call for the current phase
      try {
        const response = await fetch('http://localhost:8000/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: chat.input, phase: chat.currentAgentIndex + 1 })
        });
        const data = await response.json();
        
        const assistantMessage = {
          id: Date.now() + 1,
          text: data.prompt || 'No response received',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString()
        };
        
        chat.setMessages(prev => [...prev, assistantMessage]);
        chat.setCurrentPrompt(prev => prev + '\n\nUser: ' + chat.input + '\nAssistant: ' + (data.prompt || ''));
        
        // Update the result for the current phase
        setPhaseResults(prev => {
          const newResults = [...prev];
          newResults[chat.currentAgentIndex] = data.prompt || 'No response received';
          return newResults;
        });
        
      } catch {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, there was an error processing your request.',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString()
        };
        chat.setMessages(prev => [...prev, errorMessage]);
      }
    }
    
    chat.setIsProcessing(false);
  }

  const handleStartAnalysis = () => {
    setShowWelcome(false);
    markWelcomeScreenAsShown();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col"
    >
      <Header
        currentAgentIndex={chat.currentAgentIndex}
        agents={agents}
        isWorkflowComplete={chat.currentAgentIndex >= agents.length}
        SageLogo={SageLogo}
        onUserStoriesClick={() => setUserStoriesDrawerOpen(true)}
        userStoriesCount={chat.currentAgentIndex >= 4 ? 3 : 0}
      />
      
      <AnimatePresence mode="wait">
        {showWelcome && chat.currentAgentIndex === 0 && chat.messages.filter(m => m.sender === 'user' && m.type === 'user-input').length === 0 ? (
          <WelcomeScreen key="welcome" onStart={handleStartAnalysis} />
        ) : showTabs ? (
          <TabbedResults
            key="tabs"
            phaseResults={phaseResults}
            currentAgentIndex={chat.currentAgentIndex}
            isProcessing={chat.isProcessing}
            processingPhases={processingPhases}
            expandedCard={chat.expandedCard}
            expandedDescriptions={chat.expandedDescriptions}
            toggleCardExpansion={chat.setExpandedCard}
            toggleDescriptionExpansion={chat.setExpandedDescriptions}
            motion={motion}
            Separator={Separator}
            Card={Card}
            CardContent={CardContent}
            Badge={Badge}
            Button={Button}
          />
        ) : (
          <main key="chat" className="flex-1 flex flex-col items-center w-full">
            <ScrollArea className="w-full max-w-5xl flex-1 px-6 py-8 mx-auto">
              <ChatArea
                messages={chat.messages}
                currentAgentIndex={chat.currentAgentIndex}
                isProcessing={chat.isProcessing}
                getConfidenceColor={getConfidenceColor}
                expandedCard={chat.expandedCard}
                expandedDescriptions={chat.expandedDescriptions}
                toggleCardExpansion={chat.setExpandedCard}
                toggleDescriptionExpansion={chat.setExpandedDescriptions}
                truncateText={truncateText}
                motion={motion}
                Badge={Badge}
                Card={Card}
                CardContent={CardContent}
                messagesEndRef={chat.messagesEndRef}
              />
            </ScrollArea>
          </main>
        )}
      </AnimatePresence>
      
      {!showWelcome && (
        <InputBar
          input={chat.input}
          setInput={chat.setInput}
          isProcessing={chat.isProcessing}
          currentAgentIndex={chat.currentAgentIndex}
          modalOpen={false}
          isWorkflowComplete={chat.currentAgentIndex >= agents.length}
          agents={agents}
          messages={chat.messages}
          handleSubmit={handleSubmit}
        />
      )}
      
      <UserStoriesDrawer
        isOpen={userStoriesDrawerOpen}
        onClose={() => setUserStoriesDrawerOpen(false)}
      >
        <UserStoriesManager
          initialStories={parseUserStoriesFromMessages(chat.messages)}
          contextMessages={chat.messages}
          onStoryApproved={() => {
          }}
        />
      </UserStoriesDrawer>
    </motion.div>
  );
} 