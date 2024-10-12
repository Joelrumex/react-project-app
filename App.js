import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  const [count, setCount] = useState(0);
  const [chickens, setChickens] = useState(1); // Inicializa gallinas en 1
  const [pigs, setPigs] = useState(0); // Inicializa cerdos en 0
  const [cows, setCows] = useState(0); // Inicializa vacas en 0
  const [sheep, setSheep] = useState(0); // Inicializa ovejas en 0
  const [goats, setGoats] = useState(0); // Inicializa cabras en 0
  const [showStore, setShowStore] = useState(false); // Estado para controlar la visibilidad de la tienda

  const [unlockedAnimals, setUnlockedAnimals] = useState([true, false, false, false, false, true, true]); // Estado para animales desbloqueados

  const totalAnimals = chickens + pigs + cows + sheep + goats; // Calcula el total de animales

  // Multiplicador de clics
  const [clickMultiplier, setClickMultiplier] = useState(1); // Multiplicador de clics
  const [clickMultiplierActive, setClickMultiplierActive] = useState(false);
  const [autoClickerActive, setAutoClickerActive] = useState(false);
  const [multiplierTimer, setMultiplierTimer] = useState(0);
  const [autoClickerTimer, setAutoClickerTimer] = useState(0);

  // Función para calcular los puntos por clic
  const calculatePoints = () => {
    return (chickens * 1 + pigs * 2 + cows * 3 + sheep * 4 + goats * 5) * clickMultiplier;
  };

  // Función para incrementar el número
  const handleClick = () => {
    const points = calculatePoints();
    setCount((prevCount) => prevCount + points);
  };

  // Efecto para manejar el autoclicker
  useEffect(() => {
    let autoClickerInterval;

    if (autoClickerActive) {
      autoClickerInterval = setInterval(() => {
        const points = calculatePoints();
        setCount((prevCount) => prevCount + points);
        setAutoClickerTimer((prev) => {
          if (prev <= 1) {
            clearInterval(autoClickerInterval);
            setAutoClickerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
      }
    };
  }, [autoClickerActive, chickens, pigs, cows, sheep, goats, clickMultiplier]);

  // Efecto para manejar el temporizador del multiplicador
  useEffect(() => {
    let multiplierInterval;

    if (clickMultiplierActive && multiplierTimer > 0) {
      multiplierInterval = setInterval(() => {
        setMultiplierTimer((prev) => {
          if (prev <= 1) {
            clearInterval(multiplierInterval);
            setClickMultiplierActive(false);
            setClickMultiplier(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (multiplierInterval) {
        clearInterval(multiplierInterval);
      }
    };
  }, [clickMultiplierActive, multiplierTimer]);

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
    { name: 'Multiplicador de Clics', price: 1000, level: 0 }, // Nuevo artículo
    { name: 'Clicador Automático', price: 2000, level: 0 }, // Nuevo artículo
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
                      setUnlockedAnimals([false, true, false, false, false, true, true]); // Desbloquea el cerdo
                  } else if (item.name === 'Cerdo' && pigs + 1 === 5) {
                      setUnlockedAnimals([false, false, true, false, false, true, true]); // Desbloquea la vaca
                  } else if (item.name === 'Vaca' && cows + 1 === 5) {
                      setUnlockedAnimals([false, false, false, true, false, true, true]); // Desbloquea la oveja
                  } else if (item.name === 'Oveja' && sheep + 1 === 5) {
                      setUnlockedAnimals([false, false, false, false, true, true, true]); // Desbloquea la cabra
                  } else if (item.name === 'Cabra' && goats + 1 === 5) {
                      setUnlockedAnimals([false, false, false, false, false, true, true]); // Bloquea todos los animales
                  }

        // Lógica para el multiplicador de clics
        if (item.name === 'Multiplicador de Clics') {
          setClickMultiplier(2);
          setClickMultiplierActive(true);
          setMultiplierTimer(60);
          setCount(count - item.price);
        }

        // Lógica para el clicador automático
        if (item.name === 'Clicador Automático') {
          setAutoClickerActive(true);
          setAutoClickerTimer(60);
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
    if (item.name === 'Multiplicador de Clics') {
      return !clickMultiplierActive;
    }
    if (item.name === 'Clicador Automático') {
      return !autoClickerActive;
    }
    return unlockedAnimals[animalIndex];
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // Ruta de la imagen de fondo
      style={[styles.background, { width: width, height: height }]} // Ajusta el ancho y alto del fondo
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Puntuación en la parte superior */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        
        <Text style={styles.instructions}>¡Toca los animales para aumentar la puntuación!</Text>
        
        {/* Renderizamos los animales */}
        <View style={styles.animalContainer}>
          {[...Array(chickens)].map((_, index) => (
            <TouchableOpacity key={`chicken-${index}`} onPress={handleClick}>
              <Image 
                style={styles.chickenGif} 
                source={require('./assets/CluckingChickenIdleSide.gif')}
                contentFit="contain"
              />
            </TouchableOpacity>
          ))}
          {[...Array(pigs)].map((_, index) => (
            <TouchableOpacity key={`pig-${index}`} onPress={handleClick}>
              <Image 
                style={styles.chickenGif} 
                source={require('./assets/DaintyPigIdleSide.gif')}
                contentFit="contain"
              />
            </TouchableOpacity>
          ))}
          {[...Array(cows)].map((_, index) => (
            <TouchableOpacity key={`cow-${index}`} onPress={handleClick}>
              <Image 
                style={styles.chickenGif} 
                source={require('./assets/GrazingCowIdleSide.gif')}
                contentFit="contain"
              />
            </TouchableOpacity>
          ))}
          {[...Array(sheep)].map((_, index) => (
            <TouchableOpacity key={`sheep-${index}`} onPress={handleClick}>
              <Image 
                style={styles.chickenGif} 
                source={require('./assets/PasturingSheepIdleSide.gif')}
                contentFit="contain"
              />
            </TouchableOpacity>
          ))}
          {[...Array(goats)].map((_, index) => (
            <TouchableOpacity key={`goat-${index}`} onPress={handleClick}>
              <Image 
                style={styles.chickenGif} 
                source={require('./assets/NibblingGoatIdleSide.gif')}
                contentFit="contain"
              />
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
                {item.source && (
                  <Image 
                    style={styles.storeItemGif} 
                    source={item.source}
                    contentFit="contain"
                  />
                )}
                <View style={styles.storeItemInfo}>
                  <Text style={[styles.storeItemName, { color: isItemAvailable(item) ? '#000' : '#aaa' }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.storeItemPrice, { color: isItemAvailable(item) ? '#007bff' : '#aaa' }]}>
                    {item.price} monedas
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.purchaseButton, { backgroundColor: isItemAvailable(item) ? '#007bff' : '#aaa' }]} 
                  onPress={() => handlePurchase(item)} 
                  disabled={!isItemAvailable(item)}
                >
                  <Text style={styles.purchaseButtonText}>
                    {isItemAvailable(item) ? 'Comprar' : 'No disponible'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.closeButton} onPress={handleStoreClick}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Temporizadores */}
        <View style={styles.timersContainer}>
          {multiplierTimer > 0 && (
            <Text style={styles.timerText}>
              Multiplicador: {multiplierTimer}s
            </Text>
          )}
          {autoClickerTimer > 0 && (
            <Text style={styles.timerText}>
              Autoclicker: {autoClickerTimer}s
            </Text>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  counterContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  instructions: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  animalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chickenGif: {
    width: 80,
    height: 80,
    margin: 5,
    resizeMode: 'contain',
  },
  storeButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  storeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  storeContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007bff',
  },
  storeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  storeItemGif: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  storeItemInfo: {
    flex: 1,
  },
  storeItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storeItemPrice: {
    fontSize: 16,
  },
  purchaseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  timersContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    alignItems: 'flex-end',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 10,
    marginBottom: 5,
  },
});