// TodoList.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import TodoItem from './TodoItem';

export default function TodoList({ taches, onEditTodo, onDeleteTodo, onToggleRealisee, navigation }) {
  return (
    <View>
      {taches.map((tache) => (
        <View key={tache.id} style={styles.itemWrapper}>
          <TodoItem 
            tache={tache} 
            onEditTodo={onEditTodo} 
            onDeleteTodo={onDeleteTodo} 
            onToggleRealisee={onToggleRealisee}
          />
          <TouchableOpacity 
            onPress={() => navigation.navigate('TodoDetails', { tache })} 
            style={styles.detailsButton}
          >
            <Text style={styles.buttonText}>Détails</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: { marginBottom: 15 },
  detailsButton: { backgroundColor: '#007BFF', padding: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});