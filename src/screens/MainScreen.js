import React from 'react';
import { View, StyleSheet } from 'react-native';
import MissionMenu from '../components/MissionMenu';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <MissionMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainScreen;
