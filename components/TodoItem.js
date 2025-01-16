import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next"; // <-- on importe le hook

export default function TodoItem({
  tache,
  onEditTodo,
  onDeleteTodo,
  onToggleRealisee,
}) {
  const { t } = useTranslation();
  const [texte, setTexte] = useState(tache.texte);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (texte.trim() === "") {
      alert(t("taskCannotBeEmpty")); // <-- traduction
      return;
    }
    onEditTodo(tache.id, { ...tache, texte });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTodo(tache.id);
  };

  const handleToggleRealisee = () => {
    onToggleRealisee(tache.id);
  };

  return (
    <View style={styles.itemContainer}>
      {isEditing ? (
        <TextInput value={texte} onChangeText={setTexte} style={styles.input} />
      ) : (
        <Text
          style={[styles.itemText, tache.estRealisee && styles.realiseeText]}
        >
          {tache.texte}
        </Text>
      )}

      <View style={styles.buttonsContainer}>
        {isEditing ? (
          <TouchableOpacity onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>{t("validate")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.button}>
            <Text style={styles.buttonText}>{t("edit")}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleDelete} style={styles.button}>
          <Text style={styles.buttonText}>{t("delete")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleRealisee} style={styles.button}>
          <Text style={styles.buttonText}>
            {tache.estRealisee ? t("markUncompleted") : t("markCompleted")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  realiseeText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 5,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
