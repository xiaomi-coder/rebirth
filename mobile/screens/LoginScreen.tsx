import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { colors } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) return;
    const name = username === 'admin' && password === 'admin'
      ? 'Admin'
      : username.trim().charAt(0).toUpperCase() + username.trim().slice(1);
    navigation.navigate('Home', { userName: name });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>QAYTA</Text>
          <Text style={[styles.logo, styles.logoAccent]}>TUG'ILISH</Text>
          <Text style={styles.subtitle}>Kabinetga kirish</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  logoAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '700',
  },
});
