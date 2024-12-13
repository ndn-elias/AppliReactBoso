// CompletedTasks.js
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

export default function CompletedTasks({ route, navigation }) {
  const { tachesTerminees } = route.params;  // Récupérer les tâches terminées passées via la navigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches terminées</Text>

      {/* Affichage des tâches terminées avec FlatList */}
      <FlatList
        data={tachesTerminees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.texte}</Text>
          </View>
        )}
      />

      <Button
        title="Retour à l'écran principal"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  taskContainer: { marginBottom: 10 },
  taskText: { fontSize: 18 },
});