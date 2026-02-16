import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { User } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onLogout }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userCategory}>{user.category}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="person" size={12} color={colors.primary} />
          <Text style={styles.roleText}>{user.role || 'user'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatItem icon="calendar" label="Kun" value={`${user.currentDay}/30`} color={colors.primary} />
        <StatItem icon="flame" label="Streak" value={`${user.streak} kun`} color={colors.error} />
        <StatItem icon="trending-up" label="Progress" value={`${user.progress}%`} color={colors.success} />
        <StatItem icon="fitness" label="Vazn" value={`${user.weight} kg`} color={colors.secondary} />
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <InfoRow icon="body" label="Bo'y" value={`${user.height} sm`} />
        <InfoRow icon="fitness" label="Maqsad" value={`${user.goalWeight} kg`} />
        <InfoRow icon="calendar-outline" label="Boshlanish" value={user.startDate} />
        <InfoRow icon="person-outline" label="Yosh" value={`${user.age}`} />
        <InfoRow icon="call-outline" label="Telefon" value={user.phone} />
      </View>

      {/* Contact Admin */}
      <TouchableOpacity
        style={styles.telegramBtn}
        onPress={() => Linking.openURL('https://t.me/farruxradjabov94')}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
        <Text style={styles.telegramText}>Murabbiy bilan bog'lanish</Text>
      </TouchableOpacity>

      {/* Instagram */}
      <TouchableOpacity
        style={styles.instaBtn}
        onPress={() => Linking.openURL('https://instagram.com/farruxradjabov94')}
      >
        <Ionicons name="logo-instagram" size={20} color="white" />
        <Text style={styles.instaText}>Instagram: @farruxradjabov94</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Qayta Tug'ilish v1.0.0</Text>
    </ScrollView>
  );
}

function StatItem({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={18} color={colors.textDisabled} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#1E1E1E' },
  userName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  userCategory: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: colors.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  roleText: { fontSize: 12, color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statItem: { width: '47%', backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  telegramBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0088cc', borderRadius: 16, paddingVertical: 16, marginBottom: 10 },
  telegramText: { color: 'white', fontWeight: '700', fontSize: 15 },
  instaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E1306C', borderRadius: 16, paddingVertical: 16, marginBottom: 20 },
  instaText: { color: 'white', fontWeight: '700', fontSize: 15 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.error, borderRadius: 16, paddingVertical: 14, marginBottom: 20 },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', color: colors.textDisabled, fontSize: 12 },
});
