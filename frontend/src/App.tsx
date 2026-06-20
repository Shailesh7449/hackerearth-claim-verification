import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCheck, FileOutput, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Results from './pages/Results';
import DatasetProcessing from './pages/DatasetProcessing';
import ThemeToggle from './components/ThemeToggle';

function NavLink({ to, icon: Icon, children, onClick }: { to: string, icon: any, children: React.ReactNode, onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 lg:p-3 rounded-xl transition-all duration-300 min-h-[48px] ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}
    >
      <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
      <span className="font-medium text-lg lg:text-base">{children}</span>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-lg text-white">AI</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Orchestrate
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="Close Menu">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-3 mt-6 lg:mt-0">
        <NavLink to="/" icon={LayoutDashboard} onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/verify" icon={FileCheck} onClick={onClose}>Verify Claim</NavLink>
        <NavLink to="/results" icon={FileOutput} onClick={onClose}>Results View</NavLink>
        <NavLink to="/dataset" icon={Database} onClick={onClose}>Batch Processing</NavLink>
      </nav>
      <div className="mt-auto pt-6 flex items-center justify-between">
         <ThemeToggle />
         <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
           v2.0
         </div>
      </div>
    </>
  );
}

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-card rounded-none border-t-0 border-x-0 z-40 flex items-center justify-between px-4">
         <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="font-bold text-sm text-white">AI</span>
          </div>
          <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Orchestrate
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open Menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm glass-card rounded-none z-50 flex flex-col p-6 shadow-2xl lg:hidden border-y-0 border-l-0"
            >
              <SidebarContent onClose={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 glass-card m-6 flex-col p-6 space-y-6 z-10">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 px-4 lg:p-8 lg:pt-8 overflow-y-auto relative no-scrollbar w-full">
        {/* Background ambient lighting */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[var(--bg-glow-1)] rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[var(--bg-glow-2)] rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto h-full w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dataset" element={<DatasetProcessing />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
