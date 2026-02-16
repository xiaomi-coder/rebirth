import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Plus, Trash2, Save, X } from 'lucide-react';
import { Recipe, Ingredient } from '../types';

interface RecipeEditorProps {
  recipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id' | 'createdBy' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    category: recipe?.category || 'breakfast',
    prepTime: recipe?.prepTime || 10,
    cookTime: recipe?.cookTime || 20,
    servings: recipe?.servings || 2,
    difficulty: recipe?.difficulty || 'easy',
    calories: recipe?.calories || 0,
    protein: recipe?.protein || 0,
    carbs: recipe?.carbs || 0,
    fats: recipe?.fats || 0,
    imageUrl: recipe?.imageUrl || '',
    videoUrl: recipe?.videoUrl || '',
    tags: recipe?.tags?.join(', ') || ''
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || []);
  const [instructions, setInstructions] = useState<string[]>(recipe?.instructions || ['']);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: `i-${Date.now()}`, name: '', amount: 0, unit: 'g' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipeData = {
      ...formData,
      ingredients,
      instructions: instructions.filter(i => i.trim()),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      isFavorite: false
    };

    onSave(recipeData as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-emerald-500" />
            {recipe ? 'Retseptni tahrirlash' : 'Yangi retsept'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-700 rounded-xl transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Kategoriya *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              >
                <option value="breakfast">Nonushta</option>
                <option value="lunch">Tushlik</option>
                <option value="dinner">Kechki ovqat</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tavsif</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white resize-none h-24"
            />
          </div>

          {/* Time & Difficulty */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prep (min)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cook (min)</label>
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Porsiya</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Qiyinlik</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              >
                <option value="easy">Oson</option>
                <option value="medium">O'rtacha</option>
                <option value="hard">Qiyin</option>
              </select>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Kaloriya</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Oqsil (g)</label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Uglevod (g)</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Yog' (g)</label>
              <input
                type="number"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rasm URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Video URL (ixtiyoriy)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-bold text-white">Ingredientlar</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Qo'shish
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nomi"
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Miqdor"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].amount = parseFloat(e.target.value);
                      setIngredients(newIngredients);
                    }}
                    className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].unit = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="dona">dona</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-bold text-white">Tayyorlash bosqichlari</label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Qo'shish
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => {
                      const newInstructions = [...instructions];
                      newInstructions[index] = e.target.value;
                      setInstructions(newInstructions);
                    }}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white resize-none h-20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl h-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Teglar (vergul bilan ajrating)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="protein, healthy, breakfast"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Saqlash
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
