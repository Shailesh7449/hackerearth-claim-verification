import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('[Camera] Stream Stopped');
      });
      streamRef.current = null;
      setIsCameraReady(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("Camera modal opened");
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError('');
    }
    return () => stopCamera();
  }, [isOpen, stopCamera]);

  const startCamera = async () => {
    setError('');
    setCapturedImage(null);
    setIsInitializing(true);
    setIsCameraReady(false);
    
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported in this browser.');
      setIsInitializing(false);
      return;
    }

    try {
      console.log("Requesting camera access");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      console.log('camera permission granted');
      console.log("Camera stream received", mediaStream);
      
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        console.log("Video element", videoRef.current);
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = async () => {
          console.log("Video metadata loaded");
          try {
            await videoRef.current?.play();
            console.log("Video playing");
            setIsCameraReady(true);
          } catch (e) {
            console.error("Video play failed", e);
          }
        };
      } else {
        console.error("Video element is missing");
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      console.log('camera permission denied');
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please grant permissions and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device found on this system.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
      } else if (err.name === 'AbortError') {
        setError('Camera access was aborted.');
      } else {
        setError('Could not access camera. Please check permissions.');
      }
      setIsCameraReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          setCapturedImage(null);
          console.log('[Camera] Image Confirmed');
          onClose();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const retakePhoto = async () => {
    console.log('[Camera] Retake Requested');
    setCapturedImage(null);
    await startCamera();
    console.log('[Camera] Retake Successful');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Capture Photo
              {isCameraReady && !capturedImage && (
                <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full ml-2 border border-green-500/20">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
            {isInitializing && (
              <div className="absolute inset-0 z-10 text-white flex flex-col items-center justify-center bg-black/80">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                <p>Initializing Camera...</p>
              </div>
            )}
            
            {error ? (
              <div className="absolute inset-0 z-10 text-red-500 flex flex-col items-center justify-center p-6 text-center bg-black">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>{error}</p>
                <button onClick={startCamera} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Try Again
                </button>
              </div>
            ) : capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Footer Controls */}
          <div className="p-4 flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50">
            {capturedImage ? (
              <>
                <button 
                  onClick={retakePhoto}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake
                </button>
                <button 
                  onClick={confirmPhoto}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Confirm & Add
                </button>
              </>
            ) : (
              <button 
                onClick={takePhoto}
                disabled={!!error || !isCameraReady}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-primary text-white hover:bg-blue-600 disabled:opacity-50 shadow-lg shadow-primary/20 transition-colors"
              >
                <Camera className="w-6 h-6" />
                Capture
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
