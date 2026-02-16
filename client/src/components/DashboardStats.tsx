import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Server, 
  Lock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: '00:00', threats: 400, traffic: 2400 },
  { name: '04:00', threats: 300, traffic: 1398 },
  { name: '08:00', threats: 200, traffic: 9800 },
  { name: '12:00', threats: 278, traffic: 3908 },
  { name: '16:00', threats: 189, traffic: 4800 },
  { name: '20:00', threats: 239, traffic: 3800 },
  { name: '23:59', threats: 349, traffic: 4300 },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="System Status" 
        value="SECURE" 
        icon={<ShieldCheck className="h-8 w-8 text-primary" />}
        detail="All systems operational"
        delay={0.1}
      />
      <StatCard 
        title="Active Threats" 
        value="0" 
        icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
        detail="No active intrusions detected"
        delay={0.2}
      />
      <StatCard 
        title="Network Load" 
        value="45%" 
        icon={<Activity className="h-8 w-8 text-blue-500" />}
        detail="12.4 TB processed today"
        delay={0.3}
      />
      
      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-1 md:col-span-2 lg:col-span-3 h-[400px] bg-black/40 border border-primary/20 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" /> Network Traffic Analysis
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid hsl(var(--primary))',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
              />
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#ef4444" 
                fill="transparent" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServerLogCard />
        <ActiveNodesCard />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, detail, delay }: { title: string, value: string, icon: React.ReactNode, detail: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-black/40 border border-primary/20 p-6 rounded-xl hover:border-primary/50 transition-colors backdrop-blur-sm group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground font-medium text-sm mb-1 uppercase tracking-wider">{title}</p>
          <h2 className="text-3xl font-bold text-foreground mb-2 text-glow">{value}</h2>
          <p className="text-xs text-primary/80 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full" />
            {detail}
          </p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ServerLogCard() {
  const logs = [
    { time: "10:42:15", level: "INFO", msg: "Firewall rules updated successfully" },
    { time: "10:41:03", level: "WARN", msg: "High latency detected on Node US-East-4" },
    { time: "10:38:55", level: "INFO", msg: "User admin_01 logged in from 192.168.1.5" },
    { time: "10:35:12", level: "INFO", msg: "Daily backup completed (45.2 GB)" },
    { time: "10:30:00", level: "INFO", msg: "System scan started" },
  ];

  return (
    <div className="bg-black/40 border border-primary/20 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-primary/20 bg-primary/5 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <Server className="w-4 h-4" /> RECENT LOGS
        </h3>
        <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary animate-pulse">LIVE</span>
      </div>
      <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[200px]">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 border-b border-primary/10 pb-2 last:border-0 last:pb-0">
            <span className="text-muted-foreground">{log.time}</span>
            <span className={log.level === "WARN" ? "text-yellow-500" : "text-primary"}>[{log.level}]</span>
            <span className="text-foreground/80">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveNodesCard() {
  const nodes = [
    { region: "North America", status: "Operational", latency: "24ms" },
    { region: "Europe (West)", status: "Operational", latency: "88ms" },
    { region: "Asia Pacific", status: "Operational", latency: "142ms" },
    { region: "South America", status: "Maintenance", latency: "--" },
  ];

  return (
    <div className="bg-black/40 border border-primary/20 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-primary/20 bg-primary/5 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4" /> GLOBAL NODES
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${node.status === 'Operational' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`} />
              <span className="font-medium">{node.region}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">{node.status}</span>
              <span className="text-primary">{node.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
