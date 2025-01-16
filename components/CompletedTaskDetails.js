// CompletedTaskDetails.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function CompletedTaskDetails({ route, navigation }) {
  // On récupère la tâche transmise depuis CompletedTasks via la navigation
  const { tache } = route.params;

  // tache contient toutes les infos : texte, categorie, priorite, etc.
  // Par exemple : tache.texte, tache.categorie, tache.priorite

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails de la tâche terminée</Text>
      <Text style={styles.info}>Texte : {tache.texte}</Text>
      <Text style={styles.info}>Catégorie : {tache.categorie}</Text>
      <Text style={styles.info}>Priorité : {tache.priorite}</Text>
      {/* Ajoute d’autres champs si nécessaire */}

      <Button title="Retour" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "600",
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
});
