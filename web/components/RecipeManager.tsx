import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Flame, Heart, Search, Filter, X, ChevronLeft, Users, Star, ShoppingCart } from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { Button, Card } from './UI';

interface RecipeManagerProps {
  recipes: Recipe[];
  onBack: () => void;
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const categoryNames = {
  breakfast: 'Nonushta',
  lunch: 'Tushlik',
  dinner: 'Kechki ovqat',
  snack: 'Snack'
};

const difficultyNames = {
  easy: 'Oson',
  medium: 'O\'rtacha',
  hard: 'Qiyin'
};

export const RecipeManager: React.FC<RecipeManagerProps> = ({ recipes, onBack, onViewRecipe, onToggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'favorites' && recipe.isFavorite ||
                           recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-emerald-500" />
              Retseptlar
            </h1>
            <p className="text-sm text-gray-400">{filteredRecipes.length} ta retsept</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-500/20"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Retsept qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-800"
            >
              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategoriya</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip 
                    label="Hammasi" 
                    active={selectedCategory === 'all'}
                    onClick={() => setSelectedCategory('all')}
                  />
                  <FilterChip 
                    label="⭐ Sevimlilar" 
                    active={selectedCategory === 'favorites'}
                    onClick={() => setSelectedCategory('favorites')}
                  />
                  {Object.entries(categoryNames).map(([key, label]) => (
                    <FilterChip 
                      key={key}
                      label={label}
                      active={selectedCategory === key}
                      onClick={() => setSelectedCategory(key)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipes Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <RecipeCard 
              recipe={recipe}
              onView={() => onViewRecipe(recipe)}
              onToggleFavorite={() => onToggleFavorite(recipe.id)}
            />
          </motion.div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <ChefHat className="w-20 h-20 text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">Retsept topilmadi</p>
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

const RecipeCard = ({ recipe, onView, onToggleFavorite }: { 
  recipe: Recipe; 
  onView: () => void;
  onToggleFavorite: () => void;
}) => (
  <div 
    onClick={onView}
    className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img 
        src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'} 
        alt={recipe.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
      >
        <Heart 
          className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
        />
      </button>

      {/* Difficulty Badge */}
      <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/20">
        {difficultyNames[recipe.difficulty]}
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{recipe.name}</h3>
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{recipe.description}</p>

      {/* Macros */}
      <div className="flex gap-2 mb-3">
        <MacroChip icon={<Flame className="w-3 h-3" />} value={`${recipe.calories}`} label="kkal" color="text-orange-400" />
        <MacroChip icon={<span className="text-xs font-bold">P</span>} value={`${recipe.protein}g`} label="" color="text-blue-400" />
        <MacroChip icon={<span className="text-xs font-bold">C</span>} value={`${recipe.carbs}g`} label="" color="text-yellow-400" />
        <MacroChip icon={<span className="text-xs font-bold">F</span>} value={`${recipe.fats}g`} label="" color="text-red-400" />
      </div>

      {/* Time & Servings */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.prepTime + recipe.cookTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{recipe.servings} porsiya</span>
        </div>
      </div>
    </div>
  </div>
);

const MacroChip = ({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) => (
  <div className={`flex items-center gap-1 px-2 py-1 bg-black/40 rounded-lg ${color}`}>
    {icon}
    <span className="text-xs font-bold">{value}{label}</span>
  </div>
);

// Recipe Detail Modal Component
export const RecipeDetailModal = ({ recipe, onClose, onAddToShoppingList }: {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (ingredients: Ingredient[]) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
      >
        {/* Hero Image */}
        <div className="relative h-64">
          <img 
            src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
            <p className="text-gray-400">{recipe.description}</p>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-4 gap-3">
            <MacroCard label="Kaloriya" value={recipe.calories} unit="kkal" color="from-orange-600 to-red-600" />
            <MacroCard label="Oqsil" value={recipe.protein} unit="g" color="from-blue-600 to-cyan-600" />
            <MacroCard label="Uglevod" value={recipe.carbs} unit="g" color="from-yellow-600 to-amber-600" />
            <MacroCard label="Yog'" value={recipe.fats} unit="g" color="from-red-600 to-pink-600" />
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              Ingredientlar
              <button
                onClick={() => onAddToShoppingList(recipe.ingredients)}
                className="text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Xarid ro'yxatiga
              </button>
            </h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                  <span className="text-white">{ingredient.name}</span>
                  <span className="text-emerald-400 font-bold">{ingredient.amount} {ingredient.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Tayyorlash</h3>
            <div className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MacroCard = ({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) => (
  <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
    <p className="text-xs text-white/80 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}<span className="text-sm ml-1">{unit}</span></p>
  </div>
);
