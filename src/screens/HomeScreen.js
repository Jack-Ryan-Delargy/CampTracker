import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import {
  getWorkouts,
  getTodayWeight,
  getWeightTrend,
  getDaysUntilFight,
  getTargetWeight,
  formatWorkoutForDisplay,
  setFightDate,
  setTargetWeight,
} from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [todayWeight, setTodayWeight] = useState(null);
  const [weightTrend, setWeightTrend] = useState(null);
  const [daysUntilFight, setDaysUntilFight] = useState(23);
  const [targetWeight, setTargetWeightState] = useState(165);
  const [loading, setLoading] = useState(true);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Load all data
      const [
        workoutsData,
        todayWeightData,
        trendData,
        fightDays,
        target,
      ] = await Promise.all([
        getWorkouts(),
        getTodayWeight(),
        getWeightTrend(),
        getDaysUntilFight(),
        getTargetWeight(),
      ]);

      setWorkouts(workoutsData.slice(0, 3)); // Show only recent 3
      setTodayWeight(todayWeightData);
      setWeightTrend(trendData);
      setDaysUntilFight(fightDays || 23);
      setTargetWeightState(target || 165);

      // Set default fight date if none exists
      if (fightDays === null) {
        const defaultFightDate = new Date();
        defaultFightDate.setDate(defaultFightDate.getDate() + 23);
        await setFightDate(defaultFightDate);
      }

      // Set default target weight if none exists
      if (target === null) {
        await setTargetWeight(165);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightPress = () => {
    navigation.navigate('WeightLogger');
  };

  const formatWeightTrend = () => {
    if (!weightTrend) return '';
    
    const direction = weightTrend.direction === 'down' ? '↓' : 
                     weightTrend.direction === 'up' ? '↑' : '→';
    const change = Math.abs(weightTrend.change).toFixed(1);
    
    return `${direction} ${change} lbs this week`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.sectionTitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>FIGHT CAMP</Text>
          <Text style={styles.subtitle}>Track Your Path to Victory</Text>
        </View>

        {/* Fight Countdown */}
        <View style={styles.fightCountdown}>
          <Text style={styles.daysLeft}>{daysUntilFight}</Text>
          <Text style={styles.fightInfo}>Days Until Fight</Text>
        </View>

        {/* Weight Section */}
        <TouchableOpacity style={styles.weightSection} onPress={handleWeightPress}>
          <View style={styles.weightHeader}>
            <Text style={styles.weightTitle}>Today's Weight</Text>
            <Text style={styles.weightTrend}>{formatWeightTrend()}</Text>
          </View>
          <View style={styles.weightDisplay}>
            <Text style={styles.currentWeight}>
              {todayWeight ? `${todayWeight.weight} lbs` : 'Tap to log'}
            </Text>
            <View style={styles.targetWeight}>
              <Text style={styles.targetLabel}>Fight Weight</Text>
              <Text style={styles.targetValue}>{targetWeight} lbs</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('WorkoutLogger', { type: 'bagwork' })}
            >
              <Text style={styles.actionIcon}>🥊</Text>
              <Text style={styles.actionText}>Bag Work</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('WorkoutLogger', { type: 'cardio' })}
            >
              <Text style={styles.actionIcon}>🏃</Text>
              <Text style={styles.actionText}>Cardio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('WorkoutLogger', { type: 'strength' })}
            >
              <Text style={styles.actionIcon}>💪</Text>
              <Text style={styles.actionText}>Strength</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('WorkoutLogger', { type: 'sparring' })}
            >
              <Text style={styles.actionIcon}>🥋</Text>
              <Text style={styles.actionText}>Sparring</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No workouts yet</Text>
              <Text style={styles.emptyStateSubtext}>Tap a quick action above to log your first workout!</Text>
            </View>
          ) : (
            workouts.map((workout) => {
              const formatted = formatWorkoutForDisplay(workout);
              return (
                <TouchableOpacity 
                  key={workout.id} 
                  style={styles.activityItem}
                  onPress={() => navigation.navigate('WorkoutDetail', { workout })}
                >
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>
                      {workout.type === 'bagwork' ? 'Heavy Bag' :
                       workout.type === 'cardio' ? 'Cardio' :
                       workout.type === 'strength' ? 'Strength' :
                       workout.type === 'sparring' ? 'Sparring' : 'Workout'}
                    </Text>
                    <Text style={styles.activityDetail}>{formatted.displayDetails}</Text>
                  </View>
                  <View style={styles.activityRight}>
                    <Text style={styles.activityTime}>{formatted.timeAgo}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60, // Account for status bar
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  fightCountdown: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  daysLeft: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  fightInfo: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.9,
  },
  weightSection: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  weightTrend: {
    fontSize: 14,
    color: colors.primary,
  },
  weightDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentWeight: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  targetWeight: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: 12,
    color: colors.border,
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActions: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.text,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  recentActivity: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 100, // Space for bottom navigation
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activityTime: {
    fontSize: 12,
    color: colors.border,
    marginBottom: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  chevron: {
    fontSize: 14,
    color: colors.border,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.border,
    textAlign: 'center',
  },
});