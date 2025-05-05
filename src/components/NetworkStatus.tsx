import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatus = () => {
  const { isConnected, isInitialCheck } = useNetworkStatus();

  // Show network status after initial check — avoids flicker on first render
  if (isInitialCheck) return null;

  return (
    <View style={[
      styles.container, 
      isConnected ? styles.online : styles.offline
    ]}>
      {/* Suggestion: use fade in/out or slide-in
          Could wrap the <View> in an Animated.View and use LayoutAnimation or Reanimated */}
      <Text style={styles.text}>
        {isConnected ? 'Online' : 'Offline - Changes will sync when online'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#FF9800',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 