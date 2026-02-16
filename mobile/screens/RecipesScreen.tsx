import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Recipe } from '../types';
import { MOCK_RECIPES } from '../constants';

export default function RecipesScreen() {
  const [recipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Barchasi' },
    { key: 'breakfast', label: 'Nonushta' },
    { key: 'lunch', label: 'Tushlik' },
    { key: 'dinner', label: 'Kechki' },
    { key: 'snack', label: 'Snack' },
  ];

  const filtered = activeCategory === 'all' ? recipes : recipes.filter(r => r.category === activeCategory);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Retseptlar</Text>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map(c => (
            <TouchableOpacity
              key={c.key}
              onPress={() => setActiveCategory(c.key)}
              style={[styles.filterChip, activeCategory === c.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeCategory === c.key && styles.filterTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recipe cards */}
        {filtered.map(recipe => (
          <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => setSelectedRecipe(recipe)}>
            {recipe.imageUrl && (
              <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
            )}
            <View style={styles.recipeContent}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <Text style={styles.recipeDesc}>{recipe.description}</Text>
              <View style={styles.recipeStats}>
                <View style={styles.recipeStat}>
                  <Ionicons name="flame-outline" size={14} color={colors.primary} />
                  <Text style={styles.recipeStatText}>{recipe.calories} kkal</Text>
                </View>
                <View style={styles.recipeStat}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.recipeStatText}>{recipe.prepTime + recipe.cookTime} daq</Text>
                </View>
                <View style={styles.recipeStat}>
                  <Text style={[styles.recipeStatText, { color: colors.success }]}>P: {recipe.protein}g</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedRecipe} animationType="slide" transparent>
        {selectedRecipe && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {selectedRecipe.imageUrl && (
                  <Image source={{ uri: selectedRecipe.imageUrl }} style={styles.modalImage} />
                )}
                <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedRecipe(null)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                  <Text style={styles.modalDesc}>{selectedRecipe.description}</Text>

                  {/* Nutrition */}
                  <View style={styles.nutritionRow}>
                    <NutritionItem label="Kaloriya" value={`${selectedRecipe.calories}`} unit="kkal" color={colors.primary} />
                    <NutritionItem label="Protein" value={`${selectedRecipe.protein}`} unit="g" color={colors.success} />
                    <NutritionItem label="Karbohidrat" value={`${selectedRecipe.carbs}`} unit="g" color={colors.secondary} />
                    <NutritionItem label="Yog'" value={`${selectedRecipe.fats}`} unit="g" color={colors.error} />
                  </View>

                  {/* Ingredients */}
                  <Text style={styles.subTitle}>Tarkibi</Text>
                  {selectedRecipe.ingredients.map(ing => (
                    <View key={ing.id} style={styles.ingredientRow}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientText}>{ing.name} — {ing.amount} {ing.unit}</Text>
                    </View>
                  ))}

                  {/* Instructions */}
                  <Text style={styles.subTitle}>Tayyorlash</Text>
                  {selectedRecipe.instructions.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepNum}>
                        <Text style={styles.stepNumText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

function NutritionItem({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <View style={styles.nutritionItem}>
      <Text style={[styles.nutritionValue, { color }]}>{value}</Text>
      <Text style={styles.nutritionUnit}>{unit}</Text>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  filterRow: { marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#1E1E1E' },
  recipeCard: { backgroundColor: colors.surface, borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 16 },
  recipeName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  recipeDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  recipeStats: { flexDirection: 'row', gap: 16, marginTop: 12 },
  recipeStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recipeStatText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: colors.background },
  modalContent: { flex: 1 },
  modalImage: { width: '100%', height: 250 },
  modalClose: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  modalBody: { padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  modalDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 24 },
  nutritionItem: { alignItems: 'center' },
  nutritionValue: { fontSize: 20, fontWeight: '800' },
  nutritionUnit: { fontSize: 11, color: colors.textSecondary },
  nutritionLabel: { fontSize: 10, color: colors.textDisabled, marginTop: 2 },
  subTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginTop: 8 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  ingredientDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  ingredientText: { fontSize: 14, color: colors.textSecondary },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  stepText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
});
