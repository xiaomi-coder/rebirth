import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Video, Activity, LogOut, Plus, Calendar, ChevronRight, Save, Trash2, Eye, X, Dumbbell, Utensils, Clock, Image as ImageIcon, Film, Send, Link2, Shield, ShieldOff, Ban, CheckCircle, Crown } from 'lucide-react';
import { Button, Card } from './UI';
import { User, PlanTemplate, DailyPlan, Task, UserRole } from '../types';
import { MOCK_TEMPLATES, MOCK_USER } from '../constants';

interface AdminPanelProps {
    onLogout: () => void;
    isCreator?: boolean;
    allUsers?: User[];
    onUsersChange?: (users: User[]) => void;
}

export const AdminPanel = ({ onLogout, isCreator = false, allUsers, onUsersChange }: AdminPanelProps) => {
    const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'content'>('users');
    const [users, setUsersLocal] = useState<User[]>(allUsers || [MOCK_USER]);
    const [templates, setTemplates] = useState<PlanTemplate[]>(MOCK_TEMPLATES);
    
    const setUsers = (newUsers: User[] | ((prev: User[]) => User[])) => {
        const resolved = typeof newUsers === 'function' ? newUsers(users) : newUsers;
        setUsersLocal(resolved);
        if (onUsersChange) onUsersChange(resolved);
    };

    // UI States
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [userToAssignPlan, setUserToAssignPlan] = useState<User | null>(null);
    const [assignTemplateId, setAssignTemplateId] = useState('');
    const [roleModalUser, setRoleModalUser] = useState<User | null>(null);
    
    // TEMPLATE EDITOR STATE
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<PlanTemplate | null>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // Form States for New User
    const [newUserForm, setNewUserForm] = useState({ name: '', phone: '', username: '', password: '', templateId: '' });

    // HANDLERS
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        const template = templates.find(t => t.id === newUserForm.templateId);
        if (!template) return;

        const newUser: User = {
            id: `u-${Date.now()}`,
            name: newUserForm.name,
            phone: newUserForm.phone,
            username: newUserForm.username,
            password: newUserForm.password,
            category: template.name,
            plan: JSON.parse(JSON.stringify(template.days)),
            startDate: new Date().toISOString().split('T')[0],
            currentDay: 1,
            streak: 0,
            progress: 0,
            weight: 0,
            height: 0,
            goalWeight: 0,
            age: 0,
            weightHistory: [],
            messages: [],
            role: UserRole.USER,
            isBlocked: false,
        };
        
        setUsers([...users, newUser]);
        setIsCreatingUser(false);
        setNewUserForm({ name: '', phone: '', username: '', password: '', templateId: '' });
    };

    const handleAssignPlanToUser = () => {
        if (!userToAssignPlan || !assignTemplateId) return;
        const template = templates.find(t => t.id === assignTemplateId);
        if (!template) return;
        setUsers(users.map(u =>
            u.id === userToAssignPlan.id
                ? {
                    ...u,
                    category: template.name,
                    plan: JSON.parse(JSON.stringify(template.days)),
                    currentDay: 1,
                }
                : u
        ));
        setUserToAssignPlan(null);
        setAssignTemplateId('');
        if (selectedUser?.id === userToAssignPlan.id) setSelectedUser(null);
    };

    const handleToggleBlock = (userId: string) => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
        ));
    };

    const handleChangeRole = (userId: string, newRole: UserRole) => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));
        setRoleModalUser(null);
    };

    const handleDeleteUser = (userId: string) => {
        if (!confirm("Bu foydalanuvchini o'chirmoqchimisiz?")) return;
        setUsers(users.filter(u => u.id !== userId));
    };

    const initNewTemplate = () => {
        const days: DailyPlan[] = Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            isCompleted: false,
            motivationalMessage: "Harakatda baraka!",
            meals: [],
            exercises: []
        }));
        
        setCurrentTemplate({
            id: `tpl-${Date.now()}`,
            name: '',
            description: '',
            days: days
        });
        setIsEditingTemplate(true);
        setSelectedDayIndex(0);
    };

    const handleSaveTemplate = () => {
        if (!currentTemplate || !currentTemplate.name) return;
        
        const exists = templates.find(t => t.id === currentTemplate.id);
        if (exists) {
            setTemplates(templates.map(t => t.id === currentTemplate.id ? currentTemplate : t));
        } else {
            setTemplates([...templates, currentTemplate]);
        }
        setIsEditingTemplate(false);
        setCurrentTemplate(null);
    };

    const updateDayTask = (dayIndex: number, type: 'meal' | 'exercise', action: 'add' | 'remove', task?: Task, taskId?: string) => {
        if (!currentTemplate) return;
        
        const updatedDays = [...currentTemplate.days];
        const day = updatedDays[dayIndex];
        
        if (type === 'meal') {
            if (action === 'add' && task) day.meals.push(task);
            if (action === 'remove' && taskId) day.meals = day.meals.filter(m => m.id !== taskId);
        } else {
            if (action === 'add' && task) day.exercises.push(task);
            if (action === 'remove' && taskId) day.exercises = day.exercises.filter(e => e.id !== taskId);
        }
        
        setCurrentTemplate({ ...currentTemplate, days: updatedDays });
    };

    const updateDayVideo = (dayIndex: number, url: string) => {
        if (!currentTemplate) return;
        const updatedDays = [...currentTemplate.days];
        updatedDays[dayIndex].videoUrl = url;
        setCurrentTemplate({ ...currentTemplate, days: updatedDays });
    };

    const getRoleBadge = (user: User) => {
        if (user.role === UserRole.ADMIN) {
            return <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><Shield size={10} /> ADMIN</span>;
        }
        return <span className="bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full text-[10px] font-bold">USER</span>;
    };

    const getStatusBadge = (user: User) => {
        if (user.isBlocked) {
            return <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><Ban size={10} /> Bloklangan</span>;
        }
        return <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle size={10} /> Faol</span>;
    };

    return (
        <div className="min-h-screen bg-[#121212] flex font-sans">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 bg-[#1E1E1E] border-r border-gray-800 flex flex-col p-4 fixed md:relative z-20 h-full">
                <div className="mb-8 hidden md:block">
                    <div className="font-heading font-bold text-2xl text-primary">
                        {isCreator ? 'CREATOR' : 'ADMIN'}
                    </div>
                    {isCreator && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500">
                            <Crown size={12} /> Super Admin
                        </div>
                    )}
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<Users />} label="Foydalanuvchilar" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarItem icon={<Video />} label="Kontent & Rejalar" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                    <SidebarItem icon={<Activity />} label="Statistika" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 text-gray-400 hover:text-red-500 p-3 rounded-xl transition-colors mt-auto">
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">Chiqish</span>
                </button>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto ml-20 md:ml-0 bg-black">
                
                {/* --- USERS TAB --- */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <h2 className="text-3xl font-bold text-white">Foydalanuvchilar</h2>
                            <Button onClick={() => setIsCreatingUser(true)} className="flex items-center gap-2">
                                <Plus size={18} /> Yangi User
                            </Button>
                        </div>

                        {isCreator && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-left">
                                <p className="text-sm text-yellow-300 flex items-center gap-2">
                                    <Crown size={16} className="text-yellow-500 shrink-0" />
                                    <span>
                                        <strong>Creator rejimi:</strong> Siz barcha foydalanuvchilarni boshqarishingiz, <strong>rollarni o'zgartirishingiz</strong> (admin/user), va hisoblarni <strong>bloklashingiz</strong> mumkin.
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-left">
                            <p className="text-sm text-gray-300">
                                <strong className="text-primary">Reja biriktirish:</strong> Yangi user yaratganda shablon tanlang — reja avtomatik birikadi. Mavjud user ga <strong>«Reja biriktirish»</strong> tugmasi orqali boshqa shablon tanlab biriktirishingiz mumkin.
                            </p>
                        </div>

                        {users.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <h3 className="text-xl font-bold">Hali foydalanuvchilar yo'q</h3>
                                <p className="mt-2">Yuqoridagi "Yangi User" tugmasini bosing</p>
                            </div>
                        ) : (
                        <div className="bg-[#1E1E1E] rounded-2xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-left text-gray-300">
                                <thead className="bg-[#2A2A2A] text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="p-4">Foydalanuvchi</th>
                                        <th className="p-4 hidden md:table-cell">Reja (Shablon)</th>
                                        <th className="p-4 hidden md:table-cell">Holat</th>
                                        <th className="p-4">Kun</th>
                                        <th className="p-4">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map(u => (
                                        <tr key={u.id} className={`hover:bg-[#252525] transition-colors ${u.isBlocked ? 'opacity-50' : ''}`}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${u.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white flex items-center gap-2">
                                                            {u.name}
                                                            {getRoleBadge(u)}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            {u.username}
                                                            {getStatusBadge(u)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">{u.category}</span>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${u.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1">{u.progress}%</span>
                                            </td>
                                            <td className="p-4 font-mono text-secondary">{u.currentDay}-kun</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button 
                                                        onClick={() => { setUserToAssignPlan(u); setAssignTemplateId(u.category ? templates.find(t => t.name === u.category)?.id || '' : ''); }}
                                                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                                        title="30 kunlik rejani biriktirish"
                                                    >
                                                        <Link2 size={14} /> Reja
                                                    </button>
                                                    <button 
                                                        onClick={() => setSelectedUser(u)}
                                                        className="px-3 py-1.5 bg-gray-800 hover:bg-white hover:text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                                    >
                                                        <Eye size={14} /> Ko'rish
                                                    </button>
                                                    {isCreator && (
                                                        <>
                                                            <button 
                                                                onClick={() => setRoleModalUser(u)}
                                                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                                                title="Rol o'zgartirish"
                                                            >
                                                                <Shield size={14} /> Rol
                                                            </button>
                                                            <button 
                                                                onClick={() => handleToggleBlock(u.id)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                                                    u.isBlocked 
                                                                        ? 'bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white'
                                                                        : 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white'
                                                                }`}
                                                                title={u.isBlocked ? "Blokdan chiqarish" : "Bloklash"}
                                                            >
                                                                {u.isBlocked ? <><CheckCircle size={14} /> Ochish</> : <><Ban size={14} /> Blok</>}
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="px-3 py-1.5 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                                                title="O'chirish"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}
                    </div>
                )}

                {/* --- CONTENT TAB (TEMPLATES) --- */}
                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white">30 Kunlik Rejalar</h2>
                                <p className="text-gray-400">Shablon yarating va userlarga biriktiring.</p>
                            </div>
                            <Button onClick={initNewTemplate} className="flex items-center gap-2">
                                <Plus size={18} /> Yangi Shablon
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(tpl => (
                                <Card key={tpl.id} className="group cursor-pointer hover:border-primary">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            <Calendar size={24} />
                                        </div>
                                        <div className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">30 Kun</div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{tpl.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tpl.description}</p>
                                    <div className="border-t border-gray-700 pt-4 flex gap-2">
                                        <button 
                                            onClick={() => { setCurrentTemplate(JSON.parse(JSON.stringify(tpl))); setIsEditingTemplate(true); setSelectedDayIndex(0); }}
                                            className="flex-1 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                                        >
                                            Tahrirlash
                                        </button>
                                        <button className="p-2 bg-gray-800 rounded-lg text-red-500 hover:bg-red-500/20"><Trash2 size={18}/></button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* --- ANALYTICS TAB --- */}
                {activeTab === 'analytics' && (
                    <div className="text-center py-20 text-gray-500">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold">Statistika Bo'limi</h3>
                        <p>Tez orada to'liq analitika qo'shiladi</p>
                    </div>
                )}
            </main>

            {/* --- MODAL: ROL O'ZGARTIRISH (Creator only) --- */}
            <AnimatePresence>
                {roleModalUser && isCreator && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E1E] rounded-3xl w-full max-w-md border border-gray-700 p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield className="text-blue-400" /> Rol boshqarish
                                </h3>
                                <button onClick={() => setRoleModalUser(null)}><X className="text-gray-400" /></button>
                            </div>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
                                    {roleModalUser.name.charAt(0)}
                                </div>
                                <h4 className="text-lg font-bold text-white">{roleModalUser.name}</h4>
                                <p className="text-sm text-gray-400">@{roleModalUser.username}</p>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <span className="text-xs text-gray-500">Hozirgi rol:</span>
                                    {getRoleBadge(roleModalUser)}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-xs text-gray-500 uppercase font-bold">Yangi rolni tanlang:</p>
                                
                                <button
                                    onClick={() => handleChangeRole(roleModalUser.id, UserRole.USER)}
                                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                                        roleModalUser.role !== UserRole.ADMIN
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-gray-700 bg-[#2A2A2A] text-gray-300 hover:border-gray-500'
                                    }`}
                                >
                                    <Users size={20} className="text-gray-400" />
                                    <div>
                                        <div className="font-bold">Oddiy foydalanuvchi (User)</div>
                                        <div className="text-xs text-gray-500">Faqat o'z rejasini ko'radi</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleChangeRole(roleModalUser.id, UserRole.ADMIN)}
                                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                                        roleModalUser.role === UserRole.ADMIN
                                            ? 'border-blue-500 bg-blue-500/10 text-white'
                                            : 'border-gray-700 bg-[#2A2A2A] text-gray-300 hover:border-gray-500'
                                    }`}
                                >
                                    <Shield size={20} className="text-blue-400" />
                                    <div>
                                        <div className="font-bold">Admin</div>
                                        <div className="text-xs text-gray-500">Userlarni ko'rishi va rejalarni boshqarishi mumkin</div>
                                    </div>
                                </button>
                            </div>

                            <Button onClick={() => setRoleModalUser(null)} variant="outline" className="w-full">
                                Yopish
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: REJA BIRIKTIRISH (mavjud user) --- */}
            <AnimatePresence>
                {userToAssignPlan && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E1E] rounded-3xl w-full max-w-md border border-gray-700 p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Link2 className="text-primary" /> Reja biriktirish
                                </h3>
                                <button onClick={() => { setUserToAssignPlan(null); setAssignTemplateId(''); }}><X className="text-gray-400" /></button>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">Foydalanuvchi: <strong className="text-white">{userToAssignPlan.name}</strong></p>
                            <div className="space-y-2 mb-6">
                                <label className="text-xs text-gray-500">30 kunlik shablon tanlang</label>
                                <select
                                    value={assignTemplateId}
                                    onChange={e => setAssignTemplateId(e.target.value)}
                                    className="w-full bg-[#2A2A2A] p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">Tanlang...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => { setUserToAssignPlan(null); setAssignTemplateId(''); }} variant="outline" className="flex-1">Bekor qilish</Button>
                                <Button onClick={handleAssignPlanToUser} disabled={!assignTemplateId} className="flex-1">Biriktirish</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: CREATE USER --- */}
            <AnimatePresence>
                {isCreatingUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E1E] rounded-3xl w-full max-w-lg border border-gray-700 p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Yangi Foydalanuvchi</h3>
                                <button onClick={() => setIsCreatingUser(false)}><X className="text-gray-400" /></button>
                            </div>
                            
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Ism Familiya</label>
                                        <input required value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-[#2A2A2A] p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary" placeholder="Azizbek..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Telefon</label>
                                        <input required value={newUserForm.phone} onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})} className="w-full bg-[#2A2A2A] p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary" placeholder="+998..." />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">30 kunlik reja (shablon) — shu reja user ga biriktiriladi</label>
                                    <select required value={newUserForm.templateId} onChange={e => setNewUserForm({...newUserForm, templateId: e.target.value})} className="w-full bg-[#2A2A2A] p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary">
                                        <option value="">Shablon tanlang...</option>
                                        {templates.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 space-y-4">
                                    <p className="text-xs font-bold text-primary uppercase">Kirish Ma'lumotlari</p>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Login (Username)</label>
                                        <input required value={newUserForm.username} onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} className="w-full bg-[#121212] p-3 rounded-xl text-white outline-none border border-gray-700 focus:border-primary" placeholder="user123" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Parol</label>
                                        <input required value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-[#121212] p-3 rounded-xl text-white outline-none border border-gray-700 focus:border-primary" placeholder="password" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Yaratish va Rejani Biriktirish</Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

             {/* --- MODAL: MONITORING (USER DETAIL) --- */}
             <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col md:flex-row overflow-hidden">
                        
                        <div className="w-full md:w-80 bg-[#1E1E1E] border-b md:border-r border-gray-800 p-6 flex flex-col gap-6 overflow-y-auto">
                            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 md:hidden"><X className="text-gray-400" /></button>
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-black mx-auto mb-4 shadow-xl">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                                <p className="text-gray-400">{selectedUser.category}</p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    {getRoleBadge(selectedUser)}
                                    {getStatusBadge(selectedUser)}
                                </div>
                                <Button
                                    onClick={() => { setUserToAssignPlan(selectedUser); setAssignTemplateId(templates.find(t => t.name === selectedUser.category)?.id || ''); }}
                                    variant="outline"
                                    className="w-full mt-3 flex items-center justify-center gap-2"
                                >
                                    <Link2 size={16} /> Reja biriktirish / o'zgartirish
                                </Button>
                                {isCreator && (
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            onClick={() => setRoleModalUser(selectedUser)}
                                            variant="outline"
                                            className="flex-1 flex items-center justify-center gap-2 text-blue-400 border-blue-500/30"
                                        >
                                            <Shield size={16} /> Rol
                                        </Button>
                                        <Button
                                            onClick={() => handleToggleBlock(selectedUser.id)}
                                            variant="outline"
                                            className={`flex-1 flex items-center justify-center gap-2 ${
                                                selectedUser.isBlocked 
                                                    ? 'text-green-400 border-green-500/30' 
                                                    : 'text-red-400 border-red-500/30'
                                            }`}
                                        >
                                            {selectedUser.isBlocked ? <><CheckCircle size={16} /> Ochish</> : <><Ban size={16} /> Blok</>}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4 bg-[#2A2A2A] p-4 rounded-2xl">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Login:</span>
                                    <span className="text-white font-mono">{selectedUser.username}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Joriy Vazn:</span>
                                    <span className="text-white font-bold">{selectedUser.weight} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Maqsad:</span>
                                    <span className="text-primary font-bold">{selectedUser.goalWeight} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Streak:</span>
                                    <span className="text-orange-500 font-bold">{selectedUser.streak} kun</span>
                                </div>
                            </div>
                            
                            <Button variant="outline" onClick={() => setSelectedUser(null)} className="mt-auto hidden md:flex">
                                <ChevronRight className="rotate-180 mr-2" /> Orqaga
                            </Button>
                        </div>

                        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-black">
                             <div className="max-w-5xl mx-auto">
                                 <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                     <Calendar className="text-primary" /> 30 Kunlik Monitoring
                                 </h3>

                                 <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
                                     {selectedUser.plan.map((day) => {
                                         const hasMeals = day.meals.length > 0;
                                         const mealsDone = day.meals.every(m => m.completed);
                                         const exercisesDone = day.exercises.every(e => e.completed);
                                         const isFullyDone = mealsDone && exercisesDone;
                                         const isFuture = day.day > selectedUser.currentDay;
                                         const isCurrent = day.day === selectedUser.currentDay;
                                         
                                         let bgClass = "bg-[#1E1E1E] border-gray-800";
                                         let textClass = "text-gray-500";
                                         
                                         if (isFuture) {
                                             bgClass = "bg-[#121212] border-gray-800 opacity-50";
                                         } else if (isFullyDone) {
                                             bgClass = "bg-green-500/20 border-green-500 text-green-500";
                                             textClass = "text-green-500";
                                         } else if (isCurrent) {
                                             bgClass = "bg-primary/20 border-primary text-primary ring-2 ring-primary/50";
                                             textClass = "text-primary";
                                         } else {
                                             bgClass = "bg-red-500/10 border-red-500/50 text-red-500";
                                             textClass = "text-red-500";
                                         }

                                         return (
                                             <motion.div 
                                                key={day.day}
                                                whileHover={{ scale: 1.05 }}
                                                className={`aspect-square rounded-xl border ${bgClass} flex flex-col items-center justify-center cursor-pointer relative group`}
                                             >
                                                 <span className={`text-lg font-bold ${textClass}`}>{day.day}</span>
                                                 {day.meals.some(m => m.proofImage) && (
                                                     <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" title="Rasm yuklangan"></div>
                                                 )}
                                             </motion.div>
                                         );
                                     })}
                                 </div>

                                 <h3 className="text-xl font-bold text-white mt-10 mb-4">Oxirgi Yuklangan Rasmlar</h3>
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {selectedUser.plan
                                        .flatMap(d => d.meals)
                                        .filter(m => m.proofImage)
                                        .slice(-4)
                                        .map((meal, idx) => (
                                         <div key={idx} className="bg-[#1E1E1E] p-2 rounded-xl border border-gray-800">
                                             <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                                 <img src={meal.proofImage} alt="" className="w-full h-full object-cover" />
                                             </div>
                                             <p className="text-xs text-white font-bold">{meal.title}</p>
                                             <p className="text-[10px] text-gray-500">{meal.proofTimestamp}</p>
                                         </div>
                                     ))}
                                     {selectedUser.plan.flatMap(d => d.meals).filter(m => m.proofImage).length === 0 && (
                                         <p className="text-gray-500 text-sm col-span-4">Hozircha rasmlar yo'q.</p>
                                     )}
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

             {/* --- MODAL: FULL TEMPLATE EDITOR --- */}
             <AnimatePresence>
                {isEditingTemplate && currentTemplate && (
                    <div className="fixed inset-0 bg-[#121212] z-[100] flex flex-col">
                        
                        <div className="bg-[#1E1E1E] border-b border-gray-800 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsEditingTemplate(false)} className="p-2 hover:bg-gray-800 rounded-lg"><X /></button>
                                <input 
                                    className="bg-transparent text-xl font-bold text-white outline-none placeholder-gray-500" 
                                    placeholder="Reja Nomi (masalan: 70-100kg Ozish)"
                                    value={currentTemplate.name}
                                    onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                                />
                            </div>
                            <Button onClick={handleSaveTemplate} className="py-2 px-6">Saqlash</Button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-24 md:w-64 bg-[#1E1E1E] border-r border-gray-800 flex flex-col overflow-y-auto">
                                <div className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Kunlar</div>
                                {currentTemplate.days.map((day, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDayIndex(index)}
                                        className={`w-full text-left p-4 hover:bg-[#252525] transition-colors border-l-4 ${selectedDayIndex === index ? 'border-primary bg-[#252525] text-white font-bold' : 'border-transparent text-gray-400'}`}
                                    >
                                        <span className="hidden md:inline">{day.day}-kun</span>
                                        <span className="md:hidden text-center block w-full">{day.day}</span>
                                        <div className="flex gap-1 mt-1">
                                            {day.meals.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>}
                                            {day.exercises.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-bold text-white">{selectedDayIndex + 1}-kun Rejasi</h2>
                                    </div>

                                    <Card>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Send className="text-blue-500" /> Kunlik Video Xabar (Telegram)</h3>
                                        <div className="flex gap-4">
                                            <input 
                                                className="flex-1 bg-[#121212] p-3 rounded-xl border border-gray-700 text-white outline-none focus:border-blue-500 placeholder-gray-600" 
                                                placeholder="Telegram Link (masalan: https://t.me/kanal_nomi/123)" 
                                                value={currentTemplate.days[selectedDayIndex].videoUrl || ''}
                                                onChange={(e) => updateDayVideo(selectedDayIndex, e.target.value)}
                                            />
                                        </div>
                                    </Card>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-secondary flex items-center gap-2"><Utensils /> Ovqatlanish</h3>
                                            <Button variant="outline" className="py-2 text-xs border-secondary text-secondary hover:bg-secondary hover:text-black" onClick={() => updateDayTask(selectedDayIndex, 'meal', 'add', { id: `m-${Date.now()}`, title: 'Yangi Ovqat', description: '', completed: false, type: 'meal', meta: '0 kkal' })}>
                                                <Plus size={16} className="mr-1" /> Qo'shish
                                            </Button>
                                        </div>
                                        
                                        {currentTemplate.days[selectedDayIndex].meals.map((meal, idx) => (
                                            <Card key={meal.id} className="relative group border-l-4 border-l-secondary">
                                                <button onClick={() => updateDayTask(selectedDayIndex, 'meal', 'remove', undefined, meal.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X /></button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <input 
                                                            className="w-full bg-transparent text-lg font-bold text-white border-b border-gray-700 focus:border-secondary outline-none py-1" 
                                                            placeholder="Ovqat Nomi"
                                                            value={meal.title}
                                                            onChange={(e) => {
                                                                const newMeals = [...currentTemplate.days[selectedDayIndex].meals];
                                                                newMeals[idx].title = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                        <div className="flex gap-2">
                                                            <input 
                                                                className="flex-1 bg-[#121212] px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700" 
                                                                placeholder="Vaqt (08:00)"
                                                                value={meal.time || ''}
                                                                onChange={(e) => {
                                                                    const newMeals = [...currentTemplate.days[selectedDayIndex].meals];
                                                                    newMeals[idx].time = e.target.value;
                                                                    setCurrentTemplate({...currentTemplate});
                                                                }}
                                                            />
                                                            <input 
                                                                className="flex-1 bg-[#121212] px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700" 
                                                                placeholder="Kaloriya (400 kkal)"
                                                                value={meal.meta || ''}
                                                                onChange={(e) => {
                                                                    const newMeals = [...currentTemplate.days[selectedDayIndex].meals];
                                                                    newMeals[idx].meta = e.target.value;
                                                                    setCurrentTemplate({...currentTemplate});
                                                                }}
                                                            />
                                                        </div>
                                                        <textarea 
                                                            className="w-full bg-[#121212] px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700 h-24" 
                                                            placeholder="Tarkibi va retsept..."
                                                            value={meal.description}
                                                            onChange={(e) => {
                                                                const newMeals = [...currentTemplate.days[selectedDayIndex].meals];
                                                                newMeals[idx].description = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="bg-[#121212] rounded-xl h-48 flex items-center justify-center border border-dashed border-gray-700 overflow-hidden relative">
                                                            {meal.imageUrl ? (
                                                                <img src={meal.imageUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="text-center text-gray-500">
                                                                    <ImageIcon className="mx-auto mb-2" />
                                                                    <span className="text-xs">Rasm URL kiritilmagan</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input 
                                                            className="w-full bg-[#121212] px-3 py-2 rounded-lg text-xs text-gray-500 border border-gray-700" 
                                                            placeholder="Rasm Linki (URL)"
                                                            value={meal.imageUrl || ''}
                                                            onChange={(e) => {
                                                                const newMeals = [...currentTemplate.days[selectedDayIndex].meals];
                                                                newMeals[idx].imageUrl = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-800">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Dumbbell /> Mashg'ulotlar</h3>
                                            <Button variant="outline" className="py-2 text-xs border-primary text-primary hover:bg-primary hover:text-white" onClick={() => updateDayTask(selectedDayIndex, 'exercise', 'add', { id: `e-${Date.now()}`, title: 'Yangi Mashq', description: '', completed: false, type: 'exercise', meta: '3 set x 12' })}>
                                                <Plus size={16} className="mr-1" /> Qo'shish
                                            </Button>
                                        </div>

                                        {currentTemplate.days[selectedDayIndex].exercises.map((exercise, idx) => (
                                            <Card key={exercise.id} className="relative group border-l-4 border-l-primary">
                                                <button onClick={() => updateDayTask(selectedDayIndex, 'exercise', 'remove', undefined, exercise.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X /></button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <input 
                                                            className="w-full bg-transparent text-lg font-bold text-white border-b border-gray-700 focus:border-primary outline-none py-1" 
                                                            placeholder="Mashq Nomi"
                                                            value={exercise.title}
                                                            onChange={(e) => {
                                                                const newEx = [...currentTemplate.days[selectedDayIndex].exercises];
                                                                newEx[idx].title = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                        <input 
                                                            className="w-full bg-[#121212] px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700" 
                                                            placeholder="Takrorlash (3 set x 15)"
                                                            value={exercise.meta || ''}
                                                            onChange={(e) => {
                                                                const newEx = [...currentTemplate.days[selectedDayIndex].exercises];
                                                                newEx[idx].meta = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                        <textarea 
                                                            className="w-full bg-[#121212] px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700 h-24" 
                                                            placeholder="To'g'ri bajarish bo'yicha ko'rsatma..."
                                                            value={exercise.description}
                                                            onChange={(e) => {
                                                                const newEx = [...currentTemplate.days[selectedDayIndex].exercises];
                                                                newEx[idx].description = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="bg-[#121212] rounded-xl h-48 flex items-center justify-center border border-dashed border-gray-700 overflow-hidden relative">
                                                            {exercise.videoUrl ? (
                                                                <div className="text-center text-blue-400">
                                                                    <Send className="mx-auto mb-2" />
                                                                    <span className="text-xs">Telegram Post</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center text-gray-500">
                                                                    <Video className="mx-auto mb-2" />
                                                                    <span className="text-xs">Video URL kiritilmagan</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input 
                                                            className="w-full bg-[#121212] px-3 py-2 rounded-lg text-xs text-gray-500 border border-gray-700" 
                                                            placeholder="Telegram Link (https://t.me/kanal/123)"
                                                            value={exercise.videoUrl || ''}
                                                            onChange={(e) => {
                                                                const newEx = [...currentTemplate.days[selectedDayIndex].exercises];
                                                                newEx[idx].videoUrl = e.target.value;
                                                                setCurrentTemplate({...currentTemplate});
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </AnimatePresence>

        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-[#252525] hover:text-white'}`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium hidden md:inline">{label}</span>
    </button>
);
