import { BarChart3, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const stats = [
    { label: 'Total Claims Processed', value: '1,248', icon: BarChart3, color: 'text-blue-500 dark:text-blue-400' },
    { label: 'Pending Verification', value: '34', icon: Clock, color: 'text-amber-500 dark:text-amber-400' },
    { label: 'High Risk Flags', value: '12', icon: AlertTriangle, color: 'text-red-500 dark:text-red-400' },
    { label: 'Approval Rate', value: '86%', icon: CheckCircle2, color: 'text-green-500 dark:text-green-400' },
  ];

  return (
    <div className="h-full flex flex-col space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-foreground">Project Overview</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Real-time processing statistics for the multi-modal damage verification engine.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center space-x-5 group hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-default"
          >
            <div className={`p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 group-hover:scale-110 transition-transform ${stat.color} shadow-inner`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-foreground">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 glass-card p-6 lg:p-8 flex flex-col min-h-[400px]"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-3 text-foreground">
           <span className="w-2 h-6 bg-primary rounded-full"></span>
           <span>Recent Verification Pipeline Activity</span>
        </h2>
        <div className="flex-1 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800/20 flex items-center justify-center relative overflow-hidden shadow-inner">
           <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
              <BarChart3 className="w-96 h-96 text-primary" />
           </div>
           <div className="relative z-10 text-center space-y-3 px-4">
             <div className="inline-block p-4 rounded-full bg-white dark:bg-slate-800/80 mb-2 shadow-md">
                <BarChart3 className="w-8 h-8 text-slate-400" />
             </div>
             <p className="text-slate-700 dark:text-slate-300 font-bold text-xl">Awaiting Analytics Connection</p>
             <p className="text-slate-500 text-base max-w-sm mx-auto">Visualizations will render here when live stream connects.</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
