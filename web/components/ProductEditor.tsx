import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Trash2, Save, X } from 'lucide-react';
import { Product } from '../types';

interface ProductEditorProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    type: product?.type || 'meal-plan',
    price: product?.price || 0,
    currency: product?.currency || 'UZS',
    imageUrl: product?.imageUrl || '',
    videoPreviewUrl: product?.videoPreviewUrl || '',
    downloadUrl: product?.downloadUrl || ''
  });

  const [features, setFeatures] = useState<string[]>(product?.features || ['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: features.filter(f => f.trim()),
      previewImages: [],
      isPurchased: false
    } as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-yellow-500" />
            {product ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-700 rounded-xl"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Turi *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                <option value="meal-plan">Ovqatlanish reja</option>
                <option value="video-course">Video kurs</option>
                <option value="workout-plan">Mashq reja</option>
                <option value="ebook">E-Book</option>
                <option value="supplement">Qo'shimcha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tavsif</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white resize-none h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Narx *</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Valyuta</label>
              <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rasm URL *</label>
            <input type="url" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Video Preview URL</label>
              <input type="url" value={formData.videoPreviewUrl} onChange={(e) => setFormData({ ...formData, videoPreviewUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Download URL</label>
              <input type="url" value={formData.downloadUrl} onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-bold text-white">Xususiyatlar</label>
              <button type="button" onClick={() => setFeatures([...features, ''])} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />Qo'shish
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={feature} onChange={(e) => { const newFeatures = [...features]; newFeatures[index] = e.target.value; setFeatures(newFeatures); }} className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white" placeholder="Mahsulot xususiyati" />
                  <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium">Bekor qilish</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />Saqlash
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
