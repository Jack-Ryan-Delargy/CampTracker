import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { getWorkouts, getWeightEntries } from '../utils/storage';

export default function CalendarScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [weightEntries, setWeightEntries] = useState([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState({});
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'
  const [currentDate, setCurrentDate] = useState(new Date());

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      if (viewMode === 'monthly') {
        generateMonthlyPlan();
      } else {
        generateWeeklyPlan();
      }
    }, [viewMode, currentDate])
  );

  // Regenerate plan when currentDate changes
  useEffect(() => {
    if (viewMode === 'monthly') {
      generateMonthlyPlan();
    }
  }, [currentDate]);

  const loadData = async () => {
    try {
      const [workoutsData, weightData] = await Promise.all([
        getWorkouts(),
        getWeightEntries(),
      ]);
      setWorkouts(workoutsData);
      setWeightEntries(weightData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  const generateWeeklyPlan = () => {
    const plan = {};
    const today = new Date();
    
    for (let i = 0; i < 14; i++) { // Next 2 weeks
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toDateString();
      
      const dayOfWeek = date.getDay();
      
      switch (dayOfWeek) {
        case 1: // Monday - Bag Work
          plan[dateKey] = [
            { type: 'bagwork', name: 'Heavy Bag', details: '6 rounds × 3 min', completed: false },
            { type: 'weight', name: 'Weight Check', details: 'Morning weigh-in', completed: false }
          ];
          break;
        case 2: // Tuesday - Cardio
          plan[dateKey] = [
            { type: 'cardio', name: 'Cardio', details: '5 mile run', completed: false }
          ];
          break;
        case 3: // Wednesday - Strength
          plan[dateKey] = [
            { type: 'strength', name: 'Strength Training', details: '3×10 compound movements', completed: false },
            { type: 'weight', name: 'Weight Check', details: 'Morning weigh-in', completed: false }
          ];
          break;
        case 4: // Thursday - Sparring
          plan[dateKey] = [
            { type: 'sparring', name: 'Sparring', details: '8 rounds × 3 min', completed: false }
          ];
          break;
        case 5: // Friday - Bag Work
          plan[dateKey] = [
            { type: 'bagwork', name: 'Technical Bag Work', details: '5 rounds × 3 min', completed: false },
            { type: 'weight', name: 'Weight Check', details: 'Morning weigh-in', completed: false }
          ];
          break;
        case 6: // Saturday - Light Cardio
          plan[dateKey] = [
            { type: 'cardio', name: 'Active Recovery', details: '3 mile easy run', completed: false }
          ];
          break;
        case 0: // Sunday - Rest
          plan[dateKey] = [
            { type: 'weight', name: 'Weight Check', details: 'Morning weigh-in', completed: false },
            { type: 'rest', name: 'Rest Day', details: 'Recovery and meal prep', completed: false }
          ];
          break;
      }
    }
    
    setPlannedWorkouts(plan);
  };

  const generateMonthlyPlan = () => {
    const plan = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Generate plan for entire month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toDateString();
      const dayOfWeek = date.getDay();
      
      switch (dayOfWeek) {
        case 1: // Monday - Bag Work
          plan[dateKey] = [
            { type: 'bagwork', name: 'Heavy Bag', details: '6×3min', completed: false },
            { type: 'weight', name: 'Weigh-in', details: '', completed: false }
          ];
          break;
        case 2: // Tuesday - Cardio
          plan[dateKey] = [
            { type: 'cardio', name: 'Cardio', details: '5mi run', completed: false }
          ];
          break;
        case 3: // Wednesday - Strength
          plan[dateKey] = [
            { type: 'strength', name: 'Strength', details: '3×10', completed: false },
            { type: 'weight', name: 'Weigh-in', details: '', completed: false }
          ];
          break;
        case 4: // Thursday - Sparring
          plan[dateKey] = [
            { type: 'sparring', name: 'Sparring', details: '8×3min', completed: false }
          ];
          break;
        case 5: // Friday - Bag Work
          plan[dateKey] = [
            { type: 'bagwork', name: 'Tech Bag', details: '5×3min', completed: false },
            { type: 'weight', name: 'Weigh-in', details: '', completed: false }
          ];
          break;
        case 6: // Saturday - Light Cardio
          plan[dateKey] = [
            { type: 'cardio', name: 'Recovery', details: '3mi easy', completed: false }
          ];
          break;
        case 0: // Sunday - Rest
          plan[dateKey] = [
            { type: 'weight', name: 'Weigh-in', details: '', completed: false },
            { type: 'rest', name: 'Rest', details: 'Recovery', completed: false }
          ];
          break;
      }
    }
    
    setPlannedWorkouts(plan);
  };

  const toggleWorkoutCompleted = (dateKey, workoutIndex) => {
    setPlannedWorkouts(prev => {
      const newPlan = { ...prev };
      if (newPlan[dateKey] && newPlan[dateKey][workoutIndex]) {
        newPlan[dateKey][workoutIndex].completed = !newPlan[dateKey][workoutIndex].completed;
      }
      return newPlan;
    });
  };

  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'bagwork': return '🥊';
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'sparring': return '🥋';
      case 'weight': return '⚖️';
      case 'rest': return '😴';
      default: return '🏋️';
    }
  };

  const isToday = (dateString) => {
    return new Date().toDateString() === dateString;
  };

  const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getCompletionRate = (dateKey) => {
    const dayPlan = plannedWorkouts[dateKey] || [];
    if (dayPlan.length === 0) return 0;
    const completed = dayPlan.filter(w => w.completed).length;
    return Math.round((completed / dayPlan.length) * 100);
  };

  const handleAddWorkout = (dateKey) => {
    Alert.alert(
      'Add Workout',
      'What would you like to add to this day?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go to Workout Logger', onPress: () => navigation.navigate('WorkoutLogger') },
      ]
    );
  };

  const handleToggleView = () => {
    const newMode = viewMode === 'weekly' ? 'monthly' : 'weekly';
    setViewMode(newMode);
    
    if (newMode === 'monthly') {
      generateMonthlyPlan();
    } else {
      generateWeeklyPlan();
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const renderWeeklyView = () => {
    return Object.entries(plannedWorkouts)
      .slice(0, 14)
      .map(([dateKey, dayPlan]) => {
        const date = new Date(dateKey);
        const completionRate = getCompletionRate(dateKey);
        
        return (
          <View 
            key={dateKey} 
            style={[
              styles.dayCard,
              isToday(dateKey) && styles.todayCard,
              isPastDate(dateKey) && styles.pastCard
            ]}
          >
            <View style={styles.dayHeader}>
              <View>
                <Text style={[
                  styles.dayName,
                  isToday(dateKey) && styles.todayText
                ]}>
                  {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <Text style={styles.dayDate}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {isToday(dateKey) && ' (Today)'}
                </Text>
              </View>
              <View style={styles.completionContainer}>
                <Text style={styles.completionRate}>{completionRate}%</Text>
                <Text style={styles.completionLabel}>Complete</Text>
              </View>
            </View>

            <View style={styles.workoutsList}>
              {dayPlan.map((workout, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.workoutItem,
                    workout.completed && styles.workoutCompleted
                  ]}
                  onPress={() => toggleWorkoutCompleted(dateKey, index)}
                >
                  <View style={styles.workoutLeft}>
                    <View style={[
                      styles.checkbox,
                      workout.completed && styles.checkboxChecked
                    ]}>
                      {workout.completed && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.workoutIcon}>{getWorkoutIcon(workout.type)}</Text>
                    <View>
                      <Text style={[
                        styles.workoutName,
                        workout.completed && styles.workoutCompletedText
                      ]}>
                        {workout.name}
                      </Text>
                      <Text style={styles.workoutDetails}>{workout.details}</Text>
                    </View>
                  </View>
                  {workout.type !== 'rest' && workout.type !== 'weight' && (
                    <TouchableOpacity
                      style={styles.logBtn}
                      onPress={() => navigation.navigate('WorkoutLogger', { type: workout.type })}
                    >
                      <Text style={styles.logBtnText}>Log</Text>
                    </TouchableOpacity>
                  )}
                  {workout.type === 'weight' && (
                    <TouchableOpacity
                      style={styles.logBtn}
                      onPress={() => navigation.navigate('WeightLogger')}
                    >
                      <Text style={styles.logBtnText}>Log</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.addWorkoutBtn}
              onPress={() => handleAddWorkout(dateKey)}
            >
              <Text style={styles.addWorkoutText}>+ Add Workout</Text>
            </TouchableOpacity>
          </View>
        );
      });
  };

  const renderMonthlyView = () => {
    const monthDays = getMonthDays();
    const weeks = [];
    
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }

    return (
      <View style={styles.monthlyContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              const dateKey = date.toDateString();
              const dayPlan = plannedWorkouts[dateKey] || [];
              const completionRate = getCompletionRate(dateKey);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    !isCurrentMonth && styles.otherMonthDay,
                    isToday(dateKey) && styles.todayCell
                  ]}
                  onPress={() => handleAddWorkout(dateKey)}
                >
                  <Text style={[
                    styles.dayNumber,
                    !isCurrentMonth && styles.otherMonthText,
                    isToday(dateKey) && styles.todayNumber
                  ]}>
                    {date.getDate()}
                  </Text>
                  
                  <View style={styles.dayWorkouts}>
                    {dayPlan.slice(0, 2).map((workout, index) => (
                      <View
                        key={index}
                        style={[
                          styles.workoutDot,
                          workout.completed && styles.workoutDotCompleted
                        ]}
                      >
                        <Text style={styles.workoutDotIcon}>
                          {getWorkoutIcon(workout.type)}
                        </Text>
                      </View>
                    ))}
                    {dayPlan.length > 2 && (
                      <Text style={styles.moreWorkouts}>+{dayPlan.length - 2}</Text>
                    )}
                  </View>
                  
                  {completionRate > 0 && (
                    <View style={styles.completionIndicator}>
                      <Text style={styles.completionPercent}>{completionRate}%</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>TRAINING PLAN</Text>
          <Text style={styles.subtitle}>Your Fight Camp Schedule</Text>
          
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'weekly' && styles.toggleBtnActive
              ]}
              onPress={handleToggleView}
            >
              <Text style={[
                styles.toggleText,
                viewMode === 'weekly' && styles.toggleTextActive
              ]}>
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'monthly' && styles.toggleBtnActive
              ]}
              onPress={handleToggleView}
            >
              <Text style={[
                styles.toggleText,
                viewMode === 'monthly' && styles.toggleTextActive
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Training Plan */}
        <View style={styles.planContainer}>
          {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>How to Use:</Text>
          <Text style={styles.legendText}>• Tap checkboxes to mark workouts complete</Text>
          <Text style={styles.legendText}>• Tap "Log" buttons to record actual workouts</Text>
          <Text style={styles.legendText}>• Add custom workouts with + button</Text>
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
    paddingTop: 60,
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
    marginBottom: 20,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: colors.darkest,
    fontWeight: '600',
  },
  planContainer: {
    marginBottom: 20,
  },
  // Weekly View Styles
  dayCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  pastCard: {
    opacity: 0.7,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  todayText: {
    color: colors.primary,
  },
  dayDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completionContainer: {
    alignItems: 'center',
  },
  completionRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  completionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  workoutsList: {
    marginBottom: 10,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workoutCompleted: {
    opacity: 0.6,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.darkest,
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  workoutCompletedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  workoutDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  logBtnText: {
    color: colors.darkest,
    fontSize: 12,
    fontWeight: '600',
  },
  addWorkoutBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 5,
  },
  addWorkoutText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  // Monthly View Styles
  monthlyContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  navBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingVertical: 5,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    minHeight: 70,
    padding: 4,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: colors.secondary,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  otherMonthText: {
    color: colors.textSecondary,
  },
  todayNumber: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  dayWorkouts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 2,
  },
  workoutDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutDotCompleted: {
    backgroundColor: colors.primary,
  },
  workoutDotIcon: {
    fontSize: 8,
  },
  moreWorkouts: {
    fontSize: 8,
    color: colors.textSecondary,
  },
  completionIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  completionPercent: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  legend: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
});