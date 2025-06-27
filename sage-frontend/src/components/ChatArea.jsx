import React from 'react';
import { motion } from 'framer-motion';

export default function ChatArea({ messages, currentAgentIndex, isProcessing, getConfidenceColor, expandedCard, expandedDescriptions, toggleCardExpansion, toggleDescriptionExpansion, truncateText, motion, Badge, Card, CardContent, messagesEndRef }) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, idx) => (
        <React.Fragment key={msg.id}>
          {((msg.sender !== "user") || (msg.sender === "user" && msg.type === "user-input")) && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card className={`glass-card max-w-[80%] shadow-lg border-0 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-lg ml-auto"
                  : msg.sender === "system"
                  ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-bl-lg mr-auto"
                  : "bg-white text-slate-900 rounded-bl-lg mr-auto border border-slate-200"
              }`}>
                <CardContent className="p-5">
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                  {msg.confidence && (
                    <div className="mt-2">
                      <Badge className={`${getConfidenceColor(msg.confidence)} text-white text-xs`}>
                        {msg.confidence}% Confidence
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
          {msg.type === 'welcome' && currentAgentIndex === 0 && messages.filter(m => m.sender === 'user' && m.type === 'user-input').length === 0 && (
            <div className="flex flex-row items-center justify-center gap-2 mt-8 mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
              <div className="text-slate-200 text-sm font-medium opacity-90 whitespace-nowrap">
                Ready to analyze your strategic initiative. Enter your first prompt to begin.
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      {isProcessing && (
        <div className="flex justify-center items-center py-8">
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">
                  Analyzing your requirements...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 