import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Alert,
  Vibration 
} from 'react-native';
import { colors } from '../styles/colors';

export default function BoxingTimerScreen() {
  const [rounds, setRounds] = useState(3);
  const [roundTime, setRoundTime] = useState(180); // 3 minutes in seconds
  const [restTime, setRestTime] = useState(60); // 1 minute in seconds
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for current phase
            handlePhaseComplete();
            return isResting ? roundTime : restTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isResting, roundTime, restTime, isFinished]);

  const handlePhaseComplete = () => {
    // Vibrate and sound notification
    Vibration.vibrate([500, 500, 500]);
    
    if (isResting) {
      // Rest period over, start next round
      if (currentRound >= rounds) {
        // All rounds complete
        setIsFinished(true);
        setIsRunning(false);
        Alert.alert('🥊 Workout Complete!', `Great job! You completed all ${rounds} rounds.`);
      } else {
        setCurrentRound(prev => prev + 1);
        setIsResting(false);
        setTimeLeft(roundTime);
      }
    } else {
      // Round over, start rest period
      if (currentRound < rounds) {
        setIsResting(true);
        setTimeLeft(restTime);
      } else {
        // Last round finished
        setIsFinished(true);
        setIsRunning(false);
        Alert.alert('🥊 Workout Complete!', `Excellent work! You completed all ${rounds} rounds.`);
      }
    }
  };

  const startTimer = () => {
    if (isFinished) {
      resetTimer();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setIsFinished(false);
    setCurrentRound(1);
    setTimeLeft(roundTime);
  };

  const adjustRounds = (change) => {
    if (!isRunning) {
      const newRounds = Math.max(1, Math.min(20, rounds + change));
      setRounds(newRounds);
    }
  };

  const adjustRoundTime = (change) => {
    if (!isRunning) {
      const newTime = Math.max(30, Math.min(600, roundTime + change));
      setRoundTime(newTime);
      if (!isResting) {
        setTimeLeft(newTime);
      }
    }
  };

  const adjustRestTime = (change) => {
    if (!isRunning) {
      const newTime = Math.max(15, Math.min(300, restTime + change));
      setRestTime(newTime);
      if (isResting) {
        setTimeLeft(newTime);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isFinished) return '#4CAF50';
    if (isResting) return '#FFA726';
    if (timeLeft <= 10) return '#FF6B6B';
    return colors.primary;
  };

  const presetConfigs = [
    { name: 'Boxing Training', rounds: 6, roundTime: 180, restTime: 60 },
    { name: 'Sparring', rounds: 8, roundTime: 180, restTime: 60 },
    { name: 'Heavy Bag', rounds: 5, roundTime: 180, restTime: 90 },
    { name: 'Speed Bag', rounds: 3, roundTime: 120, restTime: 30 },
    { name: 'HIIT Training', rounds: 10, roundTime: 45, restTime: 15 },
    { name: 'Pro Fight', rounds: 12, roundTime: 180, restTime: 60 },
  ];

  const loadPreset = (preset) => {
    if (!isRunning) {
      setRounds(preset.rounds);
      setRoundTime(preset.roundTime);
      setRestTime(preset.restTime);
      resetTimer();
      setTimeLeft(preset.roundTime);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>BOXING TIMER</Text>
          <Text style={styles.subtitle}>Professional Round Timer</Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <View style={styles.roundInfo}>
            <Text style={styles.roundText}>
              {isFinished ? 'COMPLETE!' : 
               isResting ? 'REST' : 
               `ROUND ${currentRound}`}
            </Text>
            <Text style={styles.roundSubtext}>
              {isFinished ? `${rounds} rounds finished` :
               isResting ? `Round ${currentRound} of ${rounds}` :
               `of ${rounds} rounds`}
            </Text>
          </View>

          <View style={[styles.timerDisplay, { borderColor: getTimerColor() }]}>
            <Text style={[styles.timeText, { color: getTimerColor() }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          <Text style={styles.phaseText}>
            {isFinished ? '🏆 Workout Complete!' :
             isResting ? '💨 Rest Period' :
             '🥊 Fight Time!'}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          {!isRunning ? (
            <TouchableOpacity 
              style={[styles.controlBtn, styles.startBtn]}
              onPress={startTimer}
            >
              <Text style={styles.controlBtnText}>
                {isFinished ? '🔄 New Workout' : '▶️ Start'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.controlBtn, styles.pauseBtn]}
              onPress={pauseTimer}
            >
              <Text style={styles.controlBtnText}>⏸️ Pause</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.controlBtn, styles.resetBtn]}
            onPress={resetTimer}
          >
            <Text style={styles.controlBtnText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        {!isRunning && (
          <>
            <View style={styles.settingsContainer}>
              <Text style={styles.settingsTitle}>Timer Settings</Text>
              
              {/* Rounds */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Rounds</Text>
                <View style={styles.settingControls}>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRounds(-1)}
                  >
                    <Text style={styles.adjustBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.settingValue}>{rounds}</Text>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRounds(1)}
                  >
                    <Text style={styles.adjustBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Round Time */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Round Time</Text>
                <View style={styles.settingControls}>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRoundTime(-30)}
                  >
                    <Text style={styles.adjustBtnText}>-30s</Text>
                  </TouchableOpacity>
                  <Text style={styles.settingValue}>{formatTime(roundTime)}</Text>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRoundTime(30)}
                  >
                    <Text style={styles.adjustBtnText}>+30s</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rest Time */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Rest Time</Text>
                <View style={styles.settingControls}>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRestTime(-15)}
                  >
                    <Text style={styles.adjustBtnText}>-15s</Text>
                  </TouchableOpacity>
                  <Text style={styles.settingValue}>{formatTime(restTime)}</Text>
                  <TouchableOpacity 
                    style={styles.adjustBtn}
                    onPress={() => adjustRestTime(15)}
                  >
                    <Text style={styles.adjustBtnText}>+15s</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Presets */}
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsTitle}>Quick Presets</Text>
              <View style={styles.presetGrid}>
                {presetConfigs.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.presetBtn}
                    onPress={() => loadPreset(preset)}
                  >
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text style={styles.presetDetails}>
                      {preset.rounds}R × {formatTime(preset.roundTime)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>How to Use:</Text>
          <Text style={styles.instructionText}>• Set your rounds and time preferences</Text>
          <Text style={styles.instructionText}>• Choose a preset or customize your own</Text>
          <Text style={styles.instructionText}>• Your phone will vibrate between rounds</Text>
          <Text style={styles.instructionText}>• Perfect for bag work, sparring, and HIIT</Text>
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  roundInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roundText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  roundSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  timerDisplay: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.tertiary,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  controlBtn: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#4CAF50',
  },
  pauseBtn: {
    backgroundColor: '#FFA726',
  },
  resetBtn: {
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingsContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustBtn: {
    backgroundColor: colors.dark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  adjustBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 60,
    textAlign: 'center',
  },
  presetsContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetBtn: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    padding: 12,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  presetDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  instructions: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
});