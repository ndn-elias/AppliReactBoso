import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import TodoList from "./TodoList";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskRealiseeAction,
} from "../app/(tabs)/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EcranPrincipal({ navigation }) {
  const [taches, setTaches] = useState([]);
  const [tachesAffichees, setTachesAffichees] = useState([]); // État pour les tâches affichées après filtre
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("");
  const [categorieTache, setCategorieTache] = useState("");
  const [prioriteTache, setPrioriteTache] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const tachesFiltrees = categorieFiltre
    ? taches.filter((tache) => tache.categorie === categorieFiltre)
    : taches;

  // Charger le filtre sauvegardé et les tâches
  useEffect(() => {
    const loadFilterAndTasks = async () => {
      try {
        const savedFilter = await AsyncStorage.getItem("categorieFiltre");
        if (savedFilter !== null) {
          setCategorieFiltre(savedFilter);
        }
        const response = await getTasks();
        setTaches(response.data);
        console.log("Tâches récupérées :", response.data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    loadFilterAndTasks();
  }, []);

  // Appliquer le filtre lors de la modification de `categorieFiltre` ou des tâches
  useEffect(() => {
    if (categorieFiltre) {
      const filteredTasks = taches.filter(
        (tache) => tache.categorie === categorieFiltre
      );
      setTachesAffichees(filteredTasks);
    } else {
      setTachesAffichees(taches);
    }
  }, [categorieFiltre, taches]);

  // Ajouter une nouvelle tâche
  const handleAddTodo = async () => {
    if (nouvelleTache.trim() === "") {
      alert("Le texte de la tâche ne peut pas être vide.");
      return;
    }

    const newTache = {
      texte: nouvelleTache,
      categorie: "",
      priorite: "",
      estRealisee: false,
    };

    try {
      const response = await addTask(newTache);
      setTaches((prevTaches) => [...prevTaches, response.data]);
      setNouvelleTache("");
      setIsTaskAdded(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  };
  const handleEditTodo = async (id, updatedTask) => {
    try {
      const response = await updateTask(id, updatedTask); // Appel API
      setTaches((prevTaches) =>
        prevTaches.map((tache) => (tache.id === id ? response.data : tache))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  // Valider l'ajout de la tâche avec la catégorie et la priorité
  const handleConfirmCategoryAndPriority = async () => {
    if (!categorieTache || !prioriteTache) {
      alert(
        "Veuillez sélectionner une catégorie et une priorité avant de valider."
      );
      return;
    }

    const taskToUpdate = taches.find((tache) => tache.categorie === "");
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        categorie: categorieTache,
        priorite: prioriteTache,
      };

      try {
        const response = await updateTask(taskToUpdate.id, updatedTask);
        setTaches((prevTaches) =>
          prevTaches.map((tache) =>
            tache.id === taskToUpdate.id ? response.data : tache
          )
        );
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche :", error);
      }
    }

    setCategorieTache("");
    setPrioriteTache("");
    setIsCategorySelected(false);
    setIsTaskAdded(false);
  };

  // Supprimer une tâche
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTask(id); // Appel API
      setTaches((prevTaches) => prevTaches.filter((tache) => tache.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  // Marquer une tâche comme réalisée ou non réalisée
  const handleToggleRealisee = async (id) => {
    const taskToToggle = taches.find((tache) => tache.id === id);
    if (taskToToggle) {
      try {
        const updatedTask = {
          ...taskToToggle,
          estRealisee: !taskToToggle.estRealisee,
        };
        const response = await updateTask(id, updatedTask);
        setTaches((prevTaches) =>
          prevTaches.map((tache) => (tache.id === id ? response.data : tache))
        );
      } catch (error) {
        console.error("Erreur lors du changement de statut :", error);
      }
    }
  };

  // Filtrer les tâches par catégorie
  const handleFiltrerParCategorie = async (categorie) => {
    console.log("Catégorie sélectionnée :", categorie);
    setCategorieFiltre(categorie);
    try {
      await AsyncStorage.setItem("categorieFiltre", categorie);
      console.log("Filtre sauvegardé :", categorie);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du filtre :", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Chargement des tâches...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isTaskAdded ? (
        <View style={styles.categorySelectionContainer}>
          <Text style={styles.label}>Sélectionner la catégorie :</Text>
          <View style={styles.categoryButtonsContainer}>
            {["Travail", "Maison", "Personnel"].map((categorie) => (
              <TouchableOpacity
                key={categorie}
                style={[
                  styles.categoryButton,
                  categorieTache === categorie && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategorieTache(categorie)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    categorieTache === categorie &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {categorie}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Sélectionner la priorité :</Text>
          <View style={styles.priorityButtonsContainer}>
            {["Haute", "Moyenne", "Basse"].map((priorite) => (
              <TouchableOpacity
                key={priorite}
                style={[
                  styles.priorityButton,
                  prioriteTache === priorite && styles.priorityButtonSelected,
                ]}
                onPress={() => setPrioriteTache(priorite)}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    prioriteTache === priorite &&
                      styles.priorityButtonTextSelected,
                  ]}
                >
                  {priorite}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmCategoryAndPriority}
          >
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
          {["Tous", "Travail", "Maison", "Personnel"].map((categorie) => (
            <TouchableOpacity
              key={categorie}
              style={[
                styles.filterButton,
                categorieFiltre === categorie && styles.filterButtonSelected,
              ]}
              onPress={() =>
                handleFiltrerParCategorie(categorie === "Tous" ? "" : categorie)
              }
            >
              <Text
                style={[
                  styles.filterButtonText,
                  categorieFiltre === categorie &&
                    styles.filterButtonTextSelected,
                ]}
              >
                {categorie}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TodoList
        categorieFiltre={categorieFiltre}
        taches={tachesAffichees} // Utilisation des tâches affichées
        onDeleteTodo={handleDeleteTodo}
        onToggleRealisee={handleToggleRealisee}
        onEditTodo={handleEditTodo}
        navigation={navigation}
      />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompletedTasks", {
            tachesTerminees: taches.filter((tache) => tache.estRealisee),
          })
        }
        style={styles.completedButton}
      >
        <Text style={styles.completedButtonText}>
          Voir les tâches terminées
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 18 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, marginBottom: 10 },
  categoryButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryButton: { padding: 10, borderWidth: 1, borderColor: "#ddd" },
  categoryButtonSelected: { backgroundColor: "#4CAF50" },
  categoryButtonText: { fontSize: 16 },
  categoryButtonTextSelected: { color: "#fff" },
  priorityButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  priorityButton: { padding: 10, borderWidth: 1, borderColor: "#ddd" },
  priorityButtonSelected: { backgroundColor: "#4CAF50" },
  priorityButtonText: { fontSize: 16 },
  priorityButtonTextSelected: { color: "#fff" },
  filterContainer: { marginVertical: 20 },
  filterText: { fontSize: 16 },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
  },
  filterButtonSelected: { backgroundColor: "#4CAF50" },
  filterButtonText: { fontSize: 16 },
  filterButtonTextSelected: { color: "#fff" },
});
