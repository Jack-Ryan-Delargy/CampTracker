import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Alert 
} from 'react-native';
import { colors } from '../styles/colors';
import { deleteWorkout } from '../utils/storage';

export default function WorkoutDetailScreen({ navigation, route }) {
  const workout = route.params?.workout;

  if (!workout) {
    navigation.goBack();
    return null;
  }

  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'bagwork': return '🥊';
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'sparring': return '🥋';
      default: return '🏋️';
    }
  };

  const getWorkoutTitle = (type) => {
    switch (type) {
      case 'bagwork': return 'Bag Work Session';
      case 'cardio': return 'Cardio Training';
      case 'strength': return 'Strength Training';
      case 'sparring': return 'Sparring Session';
      default: return 'Workout';
    }
  };

  const getBagTypeDisplay = (bagType) => {
    const types = {
      'heavy': 'Heavy Bag',
      'speed': 'Speed Bag',
      'double-end': 'Double-End Bag',
      'maize': 'Maize Bag'
    };
    return types[bagType] || 'Heavy Bag';
  };

  const getCardioTypeDisplay = (cardioType) => {
    const types = {
      'running': 'Running',
      'cycling': 'Cycling',
      'rowing': 'Rowing',
      'jump-rope': 'Jump Rope'
    };
    return types[cardioType] || 'Cardio';
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkout(workout.id);
              Alert.alert(
                'Deleted',
                'Workout deleted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const renderBagworkDetails = () => (
    <>
      {workout.bagType && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bag Type</Text>
          <Text style={styles.detailValue}>{getBagTypeDisplay(workout.bagType)}</Text>
        </View>
      )}
      {workout.rounds && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rounds</Text>
          <Text style={styles.detailValue}>{workout.rounds}</Text>
        </View>
      )}
      {workout.duration && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration per Round</Text>
          <Text style={styles.detailValue}>{workout.duration}</Text>
        </View>
      )}
      {workout.rest && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rest Between Rounds</Text>
          <Text style={styles.detailValue}>{workout.rest}</Text>
        </View>
      )}
      {workout.combinations && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Combinations</Text>
          <Text style={styles.detailValue}>{workout.combinations}</Text>
        </View>
      )}
    </>
  );

  const renderCardioDetails = () => (
    <>
      {workout.cardioType && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>
            {getCardioTypeDisplay(workout.cardioType)}
          </Text>
        </View>
      )}
      {workout.distance && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{workout.distance} miles</Text>
        </View>
      )}
      {workout.time && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{workout.time}</Text>
        </View>
      )}
      {workout.pace && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pace</Text>
          <Text style={styles.detailValue}>{workout.pace}</Text>
        </View>
      )}
      {workout.heartRate && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Average Heart Rate</Text>
          <Text style={styles.detailValue}>{workout.heartRate} bpm</Text>
        </View>
      )}
    </>
  );

  const renderStrengthDetails = () => (
    <>
      {workout.exercises && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Exercises</Text>
          <Text style={styles.detailValue}>{workout.exercises}</Text>
        </View>
      )}
      {workout.sets && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sets</Text>
          <Text style={styles.detailValue}>{workout.sets}</Text>
        </View>
      )}
      {workout.reps && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reps</Text>
          <Text style={styles.detailValue}>{workout.reps}</Text>
        </View>
      )}
      {workout.weight && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{workout.weight}</Text>
        </View>
      )}
      {workout.muscleGroups && workout.muscleGroups.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Muscle Groups</Text>
          <View style={styles.tagContainer}>
            {workout.muscleGroups.map((group, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{group}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );

  const renderSparringDetails = () => (
    <>
      {workout.rounds && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rounds</Text>
          <Text style={styles.detailValue}>{workout.rounds}</Text>
        </View>
      )}
      {workout.duration && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration per Round</Text>
          <Text style={styles.detailValue}>{workout.duration}</Text>
        </View>
      )}
      {workout.rest && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rest Between Rounds</Text>
          <Text style={styles.detailValue}>{workout.rest}</Text>
        </View>
      )}
      {workout.opponent && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sparring Partner</Text>
          <Text style={styles.detailValue}>{workout.opponent}</Text>
        </View>
      )}
      {workout.focusAreas && workout.focusAreas.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Focus Areas</Text>
          <View style={styles.tagContainer}>
            {workout.focusAreas.map((area, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );

  const renderWorkoutSpecificDetails = () => {
    switch (workout.type) {
      case 'bagwork':
        return renderBagworkDetails();
      case 'cardio':
        return renderCardioDetails();
      case 'strength':
        return renderStrengthDetails();
      case 'sparring':
        return renderSparringDetails();
      default:
        return null;
    }
  };

  const workoutDate = new Date(workout.timestamp);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Details</Text>
        </View>

        {/* Workout Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutIcon}>{getWorkoutIcon(workout.type)}</Text>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{getWorkoutTitle(workout.type)}</Text>
              <Text style={styles.workoutDate}>
                {workoutDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.workoutTime}>
                {workoutDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Workout Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          
          {renderWorkoutSpecificDetails()}

          {workout.intensity && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Intensity Level</Text>
              <View style={styles.intensityContainer}>
                <Text style={styles.intensityValue}>{workout.intensity}/10</Text>
                <View style={styles.intensityBar}>
                  <View 
                    style={[
                      styles.intensityFill,
                      { 
                        width: `${(workout.intensity / 10) * 100}%`,
                        backgroundColor: 
                          workout.intensity >= 8 ? '#FF6B6B' : 
                          workout.intensity >= 6 ? colors.primary : 
                          '#4CAF50' 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          )}

          {workout.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          )}
        </View>

        {/* Performance Summary */}
        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>
                {new Date(workout.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.performanceLabel}>Completed</Text>
            </View>
            
            {workout.intensity && (
              <View style={styles.performanceItem}>
                <Text style={[
                  styles.performanceValue,
                  { 
                    color: workout.intensity >= 8 ? '#FF6B6B' : 
                          workout.intensity >= 6 ? colors.primary : 
                          '#4CAF50' 
                  }
                ]}>
                  {workout.intensity >= 8 ? 'High' :
                   workout.intensity >= 6 ? 'Moderate' :
                   'Light'}
                </Text>
                <Text style={styles.performanceLabel}>Intensity</Text>
              </View>
            )}

            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>
                {workout.type === 'bagwork' || workout.type === 'sparring' ? 
                  (workout.rounds ? `${workout.rounds} rounds` : '—') :
                 workout.type === 'cardio' && workout.distance ?
                  `${workout.distance} miles` :
                 workout.type === 'strength' && workout.sets ?
                  `${workout.sets} sets` : '—'
                }
              </Text>
              <Text style={styles.performanceLabel}>
                {workout.type === 'bagwork' || workout.type === 'sparring' ? 'Rounds' :
                 workout.type === 'cardio' ? 'Distance' :
                 workout.type === 'strength' ? 'Sets' : 'Volume'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={handleDelete}
          >
            <Text style={styles.deleteBtnText}>🗑️ Delete Workout</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backBtn: {
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 15,
  },
  backBtnText: {
    color: colors.text,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  workoutTime: {
    fontSize: 14,
    color: colors.border,
  },
  detailsCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  intensityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 10,
    minWidth: 35,
  },
  intensityBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.dark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
  },
  notesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginTop: 8,
  },
  performanceCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 40,
  },
  deleteBtn: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
});