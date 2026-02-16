import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './UI';
import { UserRole, User } from '../types';

interface AuthProps {
  onLogin: (role: UserRole, user?: User) => void;
  onBack: () => void;
  users: User[];
}

export const Auth = ({ onLogin, onBack, users }: AuthProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Creator (super admin)
    if (username === 'creator' && password === 'xiaomicoder') {
      onLogin(UserRole.CREATOR);
      return;
    }

    // Oddiy foydalanuvchi yoki admin
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (!foundUser) {
      setError("Noto'g'ri login yoki parol");
      return;
    }
    if (foundUser.isBlocked) {
      setError("Sizning hisobingiz bloklangan. Admin bilan bog'laning.");
      return;
    }
    if (foundUser.role === UserRole.ADMIN) {
      onLogin(UserRole.ADMIN, foundUser);
    } else {
      onLogin(UserRole.USER, foundUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90 px-4 relative">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1E1E1E] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h2 className="text-3xl font-heading font-bold text-center mb-2">Kirish</h2>
        <p className="text-gray-400 text-center mb-8">Qayta Tug'ilish platformasiga xush kelibsiz</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Login</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Foydalanuvchi nomi"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Parol</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="******"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full mt-4">Kirish</Button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-white underline">Orqaga qaytish</button>
        </div>
      </motion.div>
    </div>
  );
};
