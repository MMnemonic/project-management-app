import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (isInitialCheck) setIsInitialCheck(false);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setIsInitialCheck(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isInitialCheck };
}; 