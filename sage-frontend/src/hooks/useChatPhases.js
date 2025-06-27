import { useState, useRef, useEffect } from 'react';
import { agents } from '../constants';
import { parseUserStoriesFromMessages } from '../utils/chatUtils';

export default function useChatPhases(initialMessage) {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalPrompt, setModalPrompt] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleCardExpansion = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return {
    messages, setMessages, input, setInput, isProcessing, setIsProcessing, currentAgentIndex, setCurrentAgentIndex, currentPrompt, setCurrentPrompt, modalOpen, setModalOpen, modalOptions, setModalOptions, modalPrompt, setModalPrompt, expandedCard, setExpandedCard, expandedDescriptions, setExpandedDescriptions, messagesEndRef, toggleCardExpansion
  };
} 