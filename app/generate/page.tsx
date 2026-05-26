'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Sparkles, Send, Loader2, History, ArrowLeft, Bot, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Generation {
  id: string;
  type: string;
  prompt: string;
  result: string;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function GeneratePage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [genType, setGenType] = useState<'bio' | 'description'>('bio');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<Generation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('ai_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory((data as Generation[]) || []);
  };

  const handleGenerate = async () => {
    if (!name || !title || !company) {
      toast.error('Please fill in name, title, and company');
      return;
    }

    const userMsg: Message = {
      role: 'user',
      content: `Generate a ${genType} for **${name}**, ${title} at ${company}${category ? ` (${category})` : ''}`,
    };
    setMessages((prev) => [...prev, userMsg]);

    setGenerating(true);
    const assistantMsg: Message = { role: 'assistant', content: '', isStreaming: true };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: genType, name, title, company, category }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: fullText };
            }
            return updated;
          });
        }
      }

      // Mark streaming as done
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant') {
          updated[updated.length - 1] = { ...last, isStreaming: false };
        }
        return updated;
      });

      toast.success('Generation complete!');
      loadHistory();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-10 max-w-md text-center">
          <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-surface-400 mb-6">Please sign in to use the AI content generator.</p>
          <a href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all text-sm font-semibold">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-lg glass-card text-surface-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-400" />
                AI Content Generator
              </h1>
              <p className="text-sm text-surface-400">Generate professional bios and descriptions with AI</p>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-surface-300 hover:text-white transition-all text-sm cursor-pointer"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="glass-card rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-white mb-4">Input Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-surface-400 mb-1">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm text-surface-400 mb-1">Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-sm text-surface-400 mb-1">Company *</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="Acme Inc." />
              </div>
              <div>
                <label className="block text-sm text-surface-400 mb-1">Category</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="Technology" />
              </div>
              <div>
                <label className="block text-sm text-surface-400 mb-2">Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setGenType('bio')} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${genType === 'bio' ? 'bg-brand-500 text-white' : 'bg-surface-800/50 text-surface-400 hover:text-white'}`}>Bio</button>
                  <button onClick={() => setGenType('description')} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${genType === 'description' ? 'bg-brand-500 text-white' : 'bg-surface-800/50 text-surface-400 hover:text-white'}`}>Description</button>
                </div>
              </div>
              <button onClick={handleGenerate} disabled={generating} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 transition-all cursor-pointer">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col min-h-[500px]">
            <h2 className="text-lg font-semibold text-white mb-4">Output</h2>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-surface-500">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-surface-600" />
                    <p>Your AI-generated content will appear here.</p>
                    <p className="text-sm mt-1">Fill in the details and click Generate.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-brand-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-500/20 text-brand-100' : 'bg-surface-800/50 text-surface-200'}`}>
                      {msg.content}
                      {msg.isStreaming && <span className="inline-block w-2 h-4 bg-brand-400 ml-1 animate-pulse" />}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-surface-700/50 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-surface-400" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mt-6 glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-brand-400" />
              Generation History
            </h2>
            {history.length === 0 ? (
              <p className="text-surface-500 text-sm">No previous generations.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((gen) => (
                  <div key={gen.id} className="p-4 rounded-xl bg-surface-900/30 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-brand-400 uppercase">{gen.type}</span>
                      <span className="text-xs text-surface-500">{new Date(gen.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-surface-300 line-clamp-3">{gen.result}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
