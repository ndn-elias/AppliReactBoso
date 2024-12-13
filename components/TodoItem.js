// TodoItem.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TodoItem({ tache, onEditTodo, onDeleteTodo, onToggleRealisee }) {
  const [texte, setTexte] = useState(tache.texte);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEditTodo(tache.id, texte);
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
      <Text style={[styles.itemText, tache.estRealisee && styles.realiseeText]}>
        {isEditing ? (
          <TextInput
            value={texte}
            onChangeText={setTexte}
            style={styles.input}
          />
        ) : (
          tache.texte
        )}
      </Text>

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
            {tache.estRealisee ? 'Non réalisée' : 'Réalisée'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: { marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 18, width: '60%' },
  input: { fontSize: 18, width: '60%', borderBottomWidth: 1, borderColor: '#ccc', paddingLeft: 5 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '40%' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});