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
import { useTranslation } from "react-i18next"; // IMPORT pour la traduction

export default function CompletedTasks({ route, navigation }) {
  const { t } = useTranslation();
  const { tachesTerminees } = route.params;

  const handleDetails = (task) => {
    navigation.navigate("CompletedTaskDetails", { tache: task });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("completedTasks")}</Text>

      <FlatList
        data={tachesTerminees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.texte}</Text>
            {/* Bouton pour afficher les détails de la tâche */}
            <Button title={t("details")} onPress={() => handleDetails(item)} />
          </View>
        )}
      />

      <Button
        title={t("backToMainScreen")}
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
