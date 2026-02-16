import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Play, Check, LogOut, Utensils, Dumbbell, Calendar, User as UserIcon, Settings, Phone, Star, ChevronRight, Camera, X, Clock, Droplets, Info, MessageCircle, Send, Image as ImageIcon, ExternalLink, ChefHat, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, DailyPlan, Task, Recipe, ProgressPhoto } from '../types';
import { Button, Card } from './UI';
import { RecipeManager, RecipeDetailModal } from './RecipeManager';
import { ProgressPhotos } from './ProgressPhotos';
import { WorkoutLibrary } from './WorkoutLibrary';
import { Marketplace } from './Marketplace';
import { MOCK_RECIPES, MOCK_EXERCISES, MOCK_PRODUCTS, MOCK_PROGRESS_PHOTOS } from '../constants';

interface UserAppProps {
  user: User;
  onLogout: () => void;
}

// --- TELEGRAM WIDGET COMPONENT ---
const TelegramPlayer = ({ url }: { url: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !url) return;

        // Extract channel and post ID from URL (e.g., https://t.me/gym_test/4 -> gym_test/4)
        // Supports: t.me/c/123123123/4 (private) or t.me/public/4
        const match = url.match(/t\.me\/(.+)\/(\d+)/);
        
        if (match) {
            const postIdentifier = `${match[1]}/${match[2]}`;
            const script = document.createElement('script');
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.setAttribute('data-telegram-post', postIdentifier);
            script.setAttribute('data-width', '100%');
            script.setAttribute('data-userpic', 'false');
            script.async = true;

            containerRef.current.innerHTML = ''; // Clear previous
            containerRef.current.appendChild(script);
        }
    }, [url]);

    // Fallback button if widget fails or for deep linking
    return (
        <div className="w-full bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-800 relative">
            {/* Widget Container */}
            <div ref={containerRef} className="min-h-[200px] flex items-center justify-center bg-black/50">
                <div className="animate-pulse text-gray-600 text-xs">Video yuklanmoqda...</div>
            </div>
            
            {/* Direct Link Button (Always visible as backup) */}
            <div className="bg-[#222] p-2 flex justify-center border-t border-gray-700">
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 text-xs font-bold hover:underline"
                >
                    <ExternalLink size={12} /> Telegramda ochish
                </a>
            </div>
        </div>
    );
};

const VideoDisplay = ({ url }: { url: string }) => {
    if (!url) return null;

    // Check if it's a Telegram link
    if (url.includes('t.me')) {
        return <TelegramPlayer url={url} />;
    }

    // Fallback to YouTube (Legacy support)
    return (
        <div className="rounded-2xl overflow-hidden relative group aspect-video bg-gray-900 border border-gray-800 shadow-xl">
             <iframe 
                src={url} 
                className="w-full h-full" 
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </div>
    );
};


