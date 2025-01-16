// EcranPrincipal.js

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next"; // Pour traduire
import useLanguage from "../hooks/useLanguage";
import WeatherComponent from "./WeatherComponent";

// Actions Redux hors-ligne
import {
  fetchTasks,
  createTask,
  editTask,
  deleteTaskAction,
  toggleTaskRealiseeAction,
} from "./taskActions";

import useNetworkStatus from "@/hooks/useNetworkStatus";
import TodoList from "./TodoList";

export default function EcranPrincipal({ navigation }) {
  const PRIORITIES = ["high", "medium", "low"];
  const [prioriteTache, setPrioriteTache] = useState("");
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage(); // <-- On récupère la fonction pour changer la langue
  const dispatch = useDispatch();

  // Récupération depuis le store Redux
  const { tasks, isLoading } = useSelector((state) => state.tasks);

  // Champs locaux
  const [nouvelleTache, setNouvelleTache] = useState("");
  const [isTaskAdded, setIsTaskAdded] = useState(false);

  // Filtre & pagination
  const [categorieFiltre, setCategorieFiltre] = useState("");
  const [tachesAfficheesCount, setTachesAfficheesCount] = useState(1);

  // Catégorie et priorité pour la dernière tâche ajoutée
  const [categorieTache, setCategorieTache] = useState("");

  const isConnected = useNetworkStatus();

  // Au montage : charger le filtre + récupérer les tâches
  useEffect(() => {
    (async () => {
      try {
        const savedFilter = await AsyncStorage.getItem("categorieFiltre");
        if (savedFilter !== null) {
          setCategorieFiltre(savedFilter);
        }
      } catch (error) {
        console.log("Erreur lors de la récupération du filtre :", error);
      }
    })();

    dispatch(fetchTasks());
  }, [dispatch]);

  // Filtrage + pagination
  const tachesAffichees = useMemo(() => {
    if (!tasks) return [];
    let resultat = tasks;
    if (categorieFiltre) {
      resultat = resultat.filter(
        (tache) => tache.categorie === categorieFiltre
      );
    }
    return resultat.slice(0, tachesAfficheesCount);
  }, [tasks, categorieFiltre, tachesAfficheesCount]);

  // Bouton "Charger plus"
  const handleLoadMore = () => {
    setTachesAfficheesCount((prev) => prev + 1);
  };

  // Ajouter une nouvelle tâche
  const handleAddTodo = () => {
    if (nouvelleTache.trim() === "") {
      alert(t("taskCannotBeEmpty"));
      return;
    }
    const newTache = {
      texte: nouvelleTache,
      categorie: "",
      priorite: "",
      estRealisee: false,
    };

    dispatch(createTask(newTache));
    setNouvelleTache("");
    setIsTaskAdded(true);
  };

  // Éditer une tâche
  const handleEditTodo = (id, updatedTask) => {
    dispatch(editTask(id, updatedTask));
  };

  // Supprimer une tâche
  const handleDeleteTodo = (id) => {
    dispatch(deleteTaskAction(id));
  };

  // Toggle "réalisée"
  const handleToggleRealisee = (id) => {
    const tacheActuelle = tasks.find((t) => t.id === id);
    if (tacheActuelle) {
      dispatch(toggleTaskRealiseeAction(id, tacheActuelle));
    }
  };

  // Valider la catégorie et la priorité
  const handleConfirmCategoryAndPriority = () => {
    if (!categorieTache || !prioriteTache) {
      alert(t("categoryAndPriorityRequired"));
      return;
    }
    const taskToUpdate = [...tasks].reverse().find((t) => !t.categorie);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        categorie: categorieTache,
        priorite: prioriteTache,
      };
      dispatch(editTask(taskToUpdate.id, updatedTask));
    }
    setCategorieTache("");
    setPrioriteTache("");
    setIsTaskAdded(false);
  };

  // Filtrer par catégorie et sauvegarder
  const handleFiltrerParCategorie = async (cat) => {
    setCategorieFiltre(cat);
    try {
      await AsyncStorage.setItem("categorieFiltre", cat);
    } catch (error) {
      console.log("Erreur lors de la sauvegarde du filtre :", error);
    }
  };

  // Si on est en train de charger
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>{t("loadingTasks")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Sélection catégorie + priorité si la tâche vient d’être ajoutée */}
      {isTaskAdded ? (
        <View style={styles.categorySelectionContainer}>
          <Text style={styles.label}>{t("selectCategory")}</Text>
          <View style={styles.categoryButtonsContainer}>
            {[t("work"), t("home"), t("personal")].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  categorieTache === cat && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategorieTache(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    categorieTache === cat && styles.categoryButtonTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.categorySelectionContainer}>
            <Text style={styles.label}>{t("selectPriority")}</Text>

            <View style={styles.priorityButtonsContainer}>
              {PRIORITIES.map((priorityKey) => {
                const label = t(priorityKey); // ex. "Haute" en FR, "High" en EN
                return (
                  <TouchableOpacity
                    key={priorityKey}
                    style={[
                      styles.priorityButton,
                      prioriteTache === priorityKey &&
                        styles.priorityButtonSelected,
                    ]}
                    onPress={() => setPrioriteTache(priorityKey)}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        prioriteTache === priorityKey &&
                          styles.priorityButtonTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmCategoryAndPriority}
          >
            <Text style={styles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Formulaire d'ajout d'une nouvelle tâche
        <View>
          <TextInput
            value={nouvelleTache}
            onChangeText={setNouvelleTache}
            placeholder={t("newTaskPlaceholder")}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
            <Text style={styles.buttonText}>{t("addTask")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Boutons de filtre par catégorie */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>{t("filterByCategory")}</Text>
        <View style={styles.categoryButtonsContainer}>
          {[t("all"), t("work"), t("home"), t("personal")].map((catLabel) => {
            let catValue = "";
            if (catLabel === t("all")) catValue = "";
            if (catLabel === t("work")) catValue = "Travail";
            if (catLabel === t("home")) catValue = "Maison";
            if (catLabel === t("personal")) catValue = "Personnel";

            return (
              <TouchableOpacity
                key={catLabel}
                style={[
                  styles.filterButton,
                  categorieFiltre === catValue && styles.filterButtonSelected,
                ]}
                onPress={() => handleFiltrerParCategorie(catValue)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    categorieFiltre === catValue &&
                      styles.filterButtonTextSelected,
                  ]}
                >
                  {catLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Liste de tâches paginées + filtrées */}
      <TodoList
        taches={tachesAffichees}
        onDeleteTodo={handleDeleteTodo}
        onToggleRealisee={handleToggleRealisee}
        onEditTodo={handleEditTodo}
      />

      {/* Bouton pour afficher les tâches terminées */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompletedTasks", {
            tachesTerminees: tasks.filter((t) => t.estRealisee),
          })
        }
        style={styles.completedButton}
      >
        <Text style={styles.completedButtonText}>{t("seeCompletedTasks")}</Text>
      </TouchableOpacity>

      {/* "Charger plus" si on n'a pas tout affiché */}
      {tachesAffichees.length < tasks.length && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreButtonText}>{t("loadMore")}</Text>
        </TouchableOpacity>
      )}

      {/* Sélecteur de langue stylé (FR / EN) */}
      <View style={styles.languageSwitcherContainer}>
        <TouchableOpacity
          style={[styles.languageButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => changeLanguage("fr")}
        >
          <Text style={styles.languageButtonText}>FR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.languageButton, { backgroundColor: "#2196F3" }]}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.languageButtonText}>EN</Text>
        </TouchableOpacity>
      </View>
      <WeatherComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  label: { fontSize: 16, marginBottom: 10 },
  categorySelectionContainer: { marginBottom: 20 },
  categoryButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  categoryButtonText: { fontSize: 16 },
  categoryButtonTextSelected: { color: "#fff" },
  priorityButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  priorityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  priorityButtonSelected: {
    backgroundColor: "#4CAF50",
  },
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
  filterButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: { fontSize: 16 },
  filterButtonTextSelected: { color: "#fff" },
  completedButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  completedButtonText: { color: "#fff", fontSize: 18 },
  loadMoreButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loadMoreButtonText: { color: "#fff", fontSize: 16 },

  // Ajout du style pour le sélecteur de langue
  languageSwitcherContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  languageButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  languageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
