import React, { useState } from 'react';
import { Hero, About, Gallery, Pricing, ApplicationForm } from './components/Landing';
import { UserApp } from './components/UserApp';
import { AdminPanel } from './components/AdminPanel';
import { Auth } from './components/Auth';
import { Button } from './components/UI';
import { UserRole, User, Application } from './types';
import { MOCK_USER } from './constants';
import { LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app' | 'admin'>('landing');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([
    { ...MOCK_USER, role: UserRole.USER, isBlocked: false }
  ]);
  const [applications, setApplications] = useState<Application[]>([]);

  const handleLogin = (role: UserRole, user?: User) => {
    setUserRole(role);
    if (user) setCurrentUser(user);
    if (role === UserRole.CREATOR || role === UserRole.ADMIN) setCurrentView('admin');
    if (role === UserRole.USER) setCurrentView('app');
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleApplicationSubmit = (formData: { firstName: string; lastName: string; phone: string; telegram: string; city: string; weight: string; height: string; age: string; plan: string; goal: string }) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      ...formData,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };
    setApplications(prev => [newApp, ...prev]);
  };

  return (
    <div className="font-sans antialiased text-white selection:bg-primary selection:text-white">
      <AnimatePresence mode="wait">
        
        {/* LANDING PAGE */}
        {currentView === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center container mx-auto">
              <div className="font-heading font-bold text-2xl tracking-tighter">QAYTA<span className="text-primary">TUG'ILISH</span></div>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('login')} 
                className="px-4 py-2 text-sm border-white/20 text-white hover:bg-white hover:text-dark backdrop-blur-sm"
              >
                <LogIn className="w-4 h-4 mr-2" /> Kabinetga kirish
              </Button>
            </nav>

            <Hero onJoin={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })} />
            <About />
            <Gallery />
            <Pricing />
            <ApplicationForm onApplicationSubmit={handleApplicationSubmit} />
            
            <footer className="bg-black py-8 border-t border-gray-900 text-center">
              <div className="container mx-auto">
                 <p className="font-heading font-bold text-lg mb-2">Qayta Tug'ilish</p>
                 <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Farrux Radjabov. Barcha huquqlar himoyalangan.</p>
                 <p className="text-gray-600 text-xs mt-2">Designed for Transformation.</p>
              </div>
            </footer>
          </motion.div>
        )}

        {/* LOGIN PAGE */}
        {currentView === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <Auth onLogin={handleLogin} onBack={() => setCurrentView('landing')} users={allUsers} />
          </motion.div>
        )}

        {/* USER APP */}
        {currentView === 'app' && currentUser && (
           <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <UserApp user={currentUser} onLogout={handleLogout} />
           </motion.div>
        )}

        {/* ADMIN / CREATOR PANEL */}
        {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminPanel
                onLogout={handleLogout}
                isCreator={userRole === UserRole.CREATOR}
                allUsers={allUsers}
                onUsersChange={setAllUsers}
                applications={applications}
                onApplicationsChange={setApplications}
              />
            </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;
