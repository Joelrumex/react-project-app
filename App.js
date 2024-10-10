import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  const [count, setCount] = useState(34543534);
  const [chickens, setChickens] = useState(1); // Inicializa gallinas en 1
  const [pigs, setPigs] = useState(0); // Inicializa cerdos en 0
  const [cows, setCows] = useState(0); // Inicializa vacas en 0
  const [sheep, setSheep] = useState(0); // Inicializa ovejas en 0
  const [goats, setGoats] = useState(0); // Inicializa cabras en 0
  const [showStore, setShowStore] = useState(false); // Estado para controlar la visibilidad de la tienda

  const [unlockedAnimals, setUnlockedAnimals] = useState([true, false, false, false, false]); // Estado para animales desbloqueados

  const totalAnimals = chickens + pigs + cows + sheep + goats; // Calcula el total de animales

  // Función para incrementar el número
  const handleClick = () => {
    const points =
      chickens * 1 + pigs * 2 + cows * 3 + sheep * 4 + goats * 5; // Calcula puntos totales
    setCount(count + points); // Actualiza la puntuación
  };

  // Función para abrir o cerrar la tienda
  const handleStoreClick = () => {
    setShowStore(!showStore); // Cambia el estado de la tienda
  };

  // Obtenemos las dimensiones de la pantalla del dispositivo
  const { width, height } = Dimensions.get('window');

  // Información de los artículos en la tienda
  const storeItems = [
    { name: 'Gallina', price: 10, level: 1, source: require('./assets/CluckingChickenIdleSide.gif') },
    { name: 'Cerdo', price: 25, level: 2, source: require('./assets/DaintyPigIdleSide.gif') },
    { name: 'Vaca', price: 125, level: 3, source: require('./assets/GrazingCowIdleSide.gif') },
    { name: 'Oveja', price: 520, level: 4, source: require('./assets/PasturingSheepIdleSide.gif') },
    { name: 'Cabra', price: 700, level: 5, source: require('./assets/NibblingGoatIdleSide.gif') },
  ];

  // Función para encontrar el animal de menor nivel
  const findLowestLevelAnimal = () => {
    const animals = [
      { name: 'Gallina', count: chickens, level: 1 },
      { name: 'Cerdo', count: pigs, level: 2 },
      { name: 'Vaca', count: cows, level: 3 },
      { name: 'Oveja', count: sheep, level: 4 },
      { name: 'Cabra', count: goats, level: 5 },
    ];

    return animals.reduce((lowest, animal) => {
      return animal.count > 0 && animal.level < lowest.level ? animal : lowest;
    }, { level: Infinity });
  };

  const handlePurchase = (item) => {
    if (count >= item.price) {
        let newTotalAnimals = totalAnimals; // Variable para manejar el total de animales
        
        if (totalAnimals < 5) {
            setCount(count - item.price); // Deduce el precio del item
            // Incrementa el número de animales según el tipo
            if (item.name === 'Gallina') {
                setChickens(chickens + 1);
            } else if (item.name === 'Cerdo') {
                setPigs(pigs + 1);
            } else if (item.name === 'Vaca') {
                setCows(cows + 1);
            } else if (item.name === 'Oveja') {
                setSheep(sheep + 1);
            } else if (item.name === 'Cabra') {
                setGoats(goats + 1);
            }
            newTotalAnimals += 1; // Incrementa el total de animales

        } else {
            // Si ya hay 5 animales, sustituir el de menor nivel
            const lowestAnimal = findLowestLevelAnimal();
            if (lowestAnimal.count > 0 && lowestAnimal.level < item.level) {
                // Disminuye el conteo del animal de menor nivel
                if (lowestAnimal.name === 'Gallina') setChickens(chickens - 1);
                else if (lowestAnimal.name === 'Cerdo') setPigs(pigs - 1);
                else if (lowestAnimal.name === 'Vaca') setCows(cows - 1);
                else if (lowestAnimal.name === 'Oveja') setSheep(sheep - 1);
                else if (lowestAnimal.name === 'Cabra') setGoats(goats - 1);
                
                // Añade el nuevo animal
                if (item.name === 'Gallina') setChickens(chickens + 1);
                else if (item.name === 'Cerdo') setPigs(pigs + 1);
                else if (item.name === 'Vaca') setCows(cows + 1);
                else if (item.name === 'Oveja') setSheep(sheep + 1);
                else if (item.name === 'Cabra') setGoats(goats + 1);
                
                setCount(count - item.price); // Deduce el precio del item
            }
        }
                    // Desbloquear el siguiente animal si se llegan a 5 de uno
                    if (item.name === 'Gallina' && chickens + 1 === 5) {
                      setUnlockedAnimals([false, true, false, false, false]); // Desbloquea el cerdo
                  } else if (item.name === 'Cerdo' && pigs + 1 === 5) {
                      setUnlockedAnimals([false, false, true, false, false]); // Desbloquea la vaca
                  } else if (item.name === 'Vaca' && cows + 1 === 5) {
                      setUnlockedAnimals([false, false, false, true, false]); // Desbloquea la oveja
                  } else if (item.name === 'Oveja' && sheep + 1 === 5) {
                      setUnlockedAnimals([false, false, false, false, true]); // Desbloquea la cabra
                  }

        // Actualiza el total de animales después de las modificaciones
        setTotalAnimals(newTotalAnimals);
    } else {
        alert('No tienes suficientes monedas!'); // Mensaje de error si no se tienen suficientes monedas
    }
};

  // Función para verificar si un artículo está disponible para compra
  const isItemAvailable = (item) => {
    const animalIndex = storeItems.findIndex(storeItem => storeItem.name === item.name);
    return unlockedAnimals[animalIndex]; // Verifica si el animal está desbloqueado
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // Ruta de la imagen de fondo
      style={[styles.background, { width: width, height: height }]} // Ajusta el ancho y alto del fondo
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Puntuación en la parte superior derecha */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        
        <Text style={styles.instructions}>Click the animals to increase the count!</Text>
        
        {/* Renderizamos los animales */}
        <View style={styles.chickenContainer}>
          {[...Array(chickens)].map((_, index) => (
            <TouchableOpacity key={`chicken-${index}`} onPress={handleClick}>
              <Image style={styles.chickenGif} source={require('./assets/CluckingChickenIdleSide.gif')} />
            </TouchableOpacity>
          ))}
          {[...Array(pigs)].map((_, index) => (
            <TouchableOpacity key={`pig-${index}`} onPress={handleClick}>
              <Image style={styles.chickenGif} source={require('./assets/DaintyPigIdleSide.gif')} />
            </TouchableOpacity>
          ))}
          {[...Array(cows)].map((_, index) => (
            <TouchableOpacity key={`cow-${index}`} onPress={handleClick}>
              <Image style={styles.chickenGif} source={require('./assets/GrazingCowIdleSide.gif')} />
            </TouchableOpacity>
          ))}
          {[...Array(sheep)].map((_, index) => (
            <TouchableOpacity key={`sheep-${index}`} onPress={handleClick}>
              <Image style={styles.chickenGif} source={require('./assets/PasturingSheepIdleSide.gif')} />
            </TouchableOpacity>
          ))}
          {[...Array(goats)].map((_, index) => (
            <TouchableOpacity key={`goat-${index}`} onPress={handleClick}>
              <Image style={styles.chickenGif} source={require('./assets/NibblingGoatIdleSide.gif')} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de tienda */}
        <TouchableOpacity style={styles.storeButton} onPress={handleStoreClick}>
          <Text style={styles.storeButtonText}>Tienda</Text>
        </TouchableOpacity>

        {/* Componente de la tienda */}
        {showStore && (
          <View style={styles.storeContainer}>
            <Text style={styles.storeTitle}>Bienvenido a la Tienda</Text>
            {storeItems.map((item, index) => (
              <View key={index} style={styles.storeItemContainer}>
                <Image style={styles.storeItemGif} source={item.source} />
                <Text style={[styles.storeItem, { color: isItemAvailable(item) ? '#000' : '#aaa' }]}>
                  {item.name}: {item.price} monedas
                </Text>
                <TouchableOpacity onPress={() => handlePurchase(item)} disabled={!isItemAvailable(item)}>
                  <Text style={[styles.purchaseButton, { color: isItemAvailable(item) ? '#007bff' : '#aaa' }]}>
                    Comprar
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.closeButton} onPress={handleStoreClick}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  chickenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chickenGif: {
    width: 100,
    height: 100,
    margin: 5,
  },
  storeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  storeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  storeContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Sombra en Android
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  storeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  storeItemGif: {
    width: 50, // Ajusta el tamaño de los GIFs en la tienda
    height: 50,
    marginRight: 10,
  },
  storeItem: {
    fontSize: 16,
  },
  purchaseButton: {
    marginLeft: 10,
    textDecorationLine: 'underline', // Subrayado para indicar que es un enlace
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
