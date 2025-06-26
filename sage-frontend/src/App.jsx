import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";

// Define our agents in sequential order
const agents = [
  {
    id: "strategy",
    name: "Strategic Planning",
    description: "Strategic planning and business direction",
    color: "from-blue-600 to-blue-800"
  },
  {
    id: "bizreqs",
    name: "Business Requirements", 
    description: "Business requirements and specifications",
    color: "from-emerald-600 to-emerald-800"
  },
  {
    id: "designux",
    name: "Design & User Experience",
    description: "User experience and interface design",
    color: "from-purple-600 to-purple-800"
  },
  {
    id: "features",
    name: "Feature Architecture",
    description: "Feature planning and functionality",
    color: "from-orange-600 to-orange-800"
  },
  {
    id: "userstories",
    name: "User Story Development",
    description: "User stories and acceptance criteria",
    color: "from-pink-600 to-pink-800"
  }
];

const initialMessage = {
  id: 1,
  sender: "system",
  text: "Welcome to SAGE, your Strategic Analysis & Guidance Engine. Describe your strategic initiative or project requirements to begin the comprehensive planning process.",
  type: "welcome"
};

function App() {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const messagesEndRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAgent, setModalAgent] = useState(null);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalPrompt, setModalPrompt] = useState("");
  const [customModalInput, setCustomModalInput] = useState("");
  const [modalWasClosed, setModalWasClosed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock agent response generator based on current agent and accumulated prompt
  const getAgentResponse = (prompt, agentId) => {
    const agent = agents.find(a => a.id === agentId);
    let options;
    
    switch(agentId) {
      case "strategy":
        options = [
          { text: "Market Penetration Strategy", confidence: 94 },
          { text: "Product Development Strategy", confidence: 87 },
          { text: "Diversification Strategy", confidence: 82 },
          { text: "Cost Leadership Strategy", confidence: 76 }
        ];
        break;
      case "bizreqs":
        options = [
          { text: "High-priority MVP requirements", confidence: 91 },
          { text: "Scalable enterprise requirements", confidence: 88 },
          { text: "Compliance-focused requirements", confidence: 85 },
          { text: "User-centric requirements", confidence: 79 }
        ];
        break;
      case "designux":
        options = [
          { text: "Mobile-first responsive design", confidence: 93 },
          { text: "Accessibility-focused design", confidence: 89 },
          { text: "Minimalist clean interface", confidence: 84 },
          { text: "Feature-rich dashboard design", confidence: 77 }
        ];
        break;
      case "features":
        options = [
          { text: "Core functionality features", confidence: 95 },
          { text: "Advanced analytics features", confidence: 86 },
          { text: "Integration and API features", confidence: 83 },
          { text: "Social and collaboration features", confidence: 78 }
        ];
        break;
      case "userstories":
        options = [
          { text: "End-user focused stories", confidence: 92 },
          { text: "Admin and management stories", confidence: 87 },
          { text: "Integration and technical stories", confidence: 81 },
          { text: "Business process stories", confidence: 75 }
        ];
        break;
      default:
        options = [
          { text: "Option 1", confidence: 80 },
          { text: "Option 2", confidence: 75 },
          { text: "Option 3", confidence: 70 }
        ];
    }
    
    // Sort options by confidence (highest to lowest)
    options.sort((a, b) => b.confidence - a.confidence);
    
    return {
      agentId: agent.id,
      agentName: agent.name,
      agentColor: agent.color,
      options,
      prompt
    };
  };

  // Open modal for agent step
  const openAgentModal = (agent, options, prompt) => {
    setModalAgent(agent);
    setModalOptions(options);
    setModalPrompt(prompt);
    setModalOpen(true);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const newPrompt = currentPrompt ? `${currentPrompt} + ${input}` : input;
    setCurrentPrompt(newPrompt);
    const userMessage = { id: Date.now(), sender: "user", text: input, type: "user-input" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    setTimeout(() => {
      const agent = agents[currentAgentIndex];
      const agentResponse = getAgentResponse(newPrompt, agent.id);
      openAgentModal(agent, agentResponse.options, newPrompt);
      setIsProcessing(false);
    }, 800);
  };

  // Handle modal selection
  const handleModalSelect = (option) => {
    setModalOpen(false);
    const currentAgent = modalAgent;
    // Add user's choice to messages
    const choiceMessage = {
      id: Date.now(),
      sender: "user",
      text: `Selected: ${option.text}`,
      type: "user-choice",
      agentId: currentAgent.id,
      confidence: option.confidence
    };
    setMessages(prev => [...prev, choiceMessage]);
    // Update current prompt with the choice
    const updatedPrompt = currentPrompt ? `${currentPrompt} + ${option.text}` : option.text;
    setCurrentPrompt(updatedPrompt);
    // Move to next agent
    const nextAgentIndex = currentAgentIndex + 1;
    setCurrentAgentIndex(nextAgentIndex);
    // If there are more agents, open next modal
    if (nextAgentIndex < agents.length) {
      setTimeout(() => {
        const nextAgent = agents[nextAgentIndex];
        const nextAgentResponse = getAgentResponse(updatedPrompt, nextAgent.id);
        openAgentModal(nextAgent, nextAgentResponse.options, updatedPrompt);
      }, 500);
    } else {
      // End of workflow
      setTimeout(() => {
        const completionMessage = {
          id: Date.now() + 1,
          sender: "system",
          text: "Strategic planning workflow complete. Your comprehensive project plan has been generated.",
          type: "completion"
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 500);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "bg-emerald-600";
    if (confidence >= 80) return "bg-blue-600";
    if (confidence >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 90) return "High Confidence";
    if (confidence >= 80) return "Good Confidence";
    if (confidence >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  const isWorkflowComplete = currentAgentIndex >= agents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <header className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight tracking-wide">S.A.G.E</h1>
            <p className="text-sm text-slate-300 font-medium">Strategic Analysis & Guidance Engine</p>
          </div>
          <div className="text-slate-300 text-sm">
            <div className="text-xs text-slate-400">
              {!isWorkflowComplete 
                ? `Phase ${currentAgentIndex + 1}/5: ${agents[currentAgentIndex]?.name}`
                : "Planning Complete"
              }
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center w-full">
        <ScrollArea className="w-full max-w-5xl flex-1 px-6 py-8">
          <div className="flex flex-col gap-6">
            {messages.map((msg) => (
              ((msg.sender !== "user") || (msg.sender === "user" && msg.type === "user-input")) && (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
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
                </div>
              )
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-center">
                <Card className="bg-white border border-slate-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm font-medium">
                        {agents[currentAgentIndex]?.name} is analyzing your requirements...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        {/* Modal for agent step */}
        <Dialog open={modalOpen} onOpenChange={open => { setModalOpen(open); if (!open) setModalWasClosed(true); }}>
          <DialogContent className="glass-modal max-w-lg">
            <DialogHeader>
              <DialogTitle>{modalAgent?.name}</DialogTitle>
              <DialogDescription>{modalAgent?.description}</DialogDescription>
            </DialogHeader>
            <div className="text-sm text-slate-600 mb-4">
              Analysis based on: <span className="text-blue-600 font-medium">{modalPrompt}</span>
            </div>
            <div className="space-y-3">
              {modalOptions.map((option, idx) => (
                <Card key={option.text} className="glass-card border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-slate-50 to-white" onClick={() => handleModalSelect(option)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">{idx + 1}</div>
                        <div className="text-sm font-medium text-slate-900">{option.text}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getConfidenceColor(option.confidence)} text-white text-xs`}>
                          {option.confidence}%
                        </Badge>
                        <span className="text-xs text-slate-500">{getConfidenceLabel(option.confidence)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <form onSubmit={e => {
                e.preventDefault();
                if (customModalInput.trim()) {
                  const revisedPrompt = modalPrompt ? modalPrompt + ' + ' + customModalInput : customModalInput;
                  setCurrentPrompt(revisedPrompt);
                  const revisedOptions = getAgentResponse(revisedPrompt, modalAgent.id).options;
                  setModalPrompt(revisedPrompt);
                  setModalOptions(revisedOptions);
                  setCustomModalInput("");
                }
              }} className="flex gap-2 pt-2">
                <Input
                  value={customModalInput}
                  onChange={e => setCustomModalInput(e.target.value)}
                  placeholder="Refine requirements..."
                  className="flex-1"
                />
                <Button type="submit" className="btn-flashy">Revise</Button>
              </form>
            </div>
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </main>
      
      {((!modalOpen && !isProcessing && (messages.length === 1 || isWorkflowComplete)) || modalWasClosed) && (
        <form onSubmit={sendMessage} className="w-full flex justify-center bg-slate-900 border-t border-slate-700">
          <div className="w-full max-w-5xl flex items-center gap-4 px-6 py-6">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isWorkflowComplete 
                ? "Planning complete. Enter additional requirements or start a new analysis..." 
                : `Add requirements for ${agents[currentAgentIndex]?.name}...`
              }
              className="flex-1 bg-white text-slate-900 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              className="btn-flashy px-8 py-2 rounded-lg font-medium"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default App; 