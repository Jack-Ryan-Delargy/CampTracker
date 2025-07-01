import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  StatusBar,
  Alert 
} from 'react-native';
import { colors } from '../styles/colors';
import { saveWorkout } from '../utils/storage';

export default function WorkoutLoggerScreen({ navigation, route }) {
  const [selectedType, setSelectedType] = useState(route.params?.type || 'bagwork');
  const [rounds, setRounds] = useState('6');
  const [duration, setDuration] = useState('3:00');
  const [rest, setRest] = useState('1:00');
  const [intensity, setIntensity] = useState(7);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const workoutTypes = [
    { id: 'bagwork', icon: '🥊', name: 'Bag Work' },
    { id: 'cardio', icon: '🏃', name: 'Cardio' },
    { id: 'strength', icon: '💪', name: 'Strength' },
    { id: 'sparring', icon: '🥋', name: 'Sparring' },
  ];

  const handleSave = async () => {
    if (saving) return;

    // Basic validation
    if (!selectedType) {
      Alert.alert('Error', 'Please select a workout type');
      return;
    }

    if (selectedType === 'bagwork' || selectedType === 'sparring') {
      if (!rounds || !duration) {
        Alert.alert('Error', 'Please enter rounds and duration');
        return;
      }
    }

    setSaving(true);

    try {
      const workout = {
        type: selectedType,
        rounds: rounds || null,
        duration: duration || null,
        rest: rest || null,
        intensity: intensity,
        notes: notes.trim() || null,
      };

      await saveWorkout(workout);
      
      Alert.alert(
        'Success!', 
        'Workout saved successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          <Text style={styles.headerTitle}>Log Workout</Text>
        </View>

        {/* Workout Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Type</Text>
          <View style={styles.typeGrid}>
            {workoutTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeBtn,
                  selectedType === type.id && styles.typeBtnActive
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={styles.typeText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Details */}
        <View style={styles.workoutDetails}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rounds & Duration</Text>
            <View style={styles.roundsContainer}>
              <TextInput
                style={[styles.inputField, styles.roundsInput]}
                placeholder="Rounds"
                placeholderTextColor={colors.textSecondary}
                value={rounds}
                onChangeText={setRounds}
                keyboardType="numeric"
              />
              <Text style={styles.multiplier}>×</Text>
              <TextInput
                style={[styles.inputField, styles.durationInput]}
                placeholder="3:00"
                placeholderTextColor={colors.textSecondary}
                value={duration}
                onChangeText={setDuration}
              />
            </View>
            <View style={styles.quickSets}>
              {['3×3min', '5×3min', '6×3min', '10×3min'].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.quickSetBtn}
                  onPress={() => {
                    const [r, d] = preset.split('×');
                    setRounds(r);
                    setDuration(d);
                  }}
                >
                  <Text style={styles.quickSetText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rest Between Rounds</Text>
            <TextInput
              style={styles.inputField}
              placeholder="1:00"
              placeholderTextColor={colors.textSecondary}
              value={rest}
              onChangeText={setRest}
            />
            <View style={styles.quickSets}>
              {['30sec', '1min', '1:30', '2min'].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.quickSetBtn}
                  onPress={() => setRest(preset)}
                >
                  <Text style={styles.quickSetText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Intensity Level</Text>
            <View style={styles.intensityContainer}>
              <Text style={styles.currentValue}>{intensity}/10</Text>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Light</Text>
                <Text style={styles.sliderLabel}>Moderate</Text>
                <Text style={styles.sliderLabel}>Hard</Text>
                <Text style={styles.sliderLabel}>Max</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesTextarea}
            placeholder="How did it feel? Focus areas, techniques worked on..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.btnSecondary}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnPrimary, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.btnPrimaryText}>
              {saving ? 'Saving...' : 'Save Workout'}
            </Text>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeBtn: {
    backgroundColor: colors.tertiary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  typeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  workoutDetails: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.primary,
  },
  inputField: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  roundsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundsInput: {
    flex: 1,
    marginRight: 8,
  },
  multiplier: {
    color: colors.border,
    marginHorizontal: 8,
    fontSize: 16,
  },
  durationInput: {
    flex: 1,
    marginLeft: 8,
  },
  quickSets: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  quickSetBtn: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quickSetText: {
    color: colors.primary,
    fontSize: 12,
  },
  intensityContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.border,
  },
  notesTextarea: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 14,
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    marginRight: 6,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    marginLeft: 6,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.darkest,
    fontSize: 16,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});