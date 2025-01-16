// CompletedTasks.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function CompletedTasks({ route, navigation }) {
  const { tachesTerminees } = route.params;

  // Fonction de navigation vers CompletedTaskDetails
  const handleDetails = (task) => {
    navigation.navigate("CompletedTaskDetails", { tache: task });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches terminées</Text>

      <FlatList
        data={tachesTerminees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.texte}</Text>
            {/* Bouton pour afficher les détails de la tâche */}
            <Button title="Détails" onPress={() => handleDetails(item)} />
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
  taskContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  taskText: { fontSize: 18, marginBottom: 5 },
});
