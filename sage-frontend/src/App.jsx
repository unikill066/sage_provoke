import React from 'react';
import { motion } from 'framer-motion';
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
    try {
      const response = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: userMessage.text, phase: chat.currentAgentIndex + 1 })
      });
      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        text: data.prompt || 'No response received',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString()
      };
      chat.setMessages(prev => [...prev, assistantMessage]);
      chat.setCurrentPrompt(prev => prev + '\n\nUser: ' + userMessage.text + '\nAssistant: ' + (data.prompt || ''));
    } catch {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request.',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString()
      };
      chat.setMessages(prev => [...prev, errorMessage]);
    } finally {
      chat.setIsProcessing(false);
    }
  }

  async function goToNextPhase() {
    if (chat.currentAgentIndex < agents.length - 1) {
      const nextPhase = chat.currentAgentIndex + 1;
      chat.setCurrentAgentIndex(nextPhase);
      if (nextPhase === 1) {
        chat.setIsProcessing(true);
        try {
          const response = await fetch('http://localhost:8000/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: 'Generate business requirements based on the strategy context',
              phase: 2
            }),
          });
          const data = await response.json();
          const assistantMessage = {
            id: Date.now(),
            text: data.prompt || 'No business requirements generated',
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString()
          };
          chat.setMessages(prev => [...prev, assistantMessage]);
          chat.setCurrentPrompt(prev => prev + '\n\nAssistant: ' + (data.prompt || ''));
        } catch {
          const errorMessage = {
            id: Date.now(),
            text: 'Failed to generate business requirements.',
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString()
          };
          chat.setMessages(prev => [...prev, errorMessage]);
        } finally {
          chat.setIsProcessing(false);
        }
      }
      else if (nextPhase === 2) {
        chat.setIsProcessing(true);
        try {
          const response = await fetch('http://localhost:8000/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: 'Generate 3 design and UX approaches',
              phase: 3
            }),
          });
          const data = await response.json();
          let designOptions;
          if (Array.isArray(data.prompt)) {
            designOptions = data.prompt;
          } else {
            designOptions = parseDesignOptions(data.prompt);
          }
          if (!designOptions.length || designOptions.length < 3) {
            const mockOptions = [
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
            ];
            chat.setModalOptions(mockOptions.sort((a, b) => b.confidence - a.confidence));
          } else {
            chat.setModalOptions(designOptions.sort((a, b) => b.confidence - a.confidence));
          }
          chat.setModalPrompt("Choose a design approach");
          chat.setModalOpen(true);
        } catch {
          const errorMessage = {
            id: Date.now(),
            text: 'Failed to generate design options.',
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString()
          };
          chat.setMessages(prev => [...prev, errorMessage]);
        } finally {
          chat.setIsProcessing(false);
        }
      }
    }
  }

  async function handleModalSelect(selectedOption, index) {
    const assistantMessage = {
      id: Date.now(),
      text: `Selected Design Option ${index + 1}: ${selectedOption.text}\n\n${selectedOption.description}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString()
    };
    chat.setMessages(prev => [...prev, assistantMessage]);
    chat.setCurrentPrompt(prev => prev + '\n\nAssistant: Selected Design - ' + selectedOption.text);
    
    chat.setModalOpen(false);
    chat.setCurrentAgentIndex(3);
  }

  const handleStartAnalysis = () => {
    setShowWelcome(false);
    markWelcomeScreenAsShown(); // Mark as shown for 24 hours
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
      
      {showWelcome && chat.currentAgentIndex === 0 && chat.messages.filter(m => m.sender === 'user' && m.type === 'user-input').length === 0 ? (
        <WelcomeScreen onStart={handleStartAnalysis} />
      ) : (
        <main className="flex-1 flex flex-col items-center w-full">
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
          <DesignOptionsModal
            modalOpen={chat.modalOpen}
            setModalOpen={chat.setModalOpen}
            modalOptions={chat.modalOptions}
            modalPrompt={chat.modalPrompt}
            expandedCard={chat.expandedCard}
            expandedDescriptions={chat.expandedDescriptions}
            toggleCardExpansion={chat.toggleCardExpansion}
            toggleDescriptionExpansion={chat.setExpandedDescriptions}
            handleModalSelect={handleModalSelect}
            getConfidenceColor={getConfidenceColor}
            truncateText={truncateText}
            motion={motion}
            Separator={Separator}
            Card={Card}
            CardContent={CardContent}
            Badge={Badge}
            Button={Button}
          />
          <InputBar
            input={chat.input}
            setInput={chat.setInput}
            isProcessing={chat.isProcessing}
            currentAgentIndex={chat.currentAgentIndex}
            modalOpen={chat.modalOpen}
            isWorkflowComplete={chat.currentAgentIndex >= agents.length}
            agents={agents}
            messages={chat.messages}
            handleSubmit={handleSubmit}
            goToNextPhase={goToNextPhase}
          />
        </main>
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