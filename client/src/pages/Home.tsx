import { DashboardStats } from "@/components/DashboardStats";
import { ChatInterface } from "@/components/ChatInterface";
import { motion } from "framer-motion";
import { Shield, Lock, Bell, Search, Menu, User, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="scanline" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-foreground">SENTINEL<span className="text-primary">ADS</span></h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Intrusion Detection System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-mono text-muted-foreground">
            <a href="#" className="text-primary hover:text-primary transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" /> DASHBOARD
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <Lock className="w-4 h-4" /> SECURITY
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <Bell className="w-4 h-4" /> ALERTS
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-secondary/30 border border-primary/10 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all w-48"
              />
            </div>
            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                SYSTEM OVERVIEW <span className="text-xs font-normal text-muted-foreground border border-primary/20 px-2 py-0.5 rounded bg-primary/5">LIVE</span>
              </h2>
              <p className="text-muted-foreground font-mono text-sm">Last system scan: <span className="text-primary">Today, 09:42 AM</span></p>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 text-primary text-sm font-mono transition-colors">
                 EXPORT REPORT
               </button>
               <button className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 text-sm font-mono transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:shadow-[0_0_25px_rgba(0,255,65,0.5)]">
                 RUN DIAGNOSTIC
               </button>
            </div>
          </div>

          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
             {/* Security Recommendations Mockup */}
             <div className="bg-black/40 border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> SECURITY ALERTS
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 bg-secondary/20 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                         <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Suspicious Login Attempt Blocked</h4>
                        <p className="text-xs text-muted-foreground mt-1">IP 192.168.43.21 attempted brute force on Port 22. Automatically blacklisted.</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             {/* System Health Mockup */}
             <div className="bg-black/40 border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> SYSTEM HEALTH
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span className="text-primary">42%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[42%] shadow-[0_0_10px_rgba(0,255,65,0.5)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Allocation</span>
                      <span className="text-yellow-500">68%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[68%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage I/O</span>
                      <span className="text-blue-500">21%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[21%]" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                  <p className="text-xs font-mono text-primary text-center">
                    ALL SYSTEMS FUNCTIONING WITHIN NORMAL PARAMETERS
                  </p>
                </div>
             </div>
          </div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-6 bg-background/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            SENTINEL_IDS V2.4.1 | SECURE CONNECTION | <span className="text-primary">ENCRYPTED</span>
          </p>
        </div>
      </footer>

      {/* Chat Bot Integration */}
      <ChatInterface />
    </div>
  );
}
