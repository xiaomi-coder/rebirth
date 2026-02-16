import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, TrendingDown, Calendar, Ruler, Plus, X, ArrowRight } from 'lucide-react';
import { ProgressPhoto, BodyMeasurement } from '../types';

interface ProgressPhotosProps {
  photos: ProgressPhoto[];
  onBack: () => void;
  onAddPhoto: (photo: Omit<ProgressPhoto, 'id' | 'userId'>) => void;
}

export const ProgressPhotos: React.FC<ProgressPhotosProps> = ({ photos, onBack, onAddPhoto }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<{ before: ProgressPhoto; after: ProgressPhoto } | null>(null);

  const sortedPhotos = [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstPhoto = sortedPhotos[0];
  const latestPhoto = sortedPhotos[sortedPhotos.length - 1];
  const totalWeightLoss = firstPhoto && latestPhoto ? firstPhoto.weight - latestPhoto.weight : 0;

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
              <Camera className="w-7 h-7 text-purple-500" />
              Progress Fotolar
            </h1>
            <p className="text-sm text-gray-400">{photos.length} ta foto</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {firstPhoto && latestPhoto && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl p-6 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Umumiy natija</p>
                <p className="text-4xl font-bold text-white flex items-center gap-2">
                  {totalWeightLoss > 0 ? '-' : '+'}{Math.abs(totalWeightLoss).toFixed(1)} kg
                  <TrendingDown className="w-8 h-8 text-green-400" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Davomiyligi</p>
                <p className="text-2xl font-bold text-white">
                  {Math.ceil((new Date(latestPhoto.date).getTime() - new Date(firstPhoto.date).getTime()) / (1000 * 60 * 60 * 24))} kun
                </p>
              </div>
            </div>

            {/* Before/After Comparison Button */}
            <button
              onClick={() => setSelectedComparison({ before: firstPhoto, after: latestPhoto })}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <span>Before & After Ko'rish</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
        {sortedPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PhotoCard 
              photo={photo}
              onClick={() => {
                if (index > 0) {
                  setSelectedComparison({ before: sortedPhotos[index - 1], after: photo });
                }
              }}
            />
          </motion.div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Camera className="w-20 h-20 text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg mb-2">Hali foto yo'q</p>
          <p className="text-gray-600 text-sm text-center max-w-xs">
            Har hafta progress foto yuklang va o'zgarishlaringizni kuzatib boring
          </p>
        </div>
      )}

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPhotoModal
            onClose={() => setShowAddModal(false)}
            onSubmit={(photoData) => {
              onAddPhoto(photoData);
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {selectedComparison && (
          <ComparisonModal
            before={selectedComparison.before}
            after={selectedComparison.after}
            onClose={() => setSelectedComparison(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PhotoCard = ({ photo, onClick }: { photo: ProgressPhoto; onClick: () => void }) => {
  const formattedDate = new Date(photo.date).toLocaleDateString('uz-UZ', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer shadow-xl"
    >
      <div className="flex gap-4 p-4">
        {/* Photo */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={photo.imageUrl}
            alt="Progress"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </p>
              <p className="text-2xl font-bold text-white">{photo.weight} kg</p>
            </div>
          </div>
          
          {photo.notes && (
            <p className="text-sm text-gray-400 italic">"{photo.notes}"</p>
          )}

          {/* Measurements */}
          {photo.measurements && (
            <div className="mt-3 flex gap-2">
              {photo.measurements.chest && (
                <MeasurementBadge label="Ko'krak" value={photo.measurements.chest} />
              )}
              {photo.measurements.waist && (
                <MeasurementBadge label="Bel" value={photo.measurements.waist} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MeasurementBadge = ({ label, value }: { label: string; value: number }) => (
  <div className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded-lg">
    <p className="text-xs text-purple-400">{label}: {value}cm</p>
  </div>
);

const AddPhotoModal = ({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: Omit<ProgressPhoto, 'id' | 'userId'>) => void;
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    weight: '',
    notes: '',
    chest: '',
    waist: '',
    hips: ''
  });

  const handleSubmit = () => {
    if (!formData.imageUrl || !formData.weight) {
      alert('Rasm va vazn kiritish shart!');
      return;
    }

    const measurements: BodyMeasurement = {};
    if (formData.chest) measurements.chest = parseFloat(formData.chest);
    if (formData.waist) measurements.waist = parseFloat(formData.waist);
    if (formData.hips) measurements.hips = parseFloat(formData.hips);

    onSubmit({
      date: formData.date,
      imageUrl: formData.imageUrl,
      weight: parseFloat(formData.weight),
      notes: formData.notes || undefined,
      measurements: Object.keys(measurements).length > 0 ? measurements : undefined
    });
  };

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
        className="bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Foto Qo'shish</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sana</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rasm *</label>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full bg-gray-800 border border-dashed border-gray-600 rounded-2xl px-4 py-6 cursor-pointer hover:border-purple-500/50 transition-colors">
                <Camera className="w-6 h-6 text-purple-400" />
                <span className="text-gray-300">Fayldan yuklash</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setFormData(f => ({ ...f, imageUrl: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {formData.imageUrl && (
                <div className="relative rounded-xl overflow-hidden bg-gray-800 h-32">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="url"
                placeholder="yoki URL kiriting"
                value={formData.imageUrl.startsWith('http') ? formData.imageUrl : ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Vazn (kg) *</label>
            <input
              type="number"
              step="0.1"
              placeholder="75.5"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Izoh</label>
            <textarea
              placeholder="Bugungi his-tuyg'ular..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24"
            />
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-400 mb-3">O'lchamlar (ixtiyoriy)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ko'krak (cm)</label>
                <input
                  type="number"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bel (cm)</label>
                <input
                  type="number"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Son (cm)</label>
                <input
                  type="number"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            Saqlash
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComparisonModal = ({ before, after, onClose }: {
  before: ProgressPhoto;
  after: ProgressPhoto;
  onClose: () => void;
}) => {
  const weightDiff = before.weight - after.weight;
  const daysDiff = Math.ceil((new Date(after.date).getTime() - new Date(before.date).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl">
          {/* Stats Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Transformation</h2>
            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-sm text-white/80">Vazn kamaydi</p>
                <p className="text-4xl font-bold text-white">{weightDiff.toFixed(1)} kg</p>
              </div>
              <div>
                <p className="text-sm text-white/80">Davomiyligi</p>
                <p className="text-4xl font-bold text-white">{daysDiff} kun</p>
              </div>
            </div>
          </div>

          {/* Photos Comparison */}
          <div className="grid grid-cols-2 gap-1 p-1">
            <div className="relative">
              <img src={before.imageUrl} alt="Before" className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-bold text-lg">BEFORE</p>
                <p className="text-white/80 text-sm">{before.weight} kg</p>
                <p className="text-white/60 text-xs">{new Date(before.date).toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>
            <div className="relative">
              <img src={after.imageUrl} alt="After" className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-bold text-lg">AFTER</p>
                <p className="text-white/80 text-sm">{after.weight} kg</p>
                <p className="text-white/60 text-xs">{new Date(after.date).toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>
          </div>

          {/* Measurements Comparison */}
          {before.measurements && after.measurements && (
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-white mb-4">O'lchamlar taqqoslash</h3>
              {before.measurements.chest && after.measurements.chest && (
                <MeasurementComparison
                  label="Ko'krak"
                  before={before.measurements.chest}
                  after={after.measurements.chest}
                />
              )}
              {before.measurements.waist && after.measurements.waist && (
                <MeasurementComparison
                  label="Bel"
                  before={before.measurements.waist}
                  after={after.measurements.waist}
                />
              )}
              {before.measurements.hips && after.measurements.hips && (
                <MeasurementComparison
                  label="Son"
                  before={before.measurements.hips}
                  after={after.measurements.hips}
                />
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const MeasurementComparison = ({ label, before, after }: { label: string; before: number; after: number }) => {
  const diff = before - after;
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
      <span className="text-white font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-400">{before} cm</span>
        <ArrowRight className="w-4 h-4 text-purple-500" />
        <span className="text-white font-bold">{after} cm</span>
        <span className={`text-sm font-bold ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {diff > 0 ? '-' : '+'}{Math.abs(diff)} cm
        </span>
      </div>
    </div>
  );
};
