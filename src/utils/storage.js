import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for different data types
const KEYS = {
  WORKOUTS: 'fight_camp_workouts',
  WEIGHT_ENTRIES: 'fight_camp_weight',
  FIGHT_DATE: 'fight_camp_fight_date',
  TARGET_WEIGHT: 'fight_camp_target_weight',
  USER_PROFILE: 'fight_camp_profile',
};

// Workout Storage
export const saveWorkout = async (workout) => {
  try {
    const existingWorkouts = await getWorkouts();
    const newWorkout = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...workout,
    };
    const updatedWorkouts = [newWorkout, ...existingWorkouts];
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(updatedWorkouts));
    return newWorkout;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

export const getWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem(KEYS.WORKOUTS);
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const workouts = await getWorkouts();
    const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filteredWorkouts));
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// Weight Storage
export const saveWeightEntry = async (weight, date = new Date()) => {
  try {
    const existingEntries = await getWeightEntries();
    const newEntry = {
      id: Date.now().toString(),
      weight: parseFloat(weight),
      date: date.toISOString(),
      timestamp: new Date().toISOString(),
    };
    
    // Remove any existing entry for the same date
    const filteredEntries = existingEntries.filter(
      entry => !isSameDay(new Date(entry.date), date)
    );
    
    const updatedEntries = [newEntry, ...filteredEntries].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    
    await AsyncStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(updatedEntries));
    return newEntry;
  } catch (error) {
    console.error('Error saving weight entry:', error);
    throw error;
  }
};

export const getWeightEntries = async () => {
  try {
    const entries = await AsyncStorage.getItem(KEYS.WEIGHT_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting weight entries:', error);
    return [];
  }
};

export const getTodayWeight = async () => {
  try {
    const entries = await getWeightEntries();
    const today = new Date();
    return entries.find(entry => isSameDay(new Date(entry.date), today));
  } catch (error) {
    console.error('Error getting today weight:', error);
    return null;
  }
};

export const getWeightTrend = async (days = 7) => {
  try {
    const entries = await getWeightEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = entries.filter(
      entry => new Date(entry.date) >= cutoffDate
    );
    
    if (recentEntries.length < 2) return null;
    
    const oldest = recentEntries[recentEntries.length - 1];
    const newest = recentEntries[0];
    const difference = newest.weight - oldest.weight;
    
    return {
      change: difference,
      period: days,
      direction: difference < 0 ? 'down' : difference > 0 ? 'up' : 'stable',
    };
  } catch (error) {
    console.error('Error calculating weight trend:', error);
    return null;
  }
};

// Fight Date Storage
export const setFightDate = async (date) => {
  try {
    await AsyncStorage.setItem(KEYS.FIGHT_DATE, date.toISOString());
  } catch (error) {
    console.error('Error setting fight date:', error);
    throw error;
  }
};

export const getFightDate = async () => {
  try {
    const date = await AsyncStorage.getItem(KEYS.FIGHT_DATE);
    return date ? new Date(date) : null;
  } catch (error) {
    console.error('Error getting fight date:', error);
    return null;
  }
};

export const getDaysUntilFight = async () => {
  try {
    const fightDate = await getFightDate();
    if (!fightDate) return null;
    
    const today = new Date();
    const diffTime = fightDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days until fight:', error);
    return null;
  }
};

// Target Weight Storage
export const setTargetWeight = async (weight) => {
  try {
    await AsyncStorage.setItem(KEYS.TARGET_WEIGHT, weight.toString());
  } catch (error) {
    console.error('Error setting target weight:', error);
    throw error;
  }
};

export const getTargetWeight = async () => {
  try {
    const weight = await AsyncStorage.getItem(KEYS.TARGET_WEIGHT);
    return weight ? parseFloat(weight) : null;
  } catch (error) {
    console.error('Error getting target weight:', error);
    return null;
  }
};

// User Profile Storage
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Utility Functions
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const formatWorkoutForDisplay = (workout) => {
  const timeAgo = getTimeAgo(new Date(workout.timestamp));
  let details = '';
  
  switch (workout.type) {
    case 'bagwork':
    case 'sparring':
      if (workout.rounds && workout.duration) {
        details = `${workout.rounds} rounds × ${workout.duration}`;
      } else {
        details = 'Boxing training';
      }
      break;
      
    case 'cardio':
      if (workout.cardioType === 'sprints') {
        if (workout.sprints && workout.sprintDistance) {
          details = `${workout.sprints} × ${workout.sprintDistance}m sprints`;
        } else {
          details = 'Sprint training';
        }
      } else if (workout.cardioType === 'longrun') {
        if (workout.distance && workout.time) {
          details = `${workout.distance} miles in ${workout.time}`;
        } else if (workout.distance) {
          details = `${workout.distance} mile run`;
        } else {
          details = 'Long run';
        }
      } else {
        details = workout.distance ? `${workout.distance} miles` : 'Cardio training';
      }
      break;
      
    case 'strength':
      if (workout.exercises) {
        const shortExercises = workout.exercises.length > 30 
          ? workout.exercises.substring(0, 30) + '...' 
          : workout.exercises;
        if (workout.sets && workout.reps) {
          details = `${shortExercises} (${workout.sets}×${workout.reps})`;
        } else {
          details = shortExercises;
        }
      } else {
        details = workout.sets && workout.reps 
          ? `${workout.sets} sets × ${workout.reps} reps`
          : 'Strength training';
      }
      break;
      
    default:
      details = workout.duration || 'Workout completed';
  }
  
  return {
    ...workout,
    displayDetails: details,
    timeAgo,
  };
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
};