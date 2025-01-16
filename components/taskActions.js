// taskAction.js
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskRealisee,
} from "../app/(tabs)/api";
import { networkQueue } from "../services/networkQueue"; // on l'importe
import NetInfo from "@react-native-community/netinfo"; // pour checker si en ligne

// -------------------------------------------------
// Récupération des tâches (en ligne seulement)
export const fetchTasks = () => async (dispatch) => {
  dispatch({ type: "TASKS_LOADING" });
  try {
    const response = await getTasks();
    dispatch({ type: "SET_TASKS", payload: response.data });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
  } finally {
    dispatch({ type: "TASKS_LOADING_DONE" });
  }
};

// -------------------------------------------------
// Création d'une tâche
export const createTask = (task) => async (dispatch) => {
  const netState = await NetInfo.fetch();
  const isConnected = netState.isConnected;

  if (isConnected) {
    // En ligne
    try {
      const response = await addTask(task); // appel direct MockAPI
      dispatch({ type: "ADD_TASK", payload: response.data });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
    }
  } else {
    // Hors ligne -> on push l'action dans la file d'attente
    // On met quand même à jour le store localement
    // On peut créer un id temporaire
    const tempId = "temp-" + Date.now();
    dispatch({ type: "ADD_TASK", payload: { ...task, id: tempId } });
    // On stocke l'action dans la queue pour plus tard
    await networkQueue.addAction({ type: "ADD_TASK", payload: task });
  }
};

// -------------------------------------------------
// Édition d'une tâche
export const editTask = (id, updatedTask) => async (dispatch) => {
  const netState = await NetInfo.fetch();
  const isConnected = netState.isConnected;

  if (isConnected) {
    // En ligne
    try {
      const response = await updateTask(id, updatedTask);
      dispatch({ type: "EDIT_TASK", payload: response.data });
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche :", error);
    }
  } else {
    // Hors ligne
    dispatch({ type: "EDIT_TASK", payload: { ...updatedTask, id } });
    await networkQueue.addAction({
      type: "EDIT_TASK",
      payload: { ...updatedTask, id },
    });
  }
};

// -------------------------------------------------
// Suppression d'une tâche
export const deleteTaskAction = (id) => async (dispatch) => {
  const netState = await NetInfo.fetch();
  const isConnected = netState.isConnected;

  if (isConnected) {
    // En ligne
    try {
      await deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  } else {
    // Hors ligne
    dispatch({ type: "DELETE_TASK", payload: id });
    await networkQueue.addAction({ type: "DELETE_TASK", payload: id });
  }
};

// -------------------------------------------------
// Toggle "réalisée"
export const toggleTaskRealiseeAction =
  (id, currentTask) => async (dispatch) => {
    const updatedTask = {
      ...currentTask,
      estRealisee: !currentTask.estRealisee,
    };

    const netState = await NetInfo.fetch();
    const isConnected = netState.isConnected;

    if (isConnected) {
      // En ligne
      try {
        const response = await toggleTaskRealisee(id, updatedTask);
        dispatch({ type: "TOGGLE_TASK_REAISEE", payload: response.data });
      } catch (error) {
        console.error(
          "Erreur lors du changement de statut de la tâche :",
          error
        );
      }
    } else {
      // Hors ligne
      dispatch({
        type: "TOGGLE_TASK_REAISEE",
        payload: { ...updatedTask, id },
      });
      await networkQueue.addAction({
        type: "TOGGLE_TASK_REAISEE",
        payload: { ...updatedTask, id },
      });
    }
  };
