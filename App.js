import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  const [count, setCount] = useState(0);

  // Funció per incrementar el número
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <ImageBackground 
      source={require('./assets/background.jpg')} // Ruta de la imatge de fons
      style={styles.background}
      resizeMode="cover" // Aquesta opció farà que la imatge de fons ocupi tota la pantalla
    >
      <View style={styles.container}>
        {/* Puntuació a la part superior dreta */}
        <View style={styles.counterContainer}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
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
    color: '#fff',
  },
  chickenGif: {
    width: 100,
    height: 100,
  },
});
