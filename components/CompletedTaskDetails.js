// CompletedTaskDetails.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useTranslation } from "react-i18next"; // <-- on importe le hook

export default function CompletedTaskDetails({ route, navigation }) {
  const { t } = useTranslation();
  const { tache } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("completedTaskDetails")}</Text>
      <Text style={styles.info}>
        {t("taskText")} {tache.texte}
      </Text>
      <Text style={styles.info}>
        {t("taskCategory")} {tache.categorie}
      </Text>
      <Text style={styles.info}>
        {t("taskPriority")} {tache.priorite}
      </Text>

      <Button title={t("back")} onPress={() => navigation.goBack()} />
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