export const UserApp: React.FC<UserAppProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'recipes' | 'photos' | 'workouts' | 'shop'>('home');
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() => [...MOCK_PROGRESS_PHOTOS]);
  const [currentDay, setCurrentDay] = useState(user.currentDay);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | undefined>(user.plan.find(p => p.day === user.currentDay));
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [showChat, setShowChat] = useState(false);
  
  // Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Chat scroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDailyPlan(user.plan.find(p => p.day === currentDay));
  }, [currentDay, user.plan]);

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showChat]);

  const updateTask = (taskId: string, type: 'meal' | 'exercise', updates: Partial<Task>) => {
    if (!dailyPlan) return;
    const updatedPlan = { ...dailyPlan };
    const list = type === 'meal' ? updatedPlan.meals : updatedPlan.exercises;
    const taskIndex = list.findIndex(t => t.id === taskId);
    
    if (taskIndex > -1) {
      list[taskIndex] = { ...list[taskIndex], ...updates };
      setDailyPlan(updatedPlan);

      // Check for daily completion
      const allMeals = updatedPlan.meals.every(m => m.completed);
      const allExercises = updatedPlan.exercises.every(e => e.completed);
      
      if (allMeals && allExercises && !showConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setShowMotivation(true);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, task: Task) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         const now = new Date();
         const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
         updateTask(task.id, 'meal', {
             completed: true,
             proofImage: reader.result as string,
             proofTimestamp: timeString,
             status: 'pending'
         });
         setSelectedTask(null); // Close modal
      };
      reader.readAsDataURL(file);
    }
  };

  const markExerciseDone = (task: Task) => {
      updateTask(task.id, 'exercise', { completed: true });
      setSelectedTask(null);
  };

  const calculateDailyProgress = () => {
    if (!dailyPlan) return 0;
    const total = dailyPlan.meals.length + dailyPlan.exercises.length;
    const completed = dailyPlan.meals.filter(m => m.completed).length + dailyPlan.exercises.filter(e => e.completed).length;
    return Math.round((completed / total) * 100);
  };

  const progress = calculateDailyProgress();

  return (
    <div className="min-h-screen bg-black pb-24 font-sans">
      
      {activeTab === 'home' && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
          {/* --- Home Header --- */}
          <header className="bg-darker/90 backdrop-blur-md sticky top-0 z-40 p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-dark font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-sm text-gray-400">Xush kelibsiz,</h1>
                <p className="font-bold text-white leading-none">{user.name}</p>
              </div>
            </div>
            <div className="bg-orange-500/20 px-3 py-1 rounded-full flex items-center gap-1 text-orange-500 text-sm font-bold border border-orange-500/30">
               <Flame className="w-4 h-4 fill-orange-500" /> {user.streak} kun
            </div>
          </header>

          {/* --- Date Selector --- */}
          <div className="bg-darker py-4 overflow-x-auto no-scrollbar border-b border-gray-800 sticky top-[72px] z-30">
            <div className="flex px-4 gap-3">
                {user.plan.map((p) => (
                    <button 
                        key={p.day}
                        onClick={() => setCurrentDay(p.day)}
                        className={`flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl transition-all duration-300 ${
                            currentDay === p.day 
                            ? 'bg-gradient-to-b from-primary to-secondary text-dark shadow-lg scale-105' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <span className="text-xs font-medium">{p.day}-kun</span>
                        <div className="mt-1">
                            {p.isCompleted ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-500" />}
                        </div>
                    </button>
                ))}
            </div>
          </div>

          {/* --- Main Content --- */}
          <main className="p-4 space-y-6">
            
            {/* Progress & Motivation */}
            <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1F1F1F] border-gray-700">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-bold text-gray-200">Bugungi Natija</h3>
                    <span className="text-2xl font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                    </motion.div>
                </div>
                <p className="mt-3 text-sm text-gray-400 italic">"{dailyPlan?.motivationalMessage}"</p>
            </Card>

            {/* Daily Intro Video (Telegram) */}
            {dailyPlan?.videoUrl && (
                <div className="mb-4">
                     <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider ml-1">Kunlik Motivatsiya</p>
                     <VideoDisplay url={dailyPlan.videoUrl} />
                </div>
            )}

            {/* Water Tracker */}
            <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500"><Droplets /></div>
                   <div>
                       <h3 className="font-bold text-white">Suv balansi</h3>
                       <p className="text-xs text-gray-400">Maqsad: 2.5 Litr</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setWaterCount(Math.max(0, waterCount - 250))} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">-</button>
                    <span className="font-mono text-blue-400 font-bold w-12 text-center">{(waterCount/1000).toFixed(2)}L</span>
                    <button onClick={() => setWaterCount(waterCount + 250)} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">+</button>
                </div>
            </div>

            {/* Meals Section */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Utensils className="text-secondary" /> Ovqatlanish Rejasi</h3>
                <div className="space-y-3">
                    {dailyPlan?.meals.map(task => (
                        <div key={task.id} onClick={() => setSelectedTask(task)}>
                           <TaskItem task={task} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Exercises Section */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Dumbbell className="text-primary" /> Mashg'ulotlar</h3>
                <div className="space-y-3">
                    {dailyPlan?.exercises.map(task => (
                        <div key={task.id} onClick={() => setSelectedTask(task)}>
                            <TaskItem task={task} isExercise />
                        </div>
                    ))}
                </div>
            </div>
          </main>
        </motion.div>
      )}

      {/* --- Profile Tab Content --- */}
      {activeTab === 'profile' && (
        <motion.div 
          initial={{opacity: 0, x: 20}} 
          animate={{opacity: 1, x: 0}} 
          exit={{opacity: 0}}
          className="p-6 space-y-8 pt-10"
        >
           <h2 className="text-3xl font-heading font-bold text-white">Profil</h2>
           <div className="flex items-center gap-5 bg-[#1E1E1E] p-5 rounded-3xl border border-gray-800 shadow-xl">
             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-bold text-dark shadow-lg shadow-primary/20">
                {user.name.charAt(0)}
             </div>
             <div>
                <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{user.phone}</p>
                <div className="inline-block bg-gray-800 px-2 py-1 rounded text-xs text-primary border border-primary/20">
                   Kategoriya: {user.category} kg
                </div>
             </div>
           </div>

           {/* Weight Chart */}
           <div className="bg-[#1E1E1E] p-5 rounded-3xl border border-gray-800">
               <h3 className="text-lg font-bold text-white mb-4">Vazn Dinamikasi</h3>
               <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={user.weightHistory}>
                          <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#333', borderColor: '#555', borderRadius: '8px', color: '#fff' }} 
                            itemStyle={{ color: '#FFD166' }}
                          />
                          <Area type="monotone" dataKey="weight" stroke="#FF6B35" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                      </AreaChart>
                  </ResponsiveContainer>
               </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <StatBox label="Joriy Vazn" value={`${user.weight} kg`} />
              <StatBox label="Maqsad" value={`${user.goalWeight} kg`} highlight />
           </div>
           
           <div className="space-y-3">
              <h3 className="text-lg font-bold text-white mb-2">Sozlamalar</h3>
              <MenuButton icon={<Settings />} label="Parolni o'zgartirish" />
              <button onClick={onLogout} className="w-full flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg"><LogOut size={20} /></div>
                    <span className="font-medium">Chiqish</span>
                 </div>
              </button>
           </div>
        </motion.div>
      )}

      {/* --- Retseptlar Tab --- */}
      {activeTab === 'recipes' && (
        <>
          <RecipeManager
            recipes={MOCK_RECIPES.map(r => ({ ...r, isFavorite: favoriteRecipeIds.has(r.id) }))}
            onBack={() => setActiveTab('home')}
            onViewRecipe={(r) => setSelectedRecipe(r)}
            onToggleFavorite={(id) => setFavoriteRecipeIds(prev => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id); else next.add(id);
              return next;
            })}
          />
          <AnimatePresence>
            {selectedRecipe && (
              <RecipeDetailModal
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                onAddToShoppingList={() => {}}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* --- Progress Photos Tab --- */}
      {activeTab === 'photos' && (
        <ProgressPhotos
          photos={progressPhotos}
          onBack={() => setActiveTab('home')}
          onAddPhoto={(data) => setProgressPhotos(prev => [...prev, { ...data, id: `ph-${Date.now()}`, userId: user.id }])}
        />
      )}

      {/* --- Mashqlar Tab --- */}
      {activeTab === 'workouts' && (
        <WorkoutLibrary
          exercises={MOCK_EXERCISES}
          onBack={() => setActiveTab('home')}
          onViewExercise={() => {}}
        />
      )}

      {/* --- Do'kon Tab --- */}
      {activeTab === 'shop' && (
        <Marketplace
          products={MOCK_PRODUCTS}
          onBack={() => setActiveTab('home')}
          onPurchase={() => {}}
        />
      )}

      {/* --- Chat Widget --- */}
      <div className="fixed bottom-24 right-4 z-40">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChat(true)}
            className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-2xl flex items-center justify-center text-dark"
          >
              <MessageCircle className="w-7 h-7" />
          </motion.button>
      </div>

      {/* --- Chat Modal --- */}
      <AnimatePresence>
          {showChat && (
              <motion.div 
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 100 }}
                 className="fixed inset-0 z-50 bg-[#121212] flex flex-col"
              >
                  <div className="p-4 bg-[#1E1E1E] border-b border-gray-800 flex items-center gap-4 pt-safe">
                      <button onClick={() => setShowChat(false)} className="p-2 -ml-2"><ChevronRight className="rotate-180" /></button>
                      <div>
                          <h3 className="font-bold text-white">Murabbiy (Admin)</h3>
                          <p className="text-xs text-green-500">Online</p>
                      </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {user.messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                  msg.sender === 'user' 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-[#2A2A2A] text-gray-200 rounded-tl-none'
                              }`}>
                                  {msg.text}
                                  <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>{msg.time}</p>
                              </div>
                          </div>
                      ))}
                      <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-[#1E1E1E] border-t border-gray-800 pb-safe">
                      <div className="flex gap-2">
                          <input type="text" placeholder="Xabar yozing..." className="flex-1 bg-[#2A2A2A] border-none rounded-xl px-4 text-white focus:ring-1 focus:ring-primary outline-none" />
                          <button className="p-3 bg-primary rounded-xl text-white"><Send size={20} /></button>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* --- Task Detail Modal (Bottom Sheet) --- */}
      <AnimatePresence>
          {selectedTask && (
              <>
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTask(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                 />
                 <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] rounded-t-3xl z-[70] max-h-[90vh] overflow-y-auto border-t border-gray-700 pb-safe"
                 >
                    {/* Drag Handle */}
                    <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mt-4 mb-4" />

                    <div className="p-6 pt-2">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${selectedTask.type === 'meal' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                                    {selectedTask.type === 'meal' ? 'Ovqatlanish' : 'Mashg\'ulot'}
                                </span>
                                <h2 className="text-2xl font-bold text-white mt-2">{selectedTask.title}</h2>
                                {selectedTask.type === 'meal' && selectedTask.time && (
                                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                                        <Clock size={16} /> <span>Vaqti: {selectedTask.time}</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="p-2 bg-gray-800 rounded-full text-gray-400"><X size={20} /></button>
                        </div>

                        {/* Content Body */}
                        <div className="space-y-6">
                            
                            {/* IF MEAL: Show description and Photo Upload */}
                            {selectedTask.type === 'meal' && (
                                <>
                                    {/* --- NEW: Recipe Image from Admin --- */}
                                    {selectedTask.imageUrl && (
                                        <div className="rounded-xl overflow-hidden mb-4 border border-gray-700">
                                            <img src={selectedTask.imageUrl} alt={selectedTask.title} className="w-full h-48 object-cover" />
                                            <div className="bg-[#2A2A2A] px-3 py-1 text-xs text-gray-400 border-t border-gray-700 flex items-center gap-2">
                                                <ImageIcon size={12} /> Tavsiya etilgan ko'rinish
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-[#2A2A2A] p-4 rounded-xl border border-gray-700">
                                        <h4 className="font-bold text-gray-200 mb-2 flex items-center gap-2"><Info size={16}/> Tarkibi:</h4>
                                        <p className="text-gray-300 leading-relaxed">{selectedTask.description}</p>
                                        <p className="text-xs text-gray-500 mt-2 font-mono">Kaloriya: {selectedTask.meta}</p>
                                    </div>

                                    {/* User Proof Upload */}
                                    <div className="border-t border-gray-800 pt-4 mt-2">
                                        <h4 className="font-bold text-white mb-3">Sizning natijangiz:</h4>
                                        {selectedTask.completed && selectedTask.proofImage ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-green-500 font-bold flex items-center gap-2"><Check size={18} /> Yuklandi</p>
                                                    {selectedTask.status === 'pending' && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Tekshirilmoqda</span>}
                                                    {selectedTask.status === 'approved' && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Tasdiqlandi</span>}
                                                    {selectedTask.status === 'rejected' && <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">Rad etildi</span>}
                                                </div>
                                                <img src={selectedTask.proofImage} alt="Proof" className="w-full h-48 object-cover rounded-xl border border-green-500/30" />
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-600 text-center relative group hover:border-primary transition-colors">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        capture="environment"
                                                        onChange={(e) => handlePhotoUpload(e, selectedTask)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                    />
                                                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                                                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <p className="text-white font-bold">Rasmga olib yuklash</p>
                                                    <p className="text-xs text-gray-500 mt-1">Tasdiqlash uchun ovqatni rasmga oling</p>
                                                </div>
                                                <Button disabled className="w-full opacity-50 cursor-not-allowed">Rasm yuklangandan so'ng faollashadi</Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* IF EXERCISE: Show Video and Instructions */}
                            {selectedTask.type === 'exercise' && (
                                <>
                                    {selectedTask.videoUrl && (
                                        <div className="mb-4">
                                            {/* Using the new VideoDisplay component for Telegram/YouTube */}
                                            <VideoDisplay url={selectedTask.videoUrl} />
                                        </div>
                                    )}

                                    <div className="bg-[#2A2A2A] p-4 rounded-xl border border-gray-700">
                                        <div className="flex justify-between mb-4">
                                            <div className="bg-gray-800 px-3 py-1 rounded-lg text-sm text-primary font-mono font-bold">{selectedTask.meta}</div>
                                        </div>
                                        
                                        <h4 className="font-bold text-gray-200 mb-2">Ko'rsatmalar:</h4>
                                        {selectedTask.instructions ? (
                                            <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                                                {selectedTask.instructions.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-300">{selectedTask.description}</p>
                                        )}
                                    </div>

                                    {!selectedTask.completed ? (
                                        <Button onClick={() => markExerciseDone(selectedTask)} className="w-full py-4 text-lg">
                                            <Check className="mr-2" /> Mashqni Bajardim
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="w-full border-green-500 text-green-500">
                                            <Check className="mr-2" /> Bajarilgan
                                        </Button>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                 </motion.div>
              </>
          )}
      </AnimatePresence>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t border-gray-800 px-2 py-2 flex justify-around items-center z-50 pb-safe safe-area-bottom shadow-2xl overflow-x-auto no-scrollbar gap-1">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Calendar size={22} />} label="Reja" />
          <NavButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} icon={<ChefHat size={22} />} label="Retseptlar" />
          <NavButton active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} icon={<Camera size={22} />} label="Progress" />
          <NavButton active={activeTab === 'workouts'} onClick={() => setActiveTab('workouts')} icon={<Dumbbell size={22} />} label="Mashqlar" />
          <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag size={22} />} label="Do'kon" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={22} />} label="Profil" />
      </div>

      {/* --- Motivation Popup & Confetti --- */}
      <AnimatePresence>
        {showMotivation && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowMotivation(false)}
            >
                <div className="bg-[#222] border border-secondary/50 p-8 rounded-3xl text-center max-w-sm shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                    <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ajoyib natija!</h2>
                    <p className="text-gray-300 mb-6">Bugungi rejaning barcha qismini bajardingiz.</p>
                    <Button onClick={() => setShowMotivation(false)} className="w-full">Davom etamiz!</Button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
              {[...Array(20)].map((_, i) => (
                  <motion.div
                      key={i}
                      initial={{ y: -20, x: Math.random() * window.innerWidth }}
                      animate={{ y: window.innerHeight + 20, rotate: 360 }}
                      transition={{ duration: 2 + Math.random() * 3, ease: 'linear' }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                          backgroundColor: ['#FF6B35', '#FFD166', '#FFFFFF'][Math.floor(Math.random() * 3)],
                          left: `${Math.random() * 100}%`
                      }}
                  />
              ))}
          </div>
      )}
    </div>
  );
};

// --- Subcomponents ---

const TaskItem: React.FC<{ task: Task; isExercise?: boolean }> = ({ task, isExercise }) => {
    return (
        <motion.div 
            layout
            initial={false}
            animate={{ backgroundColor: task.completed ? '#1E1E1E' : '#2A2A2A', opacity: task.completed ? 0.8 : 1 }}
            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer border hover:border-gray-600 transition-colors relative overflow-hidden ${task.completed ? 'border-transparent' : 'border-gray-700/50'}`}
        >
            {/* Left Indicator */}
            <div className={`w-1 self-stretch rounded-full ${task.completed ? 'bg-green-500' : (isExercise ? 'bg-primary' : 'bg-secondary')}`}></div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={`font-semibold text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                    {task.time && !task.completed && (
                         <span className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-0.5 rounded">{task.time}</span>
                    )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{task.description}</p>
                {task.completed && task.proofImage && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-green-500">
                        {task.status === 'approved' ? <Check size={12}/> : (task.status === 'rejected' ? <X size={12}/> : <Clock size={12} />)}
                        {task.status === 'pending' ? 'Tekshirilmoqda' : (task.status === 'approved' ? 'Tasdiqlandi' : 'Rad etildi')}
                    </div>
                )}
            </div>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${task.completed ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                {task.completed ? <Check className="w-5 h-5" /> : (isExercise ? <Play className="w-4 h-4 ml-1" /> : <Camera className="w-4 h-4" />)}
            </div>
        </motion.div>
    )
}

const NavButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-xl transition-all duration-300 ${active ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
        <div className={`p-1 rounded-full transition-all ${active ? 'bg-primary/10 translate-y-[-2px]' : ''}`}>
            {React.cloneElement(icon, { size: active ? 26 : 24, strokeWidth: active ? 2.5 : 2 })}
        </div>
        <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

const StatBox = ({ label, value, highlight }: any) => (
    <div className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-white'}`}>{value}</p>
    </div>
);

const Badge = ({ icon, label, active }: any) => (
    <div className={`min-w-[100px] bg-[#2A2A2A] p-3 rounded-2xl border ${active ? 'border-secondary/30' : 'border-gray-800 opacity-50'} flex flex-col items-center gap-2`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-secondary/10' : 'bg-gray-800'}`}>
            {icon}
        </div>
        <span className="text-[10px] text-center font-bold text-gray-300 leading-tight">{label}</span>
    </div>
);

const MenuButton = ({ icon, label }: any) => (
    <button className="w-full flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl text-gray-200 hover:bg-[#333] transition-colors border border-transparent hover:border-gray-700">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg text-gray-400">{icon}</div>
            <span className="font-medium">{label}</span>
        </div>
        <ChevronRight size={18} className="text-gray-600" />
    </button>
);