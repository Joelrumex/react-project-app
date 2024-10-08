import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  const [count, setCount] = useState(0);

  // Funció per incrementar el número
  const handleClick = () => {
    setCount(count + 1);
  };

  // Obtenim les dimensions de la pantalla del dispositiu
  const { width, height } = Dimensions.get('window');

  // Calcular quantes gallines apareixen basant-se en el nombre de clics
  const numberOfChickens = Math.floor(count / 50) + 1; // Afegim 1 per la gallina inicial

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // Ruta de la imatge de fons
      style={[styles.background, { width: width, height: height }]} // Ajusta l'amplada i alçada del fons
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Puntuació a la part superior dreta */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        
        <Text style={styles.instructions}>Click the chickens to increase the count!</Text>
        
        {/* Renderitzem les gallines */}
        <View style={styles.chickenContainer}>
          {[...Array(numberOfChickens)].map((_, index) => (
            <TouchableOpacity key={index} onPress={handleClick}>
              <Image
                style={styles.chickenGif}
                source={require('./assets/CluckingChickenIdleSide.gif')} // Ruta del GIF
              />
            </TouchableOpacity>
          ))}
        </View>

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
    color: '#fff',
  },
  instructions: {
    marginBottom: 20,
    fontSize: 16,
    color: '#fff',
  },
  chickenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Permet que les gallines es distribueixin en múltiples files
    justifyContent: 'center',
    alignItems: 'center',
  },
  chickenGif: {
    width: 20,
    height: 20,
    margin: 10, // Afegeix espai entre les gallines
  },
});
