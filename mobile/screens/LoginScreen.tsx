import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { UserRole, User } from '../types';
import { USERS_DB } from '../constants';

interface Props {
  onLogin: (role: UserRole, user?: User) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) return;

    if (username === 'creator' && password === 'xiaomicoder') {
      onLogin(UserRole.CREATOR);
      return;
    }

    const foundUser = USERS_DB.find(u => u.username === username && u.password === password);
    if (!foundUser) {
      Alert.alert("Xatolik", "Noto'g'ri login yoki parol");
      return;
    }
    if (foundUser.isBlocked) {
      Alert.alert("Bloklangan", "Sizning hisobingiz bloklangan. Admin bilan bog'laning.");
      return;
    }
    onLogin(foundUser.role || UserRole.USER, foundUser);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
        <View style={styles.header}>
          <Text style={styles.logo}>QAYTA</Text>
          <Text style={[styles.logo, styles.logoAccent]}>TUG'ILISH</Text>
          <Text style={styles.subtitle}>Platformaga kirish</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Login (username)"
            placeholderTextColor={colors.textDisabled}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Parol"
            placeholderTextColor={colors.textDisabled}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, (!username.trim() || !password.trim()) && styles.buttonDisabled]}
            disabled={!username.trim() || !password.trim()}
          >
            <Text style={styles.buttonText}>Kirish</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { marginBottom: 40 },
  logo: { fontSize: 36, fontWeight: '800', color: colors.textPrimary },
  logoAccent: { color: colors.primary },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
  form: { gap: 16 },
  input: {
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
    borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, color: colors.textPrimary,
  },
  button: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#1E1E1E', fontSize: 18, fontWeight: '700' },
});
