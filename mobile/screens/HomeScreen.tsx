import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { User, DailyPlan, Task } from '../types';

interface Props {
  user: User;
}

export default function HomeScreen({ user }: Props) {
  const [currentDay, setCurrentDay] = useState(user.currentDay);
  const todayPlan: DailyPlan | undefined = user.plan[currentDay - 1];

  const completedMeals = todayPlan?.meals.filter(m => m.completed).length || 0;
  const totalMeals = todayPlan?.meals.length || 0;
  const completedExercises = todayPlan?.exercises.filter(e => e.completed).length || 0;
  const totalExercises = todayPlan?.exercises.length || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xush kelibsiz,</Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={18} color={colors.primary} />
          <Text style={styles.streakText}>{user.streak}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
          <Text style={styles.statValue}>{currentDay}</Text>
          <Text style={styles.statLabel}>Kun</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.secondary }]}>
          <Text style={styles.statValue}>{user.weight}kg</Text>
          <Text style={styles.statLabel}>Vazn</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
          <Text style={styles.statValue}>{user.progress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Day Selector */}
      <Text style={styles.sectionTitle}>30 kunlik reja</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
        {user.plan.map((day, idx) => {
          const isActive = idx + 1 === currentDay;
          const isDone = day.isCompleted;
          const isFuture = idx + 1 > user.currentDay;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setCurrentDay(idx + 1)}
              style={[
                styles.dayChip,
                isActive && styles.dayChipActive,
                isDone && !isActive && styles.dayChipDone,
                isFuture && styles.dayChipFuture,
              ]}
            >
              <Text style={[styles.dayChipText, isActive && styles.dayChipTextActive, isDone && !isActive && styles.dayChipTextDone]}>
                {idx + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Today's Plan */}
      {todayPlan && (
        <>
          {/* Motivational message */}
          {todayPlan.motivationalMessage && (
            <View style={styles.motivationCard}>
              <Ionicons name="sparkles" size={20} color={colors.secondary} />
              <Text style={styles.motivationText}>{todayPlan.motivationalMessage}</Text>
            </View>
          )}

          {/* Meals */}
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={20} color={colors.secondary} />
            <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Ovqatlanish ({completedMeals}/{totalMeals})</Text>
          </View>
          {todayPlan.meals.map(meal => (
            <TaskCard key={meal.id} task={meal} color={colors.secondary} />
          ))}

          {/* Exercises */}
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Ionicons name="barbell" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Mashqlar ({completedExercises}/{totalExercises})</Text>
          </View>
          {todayPlan.exercises.map(exercise => (
            <TaskCard key={exercise.id} task={exercise} color={colors.primary} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function TaskCard({ task, color }: { task: Task; color: string }) {
  return (
    <View style={[styles.taskCard, { borderLeftColor: color }]}>
      <View style={styles.taskHeader}>
        <View style={[styles.taskCheck, task.completed && { backgroundColor: color + '30', borderColor: color }]}>
          {task.completed && <Ionicons name="checkmark" size={14} color={color} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, task.completed && styles.taskDone]}>{task.title}</Text>
          <Text style={styles.taskDesc}>{task.description}</Text>
        </View>
        {task.meta && (
          <View style={styles.taskMeta}>
            <Text style={styles.taskMetaText}>{task.meta}</Text>
          </View>
        )}
      </View>
      {task.time && (
        <View style={styles.taskTime}>
          <Ionicons name="time-outline" size={12} color={colors.textDisabled} />
          <Text style={styles.taskTimeText}>{task.time}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: colors.textSecondary },
  name: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderLeftWidth: 3, borderColor: colors.border },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  dayScroll: { marginBottom: 20 },
  dayChip: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: colors.border },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayChipDone: { backgroundColor: colors.success + '20', borderColor: colors.success },
  dayChipFuture: { opacity: 0.4 },
  dayChipText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  dayChipTextActive: { color: '#1E1E1E' },
  dayChipTextDone: { color: colors.success },
  motivationCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.secondary + '15', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.secondary + '30' },
  motivationText: { flex: 1, color: colors.secondary, fontSize: 14, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  taskCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 10, borderLeftWidth: 3, borderColor: colors.border },
  taskHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  taskTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  taskDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  taskDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  taskMeta: { backgroundColor: colors.surfaceLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  taskMetaText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  taskTime: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, marginLeft: 40 },
  taskTimeText: { fontSize: 11, color: colors.textDisabled },
});
