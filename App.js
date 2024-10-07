import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  // Estat per emmagatzemar el número
  const [count, setCount] = useState(0);

  // Funció per incrementar el número
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <View style={styles.container}>
      {/* Puntuació a la part superior dreta */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{count}</Text>
      </View>
      
      <Text style={styles.instructions}>Click the button to increase the count!</Text>
      
      {/* Botó per augmentar el número */}
      <Button title="Click me!" onPress={handleClick} />
      
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
});
