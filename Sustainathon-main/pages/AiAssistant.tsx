import React, { useState, useEffect, useRef } from 'react';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { MessageSquare, Send, Sparkles, User, Brain, Loader2, Info } from 'lucide-react';
import { UserStats } from '../types';
import axios from 'axios';

const Formatter: React.FC<{ text: string }> = ({ text }) => {
  // Simple custom formatter for bold text and lists without external dependencies
  const lines = text.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        let content = line.trim();
        if (!content) return <div key={i} className="h-2" />;

        // Handle Bullet Points
        const isBullet = content.startsWith('1. ') || content.startsWith('2. ') || content.startsWith('3. ') || content.startsWith('4. ') || content.startsWith('5. ') || content.startsWith('- ');
        
        // Basic Bold Replacement
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const renderedLine = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-neo-black font-black uppercase text-sm block md:inline mt-1">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        return (
          <div key={i} className={`${isBullet ? 'pl-4 relative' : ''}`}>
             {isBullet && <span className="absolute left-0 text-neo-blue">•</span>}
             {renderedLine}
          </div>
        );
      })}
    </div>
  );
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantProps {
  userStats: UserStats;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ userStats }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Gaia, your personal Sustainability AI. I can help you with scientific sustainability metrics, eco-tips, or analyzing your personal impact. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        messages: [...messages, userMessage],
        userStats
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
       setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my neural network. Please check if the backend is running!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-6 animate-fade-in text-neo-black">
      <div className="flex justify-between items-center bg-neo-black text-white p-6 rounded-2xl shadow-neo border-4 border-black">
        <div className="flex items-center gap-4">
           <div className="bg-neo-blue p-3 border-2 border-neo-black rounded-xl text-neo-black">
              <Brain size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">Gaia Intelligence</h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                 <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse" /> Groq Llama 3 - Ultra Fast Proxy
              </div>
           </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="text-right">
              <div className="text-[10px] font-black uppercase text-gray-400">Context Level</div>
              <div className="text-sm font-bold">Lvl {userStats.level} Professional</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white border-4 border-black rounded-3xl shadow-neo flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl border-4 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm ${msg.role === 'user' ? 'bg-neo-pink' : 'bg-neo-blue'}`}>
                  {msg.role === 'user' ? <User size={20} className="text-neo-black" /> : <Sparkles size={20} className="text-neo-black" />}
                </div>
                <div className={`p-4 rounded-2xl border-4 border-black shadow-neo-sm prose-neo ${msg.role === 'user' ? 'bg-neo-pink/10 font-bold' : 'bg-neo-blue/5'}`}>
                   {msg.role === 'assistant' ? (
                     <Formatter text={msg.content} />
                   ) : msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
               <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl border-4 border-black bg-neo-blue flex items-center justify-center">
                     <Loader2 className="animate-spin" size={20} />
                  </div>
                  <div className="text-xs font-black uppercase text-gray-400 italic"> Gaia is thinking...</div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t-4 border-black bg-gray-50">
          <div className="flex gap-4">
            <input 
              className="flex-1 border-4 border-black rounded-xl p-4 font-bold focus:outline-none focus:ring-4 ring-neo-blue text-lg"
              placeholder="Ask Gaia anything about sustainability..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <NeoButton 
              size="lg" 
              className="!p-4 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              onClick={handleSend}
              disabled={loading}
            >
              <Send size={28} />
            </NeoButton>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
             <Info size={12} /> AI responses are generated based on global environmental data.
          </div>
        </div>
      </div>
    </div>
  );
};