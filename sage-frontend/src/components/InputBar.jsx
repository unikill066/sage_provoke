import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function InputBar({ input, setInput, isProcessing, currentAgentIndex, modalOpen, isWorkflowComplete, agents, messages, handleSubmit }) {
  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex flex-col justify-center bg-slate-900 border-t border-slate-700 sticky bottom-0 z-30 ${
        currentAgentIndex === 2 && modalOpen ? 'hidden' : ''
      }`}
    >
      <div className="w-full max-w-5xl flex items-center gap-4 px-6 py-6 self-center">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isWorkflowComplete
            ? "Planning complete. Enter additional requirements or start a new analysis..."
            : `Iterate on ${agents[currentAgentIndex]?.name} planning...`}
          className="flex-1 bg-white text-slate-900 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            isProcessing || (currentAgentIndex === 0 && !input.trim())
              ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
          }`}
          disabled={isProcessing || (currentAgentIndex === 0 && !input.trim())}
        >
          {isProcessing ? "Processing..." : "Submit"}
        </Button>
      </div>
    </form>
  );
} 