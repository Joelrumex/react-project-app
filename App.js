import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  const [count, setCount] = useState(0);

  // Funció per incrementar el número
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <View style={styles.container}>
      {/* Puntuació a la part superior dreta */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{"Eggs:"}</Text>
        <Text style={styles.counterText}>{count}</Text>
      </View>
      
      <Text style={styles.instructions}>Click the chicken to increase the count!</Text>
      
      {/* GIF substituint el botó */}
      <TouchableOpacity onPress={handleClick}>
        <Image
          style={styles.chickenGif}
          source={require('./assets/CluckingChickenIdleSide.gif')} // Ruta del GIF
        />
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
  },
  counterText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  instructions: {
    marginBottom: 20,
    fontSize: 16,
  },
  chickenGif: {
    width: 20,
    height: 20,
  },
});
