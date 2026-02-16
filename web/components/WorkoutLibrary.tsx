import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ChevronLeft, Search, Filter, X, Play, Clock, Flame, Star } from 'lucide-react';
import { Exercise } from '../types';

interface WorkoutLibraryProps {
  exercises: Exercise[];
  onBack: () => void;
  onViewExercise: (exercise: Exercise) => void;
}

const muscleGroupNames: Record<string, string> = {
  chest: '💪 Ko\'krak',
  back: '🦾 Orqa',
  legs: '🦵 Oyoqlar',
  shoulders: '💪 Yelkalar',
  arms: '💪 Qo\'llar',
  core: '🔥 Core',
  cardio: '❤️ Kardio',
  'full-body': '🏃 Butun tana'
};

const difficultyNames = {
  beginner: 'Boshlang\'ich',
  intermediate: 'O\'rtacha',
  advanced: 'Ilg\'or'
};

const difficultyColors = {
  beginner: 'from-green-600 to-emerald-600',
  intermediate: 'from-yellow-600 to-orange-600',
  advanced: 'from-red-600 to-pink-600'
};

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ exercises, onBack, onViewExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    return matchesSearch && matchesMuscle && matchesDifficulty;
  });

  const groupedExercises = filteredExercises.reduce((acc, exercise) => {
    const group = exercise.muscleGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

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
              <Dumbbell className="w-7 h-7 text-red-500" />
              Mashqlar Kutubxonasi
            </h1>
            <p className="text-sm text-gray-400">{filteredExercises.length} ta mashq</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white shadow-lg shadow-red-500/20"
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
              placeholder="Mashq qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
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

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-800"
            >
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Muskul guruhi</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip 
                      label="Hammasi" 
                      active={selectedMuscleGroup === 'all'}
                      onClick={() => setSelectedMuscleGroup('all')}
                    />
                    {Object.entries(muscleGroupNames).map(([key, label]) => (
                      <FilterChip 
                        key={key}
                        label={label}
                        active={selectedMuscleGroup === key}
                        onClick={() => setSelectedMuscleGroup(key)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Qiyinlik</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip 
                      label="Hammasi" 
                      active={selectedDifficulty === 'all'}
                      onClick={() => setSelectedDifficulty('all')}
                    />
                    {Object.entries(difficultyNames).map(([key, label]) => (
                      <FilterChip 
                        key={key}
                        label={label}
                        active={selectedDifficulty === key}
                        onClick={() => setSelectedDifficulty(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-6">
        {Object.entries(groupedExercises).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {muscleGroupNames[muscleGroup]}
              <span className="text-sm text-gray-500">({groupExercises.length})</span>
            </h2>
            <div className="space-y-3">
              {groupExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ExerciseCard
                    exercise={exercise}
                    onClick={() => onViewExercise(exercise)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Dumbbell className="w-20 h-20 text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">Mashq topilmadi</p>
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
        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30' 
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

const ExerciseCard = ({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-red-500/10"
  >
    <div className="flex gap-4 p-4">
      {/* Thumbnail */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
        <img
          src={exercise.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{exercise.name}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{exercise.description}</p>

        <div className="flex flex-wrap gap-2">
          {/* Difficulty Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${difficultyColors[exercise.difficulty]}`}>
            {difficultyNames[exercise.difficulty]}
          </span>

          {/* Stats */}
          {exercise.sets && exercise.reps && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
              {exercise.sets} x {exercise.reps}
            </span>
          )}

          {exercise.duration && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
            </span>
          )}

          {exercise.calories && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-900/30 text-orange-400 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {exercise.calories} kkal
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Exercise Detail Modal
export const ExerciseDetailModal = ({ exercise, onClose }: {
  exercise: Exercise;
  onClose: () => void;
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
        {/* Video/Image */}
        {exercise.videoUrl ? (
          <div className="relative h-64 bg-black">
            <iframe
              src={exercise.videoUrl}
              className="w-full h-full"
              title={exercise.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : exercise.imageUrl && (
          <div className="relative h-64">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{exercise.name}</h2>
                <p className="text-gray-400">{exercise.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${difficultyColors[exercise.difficulty]}`}>
                {difficultyNames[exercise.difficulty]}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {exercise.sets && (
              <StatCard label="Sets" value={exercise.sets.toString()} />
            )}
            {exercise.reps && (
              <StatCard label="Reps" value={exercise.reps} />
            )}
            {exercise.duration && (
              <StatCard label="Vaqt" value={`${Math.floor(exercise.duration / 60)}:${(exercise.duration % 60).toString().padStart(2, '0')}`} />
            )}
            {exercise.calories && (
              <StatCard label="Kaloriya" value={`${exercise.calories} kkal`} />
            )}
          </div>

          {/* Equipment */}
          {exercise.equipment.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Kerakli asboblar</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-800 rounded-xl text-gray-300 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Bajarish tartibi</h3>
            <div className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {exercise.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2">TEGLAR</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);
