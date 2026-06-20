import { useState } from 'react';
import { Database, FileText, Upload, Play, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DatasetProcessing() {
  const [files, setFiles] = useState({
    claims: null as File | null,
    history: null as File | null,
    evidence: null as File | null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileSelect = (key: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 3000);
  };

  const isReady = files.claims && files.history && files.evidence;

  const FileUploadBox = ({ title, type, fileKey }: { title: string, type: string, fileKey: keyof typeof files }) => (
    <div className="bg-slate-50 dark:bg-slate-800/30 border border-border rounded-2xl p-5 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={`p-4 rounded-xl flex-shrink-0 ${files[fileKey] ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
          <FileText className="w-7 h-7" />
        </div>
        <div className="flex-1 w-full">
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate w-[200px] sm:w-[300px]">{files[fileKey] ? files[fileKey]?.name : `Upload ${type} file`}</p>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <label className="w-full sm:w-auto px-6 py-3 min-h-[48px] bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl cursor-pointer transition-colors text-base font-bold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200">
            <Upload className="w-5 h-5" />
            {files[fileKey] ? 'Replace' : 'Browse'}
            <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect(fileKey)} />
          </label>
        </div>
      </div>
      {files[fileKey] && (
         <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
           <div className="absolute top-[-8px] right-[-8px] w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
             <CheckCircle2 className="w-4 h-4 text-white ml-1 mt-1" />
           </div>
         </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-foreground">Batch Dataset Processing</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Process entire claims datasets to generate output.csv</p>
      </motion.div>

      <motion.div className="glass-card p-6 lg:p-8 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-foreground border-b border-border pb-4">
          <Database className="w-6 h-6 text-primary" />
          Data Sources
        </h2>
        
        <div className="space-y-4">
          <FileUploadBox title="Claims Dataset" type="claims.csv" fileKey="claims" />
          <FileUploadBox title="User History Dataset" type="user_history.csv" fileKey="history" />
          <FileUploadBox title="Evidence Requirements" type="evidence_requirements.csv" fileKey="evidence" />
        </div>
      </motion.div>

      <motion.div className="flex justify-center pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {!isDone ? (
          <button 
            onClick={handleProcess}
            disabled={!isReady || isProcessing}
            className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all text-xl w-full max-w-md justify-center min-h-[64px]"
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-7 h-7" fill="currentColor" />
                <span>Run Batch Pipeline</span>
              </>
            )}
          </button>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md space-y-4">
            <button className="flex items-center justify-center space-x-3 px-10 py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-500/20 transition-all text-xl w-full min-h-[64px]">
              <Download className="w-7 h-7" />
              <span>Download output.csv</span>
            </button>
            <button onClick={() => {setIsDone(false); setIsProcessing(false);}} className="w-full text-center py-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors min-h-[48px]">
              Process another dataset
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
