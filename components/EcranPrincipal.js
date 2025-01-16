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
import { getTasks, addTask, updateTask, deleteTask } from "../app/(tabs)/api"; // Ton API locale
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EcranPrincipal({ navigation }) {
  const [taches, setTaches] = useState([]);
  const [tachesAffichees, setTachesAffichees] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("");
  const [categorieTache, setCategorieTache] = useState("");
  const [prioriteTache, setPrioriteTache] = useState("");
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // IMPORTANT: on initialise à 1 pour n'afficher qu'une seule tâche au démarrage
  const [tachesAfficheesCount, setTachesAfficheesCount] = useState(1);

  // Charger les tâches et le filtre
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

  /**
   * Appliquer le filtre et la pagination :
   * - Filtre par catégorie si nécessaire
   * - Ne prend que tachesAfficheesCount tâches
   */
  useEffect(() => {
    let filteredTasks = taches;
    if (categorieFiltre) {
      filteredTasks = taches.filter(
        (tache) => tache.categorie === categorieFiltre
      );
    }
    // On n'affiche que le nombre de tâches défini par tachesAfficheesCount
    const slicedTasks = filteredTasks.slice(0, tachesAfficheesCount);
    setTachesAffichees(slicedTasks);
  }, [categorieFiltre, taches, tachesAfficheesCount]);

  // Fonction pour charger plus de tâches
  const handleLoadMore = () => {
    setTachesAfficheesCount((prevCount) => prevCount + 1);
  };

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

  // Mettre à jour une tâche
  const handleEditTodo = async (id, updatedTask) => {
    try {
      const response = await updateTask(id, updatedTask);
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

    // On cherche la dernière tâche ajoutée qui n’a pas encore de catégorie
    // (ou toute autre logique pour trouver la tâche à mettre à jour).
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
    setIsTaskAdded(false);
  };

  // Supprimer une tâche
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTask(id);
      setTaches((prevTaches) => prevTaches.filter((tache) => tache.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  // Basculer l'état "réalisée" d'une tâche
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

      {/* Boutons de filtre par catégorie */}
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

      {/* Liste de tâches (on lui envoie les tachesAffichees paginées/filtrées) */}
      <TodoList
        taches={tachesAffichees}
        onDeleteTodo={handleDeleteTodo}
        onToggleRealisee={handleToggleRealisee}
        onEditTodo={handleEditTodo}
      />

      {/* Accès aux tâches terminées */}
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

      {/* Bouton "Charger plus" si on a encore des tâches à afficher */}
      {tachesAffichees.length < taches.length && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreButtonText}>Charger plus</Text>
        </TouchableOpacity>
      )}
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
  categorySelectionContainer: { marginBottom: 20 },
  categoryButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
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
  filterText: { fontSize: 16, marginBottom: 5 },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
  },
  filterButtonSelected: { backgroundColor: "#4CAF50" },
  filterButtonText: { fontSize: 16 },
  filterButtonTextSelected: { color: "#fff" },
  completedButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  completedButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loadMoreButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loadMoreButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
