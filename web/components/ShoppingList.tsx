import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Trash2, ChevronLeft, Plus, X } from 'lucide-react';
import { Ingredient } from '../types';

interface ShoppingListProps {
  items: Ingredient[];
  onBack: () => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddCustomItem: (item: Ingredient) => void;
  onClearCompleted: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onBack,
  onToggleItem,
  onRemoveItem,
  onAddCustomItem,
  onClearCompleted
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', amount: '', unit: 'dona' });

  const completedCount = items.filter(item => (item as any).completed).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categoryNames: Record<string, string> = {
    protein: '🥩 Oqsillar',
    carbs: '🍞 Uglevod',
    vegetables: '🥗 Sabzavotlar',
    dairy: '🥛 Sut mahsulotlari',
    spices: '🧂 Ziravorlar',
    other: '📦 Boshqalar'
  };

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      onAddCustomItem({
        id: `custom-${Date.now()}`,
        name: newItem.name,
        amount: parseFloat(newItem.amount) || 1,
        unit: newItem.unit,
        category: 'other'
      });
      setNewItem({ name: '', amount: '', unit: 'dona' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-7 h-7 text-emerald-500" />
              Xarid Ro'yxati
            </h1>
            <p className="text-sm text-gray-400">{completedCount} / {items.length} tayyor</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              {categoryNames[category] || '📦 Boshqalar'}
              <span className="text-sm text-gray-500">({categoryItems.length})</span>
            </h3>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ShoppingItem
                    item={item}
                    onToggle={() => onToggleItem(item.id)}
                    onRemove={() => onRemoveItem(item.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="w-20 h-20 text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg mb-2">Xarid ro'yxati bo'sh</p>
            <p className="text-gray-600 text-sm">Retseptlardan mahsulot qo'shing</p>
          </div>
        )}

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Bajarilganlarni o'chirish
          </button>
        )}
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-3xl max-w-md w-full p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Mahsulot qo'shish</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Mahsulot nomi"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />

                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Miqdor"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="dona">dona</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">litr</option>
                    <option value="ml">ml</option>
                  </select>
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                  Qo'shish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShoppingItem = ({ item, onToggle, onRemove }: {
  item: Ingredient & { completed?: boolean };
  onToggle: () => void;
  onRemove: () => void;
}) => (
  <div
    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      item.completed
        ? 'bg-gray-800/50 border-gray-700'
        : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-emerald-500/50'
    }`}
  >
    <button
      onClick={onToggle}
      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
        item.completed
          ? 'bg-emerald-600 border-emerald-600'
          : 'border-gray-600 hover:border-emerald-500'
      }`}
    >
      {item.completed && <Check className="w-5 h-5 text-white" />}
    </button>

    <div className="flex-1">
      <p className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
        {item.name}
      </p>
      <p className="text-sm text-gray-400">
        {item.amount} {item.unit}
      </p>
    </div>

    <button
      onClick={onRemove}
      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
);
