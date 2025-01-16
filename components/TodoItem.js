import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function TodoItem({
  tache,
  onEditTodo,
  onDeleteTodo,
  onToggleRealisee,
}) {
  const [texte, setTexte] = useState(tache.texte);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (texte.trim() === "") {
      alert("Le texte de la tâche ne peut pas être vide.");
      return;
    }
    onEditTodo(tache.id, { ...tache, texte }); // Appelle Redux ou l'API
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTodo(tache.id); // Appelle la fonction pour supprimer la tâche
  };

  const handleToggleRealisee = () => {
    onToggleRealisee(tache.id); // Appelle Redux pour inverser le statut
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
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.button}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleDelete} style={styles.button}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleRealisee} style={styles.button}>
          <Text style={styles.buttonText}>
            {tache.estRealisee ? "Non réalisée" : "Marquer comme terminée"}
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
    marginBottom: 10, // Ajoute un espace entre le texte et les boutons
  },
  realiseeText: {
    textDecorationLine: "line-through", // Barre le texte si la tâche est réalisée
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
    flexDirection: "column", // Affiche les boutons en colonne
    alignItems: "flex-start", // Aligne les boutons à gauche
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 5, // Ajoute un espace entre les boutons
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
