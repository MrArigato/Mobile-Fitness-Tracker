import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    subscribe();
    return () => {
      Pedometer.stopUpdates();
    };
  }, []);

  const subscribe = () => {
    Pedometer.isAvailableAsync().then(
      result => {
        setIsPedometerAvailable(String(result));
      },
      error => {
        setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error);
      }
    );

    Pedometer.watchStepCount(result => {
      setCurrentStepCount(result.steps);
    });

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);

    Pedometer.getStepCountAsync(start, end).then(
      result => {
        setPastStepCount(result.steps);
      },
      error => {
        setPastStepCount('Could not get stepCount: ' + error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
});
