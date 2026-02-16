import { useState, useRef, useEffect } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Shield, Terminal, Minus, Minimize2 } from "lucide-react";
import { format } from "date-fns";
import { TypeAnimation } from "react-type-animation";

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: history = [], isLoading: isLoadingHistory } = useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen, isMinimized, isSending]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    sendMessage(
      { message: input },
      {
        onSuccess: () => setInput(""),
      }
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg border-2 border-primary/50 bg-black/90 text-primary backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:border-primary ${isOpen && !isMinimized ? 'hidden' : 'flex'}`}
      >
        <Shield className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] flex flex-col bg-black/95 border border-primary/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm tracking-wide font-display">SENTINEL_BOT_V1</h3>
                  <p className="text-[10px] text-primary/80 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    SYSTEM_ONLINE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-primary/20 rounded-lg text-primary/70 hover:text-primary transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-destructive/20 rounded-lg text-primary/70 hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm relative">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {history.length === 0 && (
                <div className="text-center text-muted-foreground mt-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="opacity-50">System initialized.</p>
                  <p className="opacity-50">Awaiting input command...</p>
                </div>
              )}

              {history.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.isBot ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl border ${
                      msg.isBot
                        ? "bg-secondary/80 border-primary/20 text-foreground rounded-tl-none"
                        : "bg-primary/10 border-primary/40 text-primary-foreground rounded-tr-none"
                    }`}
                  >
                    {msg.isBot ? (
                       <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                         {/* Simple rendering for now, could be markdown */}
                         <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                       </div>
                    ) : (
                      <p className="text-primary font-medium">{msg.content}</p>
                    )}
                    <span className="text-[10px] opacity-40 mt-1 block w-full text-right">
                      {msg.timestamp && format(new Date(msg.timestamp), "HH:mm:ss")}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/50 border border-primary/20 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="text-xs text-primary ml-2">PROCESSING_REQUEST...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-secondary/30 border-t border-primary/20">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command or query..."
                  className="w-full bg-black/50 border border-primary/30 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-foreground placeholder:text-muted-foreground"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="absolute right-2 p-1.5 bg-primary text-black rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground mt-2 text-center flex justify-between px-1">
                <span>SECURE CONNECTION ESTABLISHED</span>
                <span>IDS_PROTOCOL_V4.2</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
