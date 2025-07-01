import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { colors } from '../styles/colors';
import { saveWeightEntry } from '../utils/storage';

export default function WeightLoggerScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;

    if (!weight || isNaN(weight)) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const weightValue = parseFloat(weight);
    if (weightValue <= 0 || weightValue > 500) {
      Alert.alert('Error', 'Please enter a realistic weight between 1-500 lbs');
      return;
    }

    setSaving(true);

    try {
      await saveWeightEntry(weightValue);
      
      Alert.alert(
        'Success!', 
        'Weight logged successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving weight:', error);
      Alert.alert('Error', 'Failed to save weight. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const quickWeights = [150, 155, 160, 165, 170, 175, 180];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Weight</Text>
        </View>

        {/* Weight Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Today's Weight</Text>
          
          <View style={styles.weightInputContainer}>
            <TextInput
              style={styles.weightInput}
              placeholder="Enter weight"
              placeholderTextColor={colors.textSecondary}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              autoFocus
              returnKeyType="done"
            />
            <Text style={styles.unitLabel}>lbs</Text>
          </View>

          {/* Quick Weight Buttons */}
          <View style={styles.quickWeights}>
            <Text style={styles.quickLabel}>Quick Select:</Text>
            <View style={styles.quickWeightGrid}>
              {quickWeights.map((quickWeight, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickWeightBtn,
                    parseFloat(weight) === quickWeight && styles.quickWeightBtnActive
                  ]}
                  onPress={() => setWeight(quickWeight.toString())}
                >
                  <Text style={[
                    styles.quickWeightText,
                    parseFloat(weight) === quickWeight && styles.quickWeightTextActive
                  ]}>
                    {quickWeight}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How are you feeling? Any observations..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
            maxLength={500}
          />
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.fixedActionButtons}>
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
            {saving ? 'Saving...' : 'Save Weight'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  inputSection: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  weightInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    paddingVertical: 16,
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  quickWeights: {
    marginTop: 10,
  },
  quickLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  quickWeightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickWeightBtn: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  quickWeightBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickWeightText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  quickWeightTextActive: {
    color: colors.darkest,
    fontWeight: 'bold',
  },
  notesSection: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesInput: {
    backgroundColor: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 150,
  },
  fixedActionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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