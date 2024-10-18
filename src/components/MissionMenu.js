import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MissionItem from './MissionItem';

const MissionMenu = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    // Aquí cargarías las misiones, por ejemplo, de una API o un archivo local
    const loadedMissions = [
      { id: 1, title: "Misión 1", description: "Descripción de la misión 1", reward: 100 },
      { id: 2, title: "Misión 2", description: "Descripción de la misión 2", reward: 200 },
      // ... más misiones ...
    ];
    setMissions(loadedMissions);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {missions.map(mission => (
          <MissionItem 
            key={mission.id} 
            mission={mission} 
            onAccept={() => console.log('Misión aceptada:', mission.title)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default MissionMenu;
