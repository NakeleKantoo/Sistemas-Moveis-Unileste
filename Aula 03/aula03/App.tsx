import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import Main from '@/pages/Main';

export default function App() {
  return (
    <SafeAreaProvider>
      < Main />
    </SafeAreaProvider>
  );
}