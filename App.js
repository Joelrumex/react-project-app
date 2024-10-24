import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, AppState } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        //setTotalAnimals(newTotalAnimals);
    } else {
        alert('No tienes suficientes monedas!'); // Mensaje de error si no se tienen suficientes monedas
    }
};

  // Función para verificar si un artículo está disponible para compra
  const isItemAvailable = (item) => {
    if (item.name === 'Gallina') {
      return chickens < 5 && pigs === 0 && cows === 0 && sheep === 0 && goats === 0;
    }
    if (item.name === 'Cerdo') {
      return pigs < 5 && cows === 0 && sheep === 0 && goats === 0 && completedMissions[0];
    }
    if (item.name === 'Vaca') {
      return cows < 5 && sheep === 0 && goats === 0 && completedMissions[1];
    }
    if (item.name === 'Oveja') {
      return sheep < 5 && goats === 0 && completedMissions[2];
    }
    if (item.name === 'Cabra') {
      return goats < 5 && completedMissions[3];
    }
    if (item.name === 'Multiplicador de Clics') {
      return !clickMultiplierActive;
    }
    if (item.name === 'Clicador Automático') {
      return !autoClickerActive;
    }
    return false;
  };

  const [showMissions, setShowMissions] = useState(false); // Estado para controlar la visibilidad del menú de misiones

  // Información de las misiones
  const missions = [
    { name: 'Misión 1', description: 'Compra 5 gallinas', reward: "Comprar cerdos" },
    { name: 'Misión 2', description: 'Compra 5 cerdos', reward: "Comprar vacas" },
    { name: 'Misión 3', description: 'Compra 5 vacas', reward: "Comprar ovejas" },
    { name: 'Misión 4', description: 'Compra 5 ovejas', reward: "Comprar cabras" },
    // ... más misiones ...
  ];

  // Función para abrir o cerrar el menú de misiones
  const handleMissionsClick = () => {
    setShowMissions(!showMissions);
  };

  const [completedMissions, setCompletedMissions] = useState([false, false, false, false]); // Estado para misiones completadas

  // Función para manejar la finalización de una misión
  const handleCompleteMission = (index) => {
    const newCompletedMissions = [...completedMissions];
    newCompletedMissions[index] = true;
    setCompletedMissions(newCompletedMissions);

    // Desbloquear el siguiente animal basado en la misión completada
    if (index === 0) {
      setUnlockedAnimals([false, true, false, false, false, true, true]); // Desbloquea el cerdo
    } else if (index === 1) {
      setUnlockedAnimals([false, false, true, false, false, true, true]); // Desbloquea la vaca
    } else if (index === 2) {
      setUnlockedAnimals([false, false, false, true, false, true, true]); // Desbloquea la oveja
    } else if (index === 3) {
      setUnlockedAnimals([false, false, false, false, true, true, true]); // Desbloquea la cabra
    }
  };

  // Función para verificar si una misión puede ser completada
  const canCompleteMission = (index) => {
    if (index === 0) return chickens >= 5;
    if (index === 1) return pigs >= 5;
    if (index === 2) return cows >= 5;
    if (index === 3) return sheep >= 5;
    return false;
  };

  useEffect(() => {
    // Cargar el progreso del juego al iniciar
    const loadGameProgress = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('count');
        const savedChickens = await AsyncStorage.getItem('chickens');
        const savedPigs = await AsyncStorage.getItem('pigs');
        const savedCows = await AsyncStorage.getItem('cows');
        const savedSheep = await AsyncStorage.getItem('sheep');
        const savedGoats = await AsyncStorage.getItem('goats');
        const savedCompletedMissions = await AsyncStorage.getItem('completedMissions');
        const savedUnlockedAnimals = await AsyncStorage.getItem('unlockedAnimals');

        if (savedCount !== null) setCount(JSON.parse(savedCount));
        if (savedChickens !== null) setChickens(JSON.parse(savedChickens));
        if (savedPigs !== null) setPigs(JSON.parse(savedPigs));
        if (savedCows !== null) setCows(JSON.parse(savedCows));
        if (savedSheep !== null) setSheep(JSON.parse(savedSheep));
        if (savedGoats !== null) setGoats(JSON.parse(savedGoats));
        if (savedCompletedMissions !== null) setCompletedMissions(JSON.parse(savedCompletedMissions));
        if (savedUnlockedAnimals !== null) setUnlockedAnimals(JSON.parse(savedUnlockedAnimals));
      } catch (error) {
        console.error('Error loading game progress:', error);
      }
    };

    loadGameProgress();
  }, []);

  useEffect(() => {
    // Guardar el progreso del juego al cerrar la aplicación
    const saveGameProgress = async () => {
      try {
        await AsyncStorage.setItem('count', JSON.stringify(count));
        await AsyncStorage.setItem('chickens', JSON.stringify(chickens));
        await AsyncStorage.setItem('pigs', JSON.stringify(pigs));
        await AsyncStorage.setItem('cows', JSON.stringify(cows));
        await AsyncStorage.setItem('sheep', JSON.stringify(sheep));
        await AsyncStorage.setItem('goats', JSON.stringify(goats));
        await AsyncStorage.setItem('completedMissions', JSON.stringify(completedMissions));
        await AsyncStorage.setItem('unlockedAnimals', JSON.stringify(unlockedAnimals));
      } catch (error) {
        console.error('Error saving game progress:', error);
      }
    };

    // Escuchar el evento de cierre de la aplicación
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        saveGameProgress();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [count, chickens, pigs, cows, sheep, goats, completedMissions, unlockedAnimals]);

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

        <TouchableOpacity style={styles.storeButton} onPress={handleMissionsClick}>
          <Text style={styles.storeButtonText}>Misiones</Text>
        </TouchableOpacity>

        {/* Componente de la tienda */}
        {showStore && (
          <View style={styles.storeContainer}>
            <Text style={styles.storeTitle}>Bienvenido a la Tienda</Text>
            {storeItems.map((item, index) => {
              const available = isItemAvailable(item);
              return (
                <View key={index} style={styles.storeItemContainer}>
                  {item.source && (
                    <Image 
                      style={styles.storeItemGif} 
                      source={item.source}
                      contentFit="contain"
                    />
                  )}
                  <View style={styles.storeItemInfo}>
                    <Text style={[styles.storeItemName, { color: available ? '#000' : '#aaa' }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.storeItemPrice, { color: available ? '#007bff' : '#aaa' }]}>
                      {item.price} monedas
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.purchaseButton, { backgroundColor: available ? '#007bff' : '#aaa' }]} 
                    onPress={() => handlePurchase(item)} 
                    disabled={!available}
                  >
                    <Text style={styles.purchaseButtonText}>
                      {available ? 'Comprar' : 'No disponible'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity style={styles.closeButton} onPress={handleStoreClick}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Componente del menú de misiones */}
        {showMissions && (
          <View style={styles.storeContainer}>
            <Text style={styles.storeTitle}>Misiones Disponibles</Text>
            {missions.map((mission, index) => {
              const isComplete = completedMissions[index];
              const isReadyToComplete = canCompleteMission(index);
              return (
                <View key={index} style={styles.storeItemContainer}>
                  <View style={styles.storeItemInfo}>
                    <Text style={styles.storeItemName}>{mission.name}</Text>
                    <Text style={styles.storeItemPrice}>{mission.description}</Text>
                    <Text style={styles.storeItemPrice}>Recompensa: {mission.reward}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.purchaseButton, 
                      { backgroundColor: isComplete ? '#aaa' : isReadyToComplete ? '#007bff' : '#ccc' }
                    ]}
                    onPress={() => handleCompleteMission(index)}
                    disabled={isComplete || !isReadyToComplete}
                  >
                    <Text style={styles.purchaseButtonText}>
                      {isComplete ? 'Completada' : isReadyToComplete ? 'Completar' : 'En proceso'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity style={styles.closeButton} onPress={handleMissionsClick}>
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
