import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Update to your deployed backend URL later

export default function App() {
  const [module, setModule] = useState(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.state === 5) { // Gesture ended
      const { translationX, translationY } = nativeEvent;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 50) setModule('Connections');
        else if (translationX < -50) setModule('Wellness');
      } else {
        if (translationY > 50) setModule('Tasks');
        else if (translationY < -50) setModule('Insights');
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    } else {
      translateX.value = nativeEvent.translationX;
      translateY.value = nativeEvent.translationY;
    }
  };

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/insights`);
      console.log(response.data);
      // Update UI with fetched data in a real app
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {!module ? (
        <View style={styles.home}>
          <Animated.View style={[styles.orb, orbStyle]}>
            <PanGestureHandler onGestureEvent={handleGesture}>
              <Animated.View style={styles.orbInner} />
            </PanGestureHandler>
          </Animated.View>
          <Text style={styles.hint}>Swipe to Begin</Text>
        </View>
      ) : (
        <View style={styles.module}>
          <Text style={styles.title}>{module}</Text>
          <TouchableOpacity onPress={() => { setModule(null); fetchInsights(); }}>
            <Text style={styles.back}>Back to Pulse</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  home: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orb: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#1E90FF', opacity: 0.8 },
  orbInner: { flex: 1 },
  hint: { color: '#FFF', marginTop: 20, fontSize: 16 },
  module: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  back: { color: '#1E90FF', marginTop: 20, fontSize: 18 },
});