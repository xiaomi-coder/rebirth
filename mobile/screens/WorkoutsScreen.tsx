import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Exercise } from '../types';
import { MOCK_EXERCISES } from '../constants';

export default function WorkoutsScreen() {
  const [exercises] = useState<Exercise[]>(MOCK_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const difficultyColors: Record<string, string> = {
    beginner: colors.success,
    intermediate: colors.secondary,
    advanced: colors.error,
  };
  const difficultyLabels: Record<string, string> = {
    beginner: 'Boshlang\'ich',
    intermediate: 'O\'rta',
    advanced: 'Murakkab',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mashqlar</Text>

        {exercises.map(exercise => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard} onPress={() => setSelectedExercise(exercise)}>
            {exercise.imageUrl && (
              <Image source={{ uri: exercise.imageUrl }} style={styles.exerciseImage} />
            )}
            <View style={styles.exerciseContent}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: (difficultyColors[exercise.difficulty] || colors.primary) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: difficultyColors[exercise.difficulty] || colors.primary }]}>
                    {difficultyLabels[exercise.difficulty] || exercise.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.exerciseDesc}>{exercise.description}</Text>
              <View style={styles.exerciseStats}>
                {exercise.sets && <StatChip icon="layers-outline" value={`${exercise.sets} set`} />}
                {exercise.reps && <StatChip icon="repeat-outline" value={exercise.reps} />}
                {exercise.calories && <StatChip icon="flame-outline" value={`${exercise.calories} kkal`} />}
              </View>
              <View style={styles.tagRow}>
                {exercise.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedExercise} animationType="slide" transparent>
        {selectedExercise && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {selectedExercise.imageUrl && (
                  <Image source={{ uri: selectedExercise.imageUrl }} style={styles.modalImage} />
                )}
                <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedExercise(null)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                  <Text style={styles.modalDesc}>{selectedExercise.description}</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                      <Ionicons name="body" size={20} color={colors.primary} />
                      <Text style={styles.infoLabel}>Mushak</Text>
                      <Text style={styles.infoValue}>{selectedExercise.muscleGroup}</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <Ionicons name="layers" size={20} color={colors.secondary} />
                      <Text style={styles.infoLabel}>Setlar</Text>
                      <Text style={styles.infoValue}>{selectedExercise.sets || '-'} x {selectedExercise.reps || '-'}</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <Ionicons name="flame" size={20} color={colors.error} />
                      <Text style={styles.infoLabel}>Kaloriya</Text>
                      <Text style={styles.infoValue}>{selectedExercise.calories || '-'} kkal</Text>
                    </View>
                  </View>

                  <Text style={styles.subTitle}>Bajarish tartibi</Text>
                  {selectedExercise.instructions.map((step, idx) => (
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

function StatChip({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Ionicons name={icon as any} size={13} color={colors.textSecondary} />
      <Text style={styles.statChipText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  exerciseCard: { backgroundColor: colors.surface, borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  exerciseImage: { width: '100%', height: 160 },
  exerciseContent: { padding: 16 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  difficultyText: { fontSize: 11, fontWeight: '700' },
  exerciseDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  exerciseStats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  tag: { backgroundColor: colors.primary + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: colors.background },
  modalContent: { flex: 1 },
  modalImage: { width: '100%', height: 250 },
  modalClose: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  modalBody: { padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  modalDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  infoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  infoLabel: { fontSize: 10, color: colors.textDisabled, marginTop: 4 },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  subTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  stepText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
});
