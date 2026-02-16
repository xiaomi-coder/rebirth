import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
  const { userName } = route.params;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Xush kelibsiz,</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bugungi reja</Text>
          <Text style={styles.cardText}>
            Bu yerda kundalik ovqatlanish va mashq rejasi ko‘rinadi. Web versiyadagi kabi barcha funksiyalar keyingi yangilanishlarda qo‘shiladi.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }))}
        >
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  logoutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
