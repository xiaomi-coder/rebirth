import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Star, Download, Video, BookOpen, X, Check } from 'lucide-react';
import { Product } from '../types';

interface MarketplaceProps {
  products: Product[];
  onBack: () => void;
  onPurchase: (productId: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ products, onBack, onPurchase }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProducts = selectedType === 'all' 
    ? products 
    : products.filter(p => p.type === selectedType);

  const productTypes = {
    all: '🌟 Hammasi',
    'meal-plan': '🍽️ Ovqatlanish reja',
    'video-course': '🎥 Video kurs',
    'workout-plan': '💪 Mashq reja',
    ebook: '📚 E-Book'
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
              <ShoppingBag className="w-7 h-7 text-yellow-500" />
              Do'kon
            </h1>
            <p className="text-sm text-gray-400">{filteredProducts.length} ta mahsulot</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Object.entries(productTypes).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === key
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-1 gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="w-20 h-20 text-gray-700 mb-4" />
          <p className="text-gray-400 text-lg">Mahsulot topilmadi</p>
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onPurchase={onPurchase}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'UZS') {
      return `${(price / 1000).toFixed(0)}K UZS`;
    }
    return `$${price}`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {product.isPurchased && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-green-600 rounded-full text-xs font-bold text-white flex items-center gap-1">
            <Check className="w-4 h-4" />
            Sotib olingan
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/20">
          {product.type === 'meal-plan' && '🍽️ Ovqatlanish'}
          {product.type === 'video-course' && '🎥 Video kurs'}
          {product.type === 'workout-plan' && '💪 Mashq reja'}
          {product.type === 'ebook' && '📚 E-Book'}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-bold text-sm">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>

        {/* Features */}
        <div className="space-y-1 mb-4">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            <p className="text-3xl font-bold text-white">{formatPrice(product.price, product.currency)}</p>
            <p className="text-xs text-gray-500">Bir martalik to'lov</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-yellow-500/50 transition-all">
            Sotib olish
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal = ({ product, onClose, onPurchase }: {
  product: Product;
  onClose: () => void;
  onPurchase: (productId: string) => void;
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'UZS') {
      return `${price.toLocaleString('uz-UZ')} UZS`;
    }
    return `$${price}`;
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
        className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
      >
        {/* Hero Image */}
        <div className="relative h-64">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {product.rating && (
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews} sharh)</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
            <p className="text-gray-400">{product.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Nimalar kiradi?</h3>
            <div className="space-y-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Section */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Narx</p>
                <p className="text-4xl font-bold text-white">{formatPrice(product.price, product.currency)}</p>
              </div>
            </div>

            {product.isPurchased ? (
              <div className="w-full py-4 bg-green-600 rounded-2xl text-white text-center font-bold flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Siz bu mahsulotga egasiz
              </div>
            ) : (
              <button
                onClick={() => {
                  onPurchase(product.id);
                  onClose();
                }}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-yellow-500/50 transition-all"
              >
                Sotib olish
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
