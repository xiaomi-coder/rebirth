import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Trash2, Save, X } from 'lucide-react';
import { Exercise } from '../types';

interface WorkoutEditorProps {
  exercise?: Exercise;
  onSave: (exercise: Omit<Exercise, 'id' | 'createdBy'>) => void;
  onCancel: () => void;
}

export const WorkoutEditor: React.FC<WorkoutEditorProps> = ({ exercise, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    description: exercise?.description || '',
    muscleGroup: exercise?.muscleGroup || 'chest',
    difficulty: exercise?.difficulty || 'beginner',
    equipment: exercise?.equipment?.join(', ') || '',
    videoUrl: exercise?.videoUrl || '',
    imageUrl: exercise?.imageUrl || '',
    sets: exercise?.sets || 3,
    reps: exercise?.reps || '10-12',
    duration: exercise?.duration || 0,
    calories: exercise?.calories || 0,
    tags: exercise?.tags?.join(', ') || ''
  });

  const [instructions, setInstructions] = useState<string[]>(exercise?.instructions || ['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      equipment: formData.equipment.split(',').map(e => e.trim()).filter(Boolean),
      instructions: instructions.filter(i => i.trim()),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    } as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-red-500" />
            {exercise ? 'Mashqni tahrirlash' : 'Yangi mashq'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-700 rounded-xl transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Muskul guruhi *</label>
              <select value={formData.muscleGroup} onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value as any })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                <option value="chest">Ko'krak</option>
                <option value="back">Orqa</option>
                <option value="legs">Oyoqlar</option>
                <option value="shoulders">Yelkalar</option>
                <option value="arms">Qo'llar</option>
                <option value="core">Core</option>
                <option value="cardio">Kardio</option>
                <option value="full-body">Butun tana</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tavsif</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white resize-none h-24" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Qiyinlik</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                <option value="beginner">Boshlang'ich</option>
                <option value="intermediate">O'rtacha</option>
                <option value="advanced">Ilg'or</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sets</label>
              <input type="number" value={formData.sets} onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Reps</label>
              <input type="text" value={formData.reps} onChange={(e) => setFormData({ ...formData, reps: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Kaloriya</label>
              <input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rasm URL</label>
              <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Video URL</label>
              <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Asboblar (vergul bilan)</label>
            <input type="text" value={formData.equipment} onChange={(e) => setFormData({ ...formData, equipment: e.target.value })} placeholder="Dumbbell, Barbell, Bench" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-bold text-white">Bajarish tartibi</label>
              <button type="button" onClick={() => setInstructions([...instructions, ''])} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />Qo'shish
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">{index + 1}</div>
                  <textarea value={instruction} onChange={(e) => { const newInstructions = [...instructions]; newInstructions[index] = e.target.value; setInstructions(newInstructions); }} className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white resize-none h-20" />
                  <button type="button" onClick={() => setInstructions(instructions.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl h-10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium">Bekor qilish</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />Saqlash
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
