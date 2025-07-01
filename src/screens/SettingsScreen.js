import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import {
  getFightDate,
  setFightDate,
  getTargetWeight,
  setTargetWeight,
  getUserProfile,
  saveUserProfile,
} from '../utils/storage';

export default function SettingsScreen() {
  const [fightDate, setFightDateState] = useState(null);
  const [targetWeight, setTargetWeightState] = useState(null);
  const [profile, setProfile] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const [fightDateData, targetWeightData, profileData] = await Promise.all([
        getFightDate(),
        getTargetWeight(),
        getUserProfile(),
      ]);

      setFightDateState(fightDateData);
      setTargetWeightState(targetWeightData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSetFightDate = () => {
    // Show date options
    Alert.alert(
      'Set Fight Date',
      'Choose how you want to set your fight date:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Days from now',
          onPress: () => {
            Alert.prompt(
              'Days Until Fight',
              'How many days until your fight?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Set',
                  onPress: async (days) => {
                    if (days && !isNaN(days) && parseInt(days) > 0) {
                      try {
                        const newFightDate = new Date();
                        newFightDate.setDate(newFightDate.getDate() + parseInt(days));
                        await setFightDate(newFightDate);
                        setFightDateState(newFightDate);
                        Alert.alert('Success', `Fight date set to ${newFightDate.toLocaleDateString()}`);
                      } catch (error) {
                        Alert.alert('Error', 'Failed to update fight date');
                      }
                    } else {
                      Alert.alert('Error', 'Please enter a valid number of days');
                    }
                  },
                },
              ],
              'plain-text',
              fightDate ? Math.ceil((fightDate - new Date()) / (1000 * 60 * 60 * 24)).toString() : '30',
              'numeric'
            );
          }
        },
        {
          text: 'Specific date',
          onPress: () => {
            Alert.prompt(
              'Fight Date',
              'Enter your fight date (MM/DD/YYYY):',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Set',
                  onPress: async (dateString) => {
                    if (dateString) {
                      try {
                        const newDate = new Date(dateString);
                        if (isNaN(newDate.getTime())) {
                          Alert.alert('Error', 'Please enter a valid date in MM/DD/YYYY format');
                          return;
                        }
                        if (newDate <= new Date()) {
                          Alert.alert('Error', 'Fight date must be in the future');
                          return;
                        }
                        await setFightDate(newDate);
                        setFightDateState(newDate);
                        Alert.alert('Success', `Fight date set to ${newDate.toLocaleDateString()}`);
                      } catch (error) {
                        Alert.alert('Error', 'Failed to update fight date');
                      }
                    }
                  },
                },
              ],
              'plain-text',
              fightDate ? fightDate.toLocaleDateString() : ''
            );
          }
        }
      ]
    );
  };

  const handleSetTargetWeight = () => {
    Alert.prompt(
      'Set Target Weight',
      'Enter your fight weight in pounds:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: async (weight) => {
            if (weight && !isNaN(weight)) {
              const weightValue = parseFloat(weight);
              if (weightValue <= 0 || weightValue > 500) {
                Alert.alert('Error', 'Please enter a realistic weight between 1-500 lbs');
                return;
              }
              try {
                await setTargetWeight(weightValue);
                setTargetWeightState(weightValue);
                Alert.alert('Success', `Target weight set to ${weightValue} lbs`);
              } catch (error) {
                Alert.alert('Error', 'Failed to update target weight');
              }
            } else {
              Alert.alert('Error', 'Please enter a valid weight');
            }
          },
        },
      ],
      'plain-text',
      targetWeight ? targetWeight.toString() : '155',
      'decimal-pad'
    );
  };

  const handleSetProfile = () => {
    Alert.prompt(
      'Fighter Name',
      'Enter your name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (name) => {
            if (name?.trim()) {
              try {
                const newProfile = { ...profile, name: name.trim() };
                await saveUserProfile(newProfile);
                setProfile(newProfile);
                Alert.alert('Success', 'Profile updated!');
              } catch (error) {
                Alert.alert('Error', 'Failed to update profile');
              }
            } else {
              Alert.alert('Error', 'Please enter a valid name');
            }
          },
        },
      ],
      'plain-text',
      profile?.name || ''
    );
  };

  const handleQuickFightDates = () => {
    Alert.alert(
      'Quick Fight Date Setup',
      'Choose a common fight camp duration:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '4 weeks', 
          onPress: () => setQuickFightDate(28)
        },
        { 
          text: '6 weeks', 
          onPress: () => setQuickFightDate(42)
        },
        { 
          text: '8 weeks', 
          onPress: () => setQuickFightDate(56)
        },
        { 
          text: '12 weeks', 
          onPress: () => setQuickFightDate(84)
        },
      ]
    );
  };

  const setQuickFightDate = async (days) => {
    try {
      const newFightDate = new Date();
      newFightDate.setDate(newFightDate.getDate() + days);
      await setFightDate(newFightDate);
      setFightDateState(newFightDate);
      Alert.alert('Success', `Fight date set to ${newFightDate.toLocaleDateString()} (${days} days)`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update fight date');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your workouts, weight entries, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              await AsyncStorage.clear();
              
              setFightDateState(null);
              setTargetWeightState(null);
              setProfile(null);
              
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilFight = () => {
    if (!fightDate) return null;
    const days = Math.ceil((fightDate - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>SETTINGS</Text>
          <Text style={styles.subtitle}>Configure Your Fight Camp</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSetProfile}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>👤</Text>
              <View>
                <Text style={styles.settingTitle}>Fighter Name</Text>
                <Text style={styles.settingSubtitle}>
                  {profile?.name || 'Tap to set your name'}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Fight Camp Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fight Camp</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSetFightDate}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📅</Text>
              <View>
                <Text style={styles.settingTitle}>Fight Date</Text>
                <Text style={styles.settingSubtitle}>
                  {fightDate ? 
                    `${formatDate(fightDate)} (${getDaysUntilFight()} days)` : 
                    'Tap to set your fight date'
                  }
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Quick Fight Date Setup */}
          <TouchableOpacity style={styles.settingItem} onPress={handleQuickFightDates}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⚡</Text>
              <View>
                <Text style={styles.settingTitle}>Quick Camp Setup</Text>
                <Text style={styles.settingSubtitle}>
                  Set common fight camp durations (4, 6, 8, 12 weeks)
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSetTargetWeight}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎯</Text>
              <View>
                <Text style={styles.settingTitle}>Target Weight</Text>
                <Text style={styles.settingSubtitle}>
                  {targetWeight ? `${targetWeight} lbs` : 'Tap to set your fight weight'}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]} 
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🗑️</Text>
              <View>
                <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
                <Text style={styles.settingSubtitle}>
                  Permanently delete all workouts and settings
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <View>
                <Text style={styles.settingTitle}>Fight Camp Tracker</Text>
                <Text style={styles.settingSubtitle}>Version 1.0.0</Text>
              </View>
            </View>
          </View>
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
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  settingItem: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    flexWrap: 'wrap',
  },
  chevron: {
    fontSize: 18,
    color: colors.border,
    fontWeight: 'bold',
  },
  dangerItem: {
    borderColor: '#FF6B6B',
  },
  dangerText: {
    color: '#FF6B6B',
  },
});