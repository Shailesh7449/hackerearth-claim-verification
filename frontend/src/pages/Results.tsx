import { useState } from 'react';
import { CheckCircle2, AlertCircle, ShieldAlert, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Results() {
  const [isReasoningOpen, setIsReasoningOpen] = useState(true);

  // Mock data for demonstration
  const result = {
    claim_id: "CLM-2026-9482",
    status: "supported",
    evidence_standard_met: true,
    issue_type: "cracked screen",
    object_part: "display",
    severity: "high",
    risk_flags: "none",
    confidence: 94,
    reasoning: "Visual evidence strongly supports the claim. Two images show clear, high-quality views of a shattered display module. The damage patterns are consistent with blunt force impact described in the claim text. User history shows no prior claims for this object category.",
    images: ["img_front_view", "img_detail_view"]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Verification Results</h1>
          <p className="text-slate-500 dark:text-slate-400">Detailed AI analysis for {result.claim_id}</p>
        </div>
        <div className="flex items-center space-x-2 px-5 py-3 bg-green-500/10 border border-green-500/30 rounded-full text-green-600 dark:text-green-400 font-bold shadow-sm self-start md:self-auto">
          <CheckCircle2 className="w-6 h-6" />
          <span>Claim Supported</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Collapsible Reasoning Section */}
          <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <button 
                onClick={() => setIsReasoningOpen(!isReasoningOpen)}
                className="w-full p-6 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-primary min-h-[64px]"
                aria-expanded={isReasoningOpen}
             >
               <h2 className="text-xl font-semibold text-foreground">AI Reasoning Summary</h2>
               {isReasoningOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
             </button>
             
             <AnimatePresence>
               {isReasoningOpen && (
                 <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                 >
                   <div className="px-6 pb-6 pt-0 border-t border-border mt-2 pt-4">
                     <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                       {result.reasoning}
                     </p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div className="glass-card p-5 border-l-4 border-l-blue-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Issue Type</div>
              <div className="text-xl font-bold text-foreground capitalize">{result.issue_type}</div>
            </motion.div>
            <motion.div className="glass-card p-5 border-l-4 border-l-indigo-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Object Part</div>
              <div className="text-xl font-bold text-foreground capitalize">{result.object_part}</div>
            </motion.div>
            <motion.div className="glass-card p-5 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-transparent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Severity Level</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 uppercase tracking-wide">{result.severity}</div>
            </motion.div>
            <motion.div className="glass-card p-5 border-l-4 border-l-green-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Evidence Standard</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Standard Met
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div className="glass-card p-6 flex flex-col items-center justify-center text-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="text-slate-600 dark:text-slate-400 font-bold mb-6 text-lg">Visual Confidence Score</div>
             <div className="relative w-40 h-40 flex items-center justify-center mb-4 drop-shadow-xl">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-200 dark:text-slate-800" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * result.confidence) / 100} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="text-4xl font-black text-foreground">{result.confidence}%</div>
             </div>
             <p className="text-sm text-slate-500 font-medium">Based on image quality & damage visibility</p>
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
             <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 text-lg">
               <ShieldAlert className="w-6 h-6 text-amber-500" />
               Risk Engine Flags
             </h3>
             {result.risk_flags === 'none' ? (
                <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium leading-relaxed">No suspicious user history detected in records.</span>
                </div>
             ) : (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-3 shadow-inner">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium leading-relaxed">{result.risk_flags}</span>
                </div>
             )}
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
             <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 text-lg">
               <ImageIcon className="w-6 h-6 text-indigo-500" />
               Supporting Evidence
             </h3>
             <div className="grid grid-cols-2 gap-3">
               {result.images.map((_, i) => (
                 <button key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl aspect-square flex items-center justify-center border border-border overflow-hidden relative group hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary w-full">
                   <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-medium text-white backdrop-blur-sm">Expand</div>
                   <ImageIcon className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                 </button>
               ))}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
