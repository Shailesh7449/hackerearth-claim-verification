import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, X, ShieldCheck, Camera, Image as ImageIcon } from 'lucide-react';
import CameraModal from '../components/CameraModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Verification() {
  const [claimText, setClaimText] = useState('');
  const [objectType, setObjectType] = useState('car');
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window === "undefined" ? "" : navigator.userAgent;
      return /iPhone|iPad|iPod|Android/i.test(userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImages(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResult({ status: 'supported', confidence: 94 });
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Claim Verification Interface</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload multi-modal evidence for AI analysis.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div className="glass-card p-6 space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Claim Description</label>
            <textarea 
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-border rounded-xl p-4 text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              placeholder="e.g. My car was rear-ended while parked, denting the rear bumper..."
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Object Type</label>
            <select 
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
              value={objectType}
              onChange={(e) => setObjectType(e.target.value)}
            >
              <option value="car">Car / Vehicle</option>
              <option value="laptop">Laptop / Electronics</option>
              <option value="package">Package / Delivery</option>
            </select>
          </div>
        </motion.div>

        <motion.div className="glass-card p-6 flex flex-col space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Visual Evidence</label>
          
          <div className="grid grid-cols-2 gap-4">
            {isMobile ? (
              <label className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-800/50 border border-border rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors min-h-[120px]">
                <Camera className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-center">Capture Photo</span>
                <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            ) : (
              <button 
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-800/50 border border-border rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors min-h-[120px]"
              >
                <Camera className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-center">Capture Photo</span>
              </button>
            )}

            <label className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-800/50 border border-border rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors min-h-[120px]">
              <ImageIcon className="w-8 h-8 text-indigo-500 mb-2" />
              <span className="text-sm font-medium text-center">Upload Gallery</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
            </label>
          </div>
          
          <div 
            className={`hidden lg:flex flex-1 border-2 border-dashed rounded-xl flex-col items-center justify-center p-6 transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-slate-50 dark:bg-slate-800/30'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
          >
             <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
             <p className="text-sm text-slate-500 text-center">Or drag and drop files here (Desktop)</p>
          </div>
        </motion.div>
      </div>

      {images.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Uploaded Images ({images.length})</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
            <AnimatePresence>
              {images.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-border group snap-start shadow-sm"
                >
                  <img src={URL.createObjectURL(img)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors shadow-md min-h-[32px] min-w-[32px] flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleVerify}
          disabled={isVerifying || images.length === 0 || !claimText}
          className="w-full lg:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all min-h-[56px] text-lg"
        >
          {isVerifying ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Claim...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              <span>Verify Claim with AI</span>
            </>
          )}
        </button>
      </div>

      {verificationResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-green-500/30 bg-green-500/10 dark:bg-green-500/5 flex items-start sm:items-center space-x-4 flex-col sm:flex-row gap-4 sm:gap-0"
        >
          <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-green-600 dark:text-green-400 text-lg">Verification Complete</h3>
            <p className="text-slate-600 dark:text-slate-300">Confidence Score: {verificationResult.confidence}% - View detailed results in the Results View.</p>
          </div>
        </motion.div>
      )}

      <CameraModal 
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(file) => setImages(prev => [...prev, file])}
      />
    </div>
  );
}
