import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MissionItem = ({ mission, onAccept }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.description}>{mission.description}</Text>
      <Text style={styles.reward}>Recompensa: {mission.reward}</Text>
      <TouchableOpacity style={styles.button} onPress={onAccept}>
        <Text style={styles.buttonText}>Aceptar Misión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
  },
  reward: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MissionItem;
