import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ProgressPhoto, User } from '../types';
import { MOCK_PROGRESS_PHOTOS } from '../constants';

interface Props {
  user: User;
}

export default function ProgressScreen({ user }: Props) {
  const [photos] = useState<ProgressPhoto[]>(MOCK_PROGRESS_PHOTOS);

  const weightDiff = photos.length >= 2 ? photos[0].weight - photos[photos.length - 1].weight : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Progress</Text>

      {/* Weight summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Boshlang'ich</Text>
          <Text style={styles.summaryValue}>{photos[0]?.weight || user.weight} kg</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Hozirgi</Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{user.weight} kg</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Yo'qotildi</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>-{weightDiff} kg</Text>
        </View>
      </View>

      {/* Weight chart (simple visual) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Vazn tarixi</Text>
        <View style={styles.chartRow}>
          {user.weightHistory.map((w, idx) => {
            const maxW = Math.max(...user.weightHistory.map(h => h.weight));
            const minW = Math.min(...user.weightHistory.map(h => h.weight));
            const range = maxW - minW || 1;
            const height = ((w.weight - minW) / range) * 80 + 20;
            return (
              <View key={idx} style={styles.chartCol}>
                <View style={[styles.chartBar, { height, backgroundColor: idx === user.weightHistory.length - 1 ? colors.primary : colors.surfaceLight }]} />
                <Text style={styles.chartLabel}>{w.date.split(' ')[0]}</Text>
                <Text style={styles.chartWeight}>{w.weight}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Progress photos */}
      <Text style={styles.sectionTitle}>Suratlar</Text>
      {photos.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="camera-outline" size={40} color={colors.textDisabled} />
          <Text style={styles.emptyText}>Hali suratlar yuklanmagan</Text>
        </View>
      ) : (
        photos.map(photo => (
          <View key={photo.id} style={styles.photoCard}>
            <Image source={{ uri: photo.imageUrl }} style={styles.photoImage} />
            <View style={styles.photoInfo}>
              <Text style={styles.photoDate}>{photo.date}</Text>
              <Text style={styles.photoWeight}>{photo.weight} kg</Text>
              {photo.notes && <Text style={styles.photoNotes}>{photo.notes}</Text>}
            </View>
          </View>
        ))
      )}

      {/* Goal */}
      <View style={styles.goalCard}>
        <Ionicons name="trophy" size={24} color={colors.secondary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.goalTitle}>Maqsad: {user.goalWeight} kg</Text>
          <View style={styles.goalBar}>
            <View style={[styles.goalProgress, { width: `${Math.min(100, (weightDiff / (photos[0]?.weight - user.goalWeight || 1)) * 100)}%` }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: colors.textSecondary },
  summaryValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  chartCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  chartCol: { alignItems: 'center', gap: 4 },
  chartBar: { width: 24, borderRadius: 6 },
  chartLabel: { fontSize: 10, color: colors.textDisabled },
  chartWeight: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  emptyText: { color: colors.textDisabled, marginTop: 10, fontSize: 14 },
  photoCard: { backgroundColor: colors.surface, borderRadius: 20, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  photoImage: { width: '100%', height: 200 },
  photoInfo: { padding: 16 },
  photoDate: { fontSize: 13, color: colors.textSecondary },
  photoWeight: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  photoNotes: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  goalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondary + '15', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.secondary + '30', marginTop: 8 },
  goalTitle: { fontSize: 16, fontWeight: '700', color: colors.secondary },
  goalBar: { height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  goalProgress: { height: '100%', backgroundColor: colors.secondary, borderRadius: 3 },
});
