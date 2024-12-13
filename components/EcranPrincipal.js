import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import TodoList from './TodoList';
import * as FileSystem from 'expo-file-system';  // Importation du module expo-file-system

export default function EcranPrincipal({ navigation }) {
  const [taches, setTaches] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  const [categorieTache, setCategorieTache] = useState('');
  const [prioriteTache, setPrioriteTache] = useState('');
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  const [tachesTerminees, setTachesTerminees] = useState([]);
  const tasksFilePath = FileSystem.documentDirectory + 'taches.json';

  // Charger les tâches depuis le fichier JSON
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fileExists = await FileSystem.getInfoAsync(tasksFilePath);
        if (fileExists.exists) {
          const tasksData = await FileSystem.readAsStringAsync(tasksFilePath);
          const allTasks = JSON.parse(tasksData);
          setTaches(allTasks.filter((tache) => !tache.estRealisee));
          setTachesTerminees(allTasks.filter((tache) => tache.estRealisee));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tâches : ', error);
      }
    };
    loadTasks();
  }, []);


  // Sauvegarder les tâches dans le fichier JSON
  const saveTasks = async (allTasks) => {
    try {
      await FileSystem.writeAsStringAsync(tasksFilePath, JSON.stringify(allTasks));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches : ', error);
    }
  };

  const handleToggleRealisee = (id) => {
    const updatedTasks = taches.map((tache) => {
      if (tache.id === id) {
        const updatedTask = { ...tache, estRealisee: !tache.estRealisee };
        if (updatedTask.estRealisee) {
          setTachesTerminees([...tachesTerminees, updatedTask]);
          return null;
        }
        return updatedTask;
      }
      return tache;
    }).filter(Boolean);

    setTaches(updatedTasks);
    saveTasks([...updatedTasks, ...tachesTerminees]);
  };


  // Ajouter une nouvelle tâche
  const handleAddTodo = () => {
    if (nouvelleTache.trim() === '') return;

    const newTache = {
      id: taches.length + 1,
      texte: nouvelleTache,
      categorie: '',
      priorite: '',
      estRealisee: false
    };

    const updatedTasks = [...taches, newTache];
    setTaches(updatedTasks);
    saveTasks(updatedTasks); // Sauvegarder les tâches modifiées
    setNouvelleTache('');
    setIsTaskAdded(true);
  };

  // Valider l'ajout de la tâche avec la catégorie et la priorité
  const handleConfirmCategoryAndPriority = () => {
    if (!categorieTache || !prioriteTache) {
      alert('Veuillez sélectionner une catégorie et une priorité avant de valider.');
      return;
    }

    const updatedTaches = taches.map((tache) =>
      tache.categorie === '' && tache.priorite === '' ? { ...tache, categorie: categorieTache, priorite: prioriteTache } : tache
    );

    setTaches(updatedTaches);
    saveTasks(updatedTaches); // Sauvegarder les tâches modifiées
    setCategorieTache('');
    setPrioriteTache('');
    setIsCategorySelected(false);
    setIsTaskAdded(false);
  };

  // Supprimer une tâche
  const handleDeleteTodo = (id) => {
    const updatedTasks = taches.filter((tache) => tache.id !== id);
    setTaches(updatedTasks);
    saveTasks(updatedTasks); // Sauvegarder les tâches modifiées après suppression
  };

  const handleEditTodo = (id, newText) => {
    const updatedTasks = taches.map((tache) =>
      tache.id === id ? { ...tache, texte: newText } : tache
    );
    setTaches(updatedTasks);
    saveTasks(updatedTasks); // Sauvegarder les tâches après modification
  };

  // Trier les tâches par priorité
  const sortTachesByPriority = (taches) => {
    const priorityOrder = { Haute: 1, Moyenne: 2, Basse: 3 };
    return [...taches].sort((a, b) => priorityOrder[a.priorite] - priorityOrder[b.priorite]);
  };

  // Filtrer les tâches par catégorie
  const handleFiltrerParCategorie = (categorie) => {
    setCategorieFiltre(categorie);
  };

  // Filtrer et trier les tâches
  const tachesFiltrees = categorieFiltre
    ? taches.filter((tache) => tache.categorie === categorieFiltre)
    : taches;
  const tachesTriees = sortTachesByPriority(tachesFiltrees);

  return (
    <ScrollView style={styles.container}>
      {isTaskAdded ? (
        <View style={styles.categorySelectionContainer}>
          <Text style={styles.label}>Sélectionner la catégorie :</Text>
          <View style={styles.categoryButtonsContainer}>
            {['Travail', 'Maison', 'Personnel'].map((categorie) => (
              <TouchableOpacity
                key={categorie}
                style={[styles.categoryButton, categorieTache === categorie && styles.categoryButtonSelected]}
                onPress={() => setCategorieTache(categorie)}
              >
                <Text style={[styles.categoryButtonText, categorieTache === categorie && styles.categoryButtonTextSelected]}>
                  {categorie}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Sélectionner la priorité :</Text>
          <View style={styles.priorityButtonsContainer}>
            {['Haute', 'Moyenne', 'Basse'].map((priorite) => (
              <TouchableOpacity
                key={priorite}
                style={[styles.priorityButton, prioriteTache === priorite && styles.priorityButtonSelected]}
                onPress={() => setPrioriteTache(priorite)}
              >
                <Text style={[styles.priorityButtonText, prioriteTache === priorite && styles.priorityButtonTextSelected]}>
                  {priorite}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleConfirmCategoryAndPriority}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            value={nouvelleTache}
            onChangeText={setNouvelleTache}
            placeholder="Nouvelle tâche"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
            <Text style={styles.buttonText}>Ajouter une tâche</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filtrer par catégorie :</Text>
        <View style={styles.categoryButtonsContainer}>
          {['Tous', 'Travail', 'Maison', 'Personnel'].map((categorie) => (
            <TouchableOpacity
              key={categorie}
              style={[styles.filterButton, categorieFiltre === categorie && styles.filterButtonSelected]}
              onPress={() => handleFiltrerParCategorie(categorie === 'Tous' ? '' : categorie)}
            >
              <Text style={[styles.filterButtonText, categorieFiltre === categorie && styles.filterButtonTextSelected]}>
                {categorie}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TodoList taches={tachesTriees} onDeleteTodo={handleDeleteTodo} onEditTodo={handleEditTodo} onToggleRealisee={handleToggleRealisee} navigation={navigation} />
      <TouchableOpacity
        onPress={() => navigation.navigate('CompletedTasks', { tachesTerminees })}
        style={styles.completedButton}
      >
        <Text style={styles.completedButtonText}>Voir les tâches terminées</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  button: { backgroundColor: '#4CAF50', padding: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18 },
  label: { fontSize: 16, marginBottom: 10 },
  categoryButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  categoryButton: { padding: 10, borderWidth: 1, borderColor: '#ddd' },
  categoryButtonSelected: { backgroundColor: '#4CAF50' },
  categoryButtonText: { fontSize: 16 },
  categoryButtonTextSelected: { color: '#fff' },
  priorityButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  priorityButton: { padding: 10, borderWidth: 1, borderColor: '#ddd' },
  priorityButtonSelected: { backgroundColor: '#4CAF50' },
  priorityButtonText: { fontSize: 16 },
  priorityButtonTextSelected: { color: '#fff' },
  filterContainer: { marginVertical: 20 },
  filterText: { fontSize: 16 },
  filterButton: { padding: 10, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 5 },
  filterButtonSelected: { backgroundColor: '#4CAF50' },
  filterButtonText: { fontSize: 16 },
  filterButtonTextSelected: { color: '#fff' },
  completedButton: { marginTop: 20, alignItems: 'center' },
  completedButtonText: { color: '#007BFF', fontSize: 16 },
});
