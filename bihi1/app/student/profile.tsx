import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function StudentProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [attendanceRate, setAttendanceRate] = useState<number | null>(null);

  useEffect(() => {
    const loadAttendanceStats = async () => {
      try {
        const data = await AsyncStorage.getItem('attendanceStats');
        if (data) {
          const stats = JSON.parse(data);
          setAttendanceRate(stats.attendanceRate);
        }
      } catch (error) {
        console.log('Error loading attendance stats:', error);
      }
    };
    loadAttendanceStats();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👤 {user?.fullName} {user?.familyName}</Text>
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
            <IconSymbol name="power" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <GlassView style={styles.profileCard} glassEffectStyle="regular">
          {user?.photo && (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          )}
          <Text style={[styles.name, { color: theme.colors.text }]}>{user?.fullName} {user?.familyName}</Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
          <Text style={[styles.section, { color: theme.colors.text }]}>Section: {user?.section}</Text>
          <Text style={[styles.section, { color: theme.colors.text }]}>Department #: {user?.departmentNumber}</Text>
        </GlassView>

        {/* Attendance Rate */}
        {attendanceRate !== null && (
          <View style={{ alignItems: 'center', marginVertical: 12 }}>
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>
              Attendance Rate: {attendanceRate}%
            </Text>
          </View>
        )}

        {/* Link to Absences */}
        <TouchableOpacity onPress={() => router.push('/student/absences')} style={{ marginVertical: 12 }}>
          <Text style={{ color: colors.primary, fontWeight: '500' }}>
            View Absences
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  section: {
    fontSize: 16,
  },
});