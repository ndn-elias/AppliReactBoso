// taskActions.js
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskRealisee,
} from "../app/(tabs)/api";
import { networkQueue } from "../services/networkQueue"; // Pour la file hors-ligne
import NetInfo from "@react-native-community/netinfo"; // Pour vérifier l'état du réseau
import { scheduleNotification } from "../services/notificationsService"; // Pour les notifications

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
// Création d'une tâche avec programmation de notification
export const createTask = (task) => async (dispatch) => {
  const netState = await NetInfo.fetch();
  const isConnected = netState.isConnected;

  if (isConnected) {
    try {
      const response = await addTask(task); // Envoi direct à l'API
      dispatch({ type: "ADD_TASK", payload: response.data });

      if (task.dateExecution) {
        await scheduleNotification({
          texte: task.texte,
          dateExecution: new Date(task.dateExecution), // S'assurer que c'est une date valide
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
    }
  } else {
    const tempId = `temp-${Date.now()}`;
    dispatch({ type: "ADD_TASK", payload: { ...task, id: tempId } });
    await networkQueue.addAction({ type: "ADD_TASK", payload: task });
  }
};

// -------------------------------------------------
// Édition d'une tâche
export const editTask = (id, updatedTask) => async (dispatch) => {
  const netState = await NetInfo.fetch();
  const isConnected = netState.isConnected;

  if (isConnected) {
    try {
      const response = await updateTask(id, updatedTask);
      dispatch({ type: "EDIT_TASK", payload: response.data });

      // Mettre à jour la notification si la date d'exécution est modifiée
      if (updatedTask.dateExecution) {
        await scheduleNotification(updatedTask);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche :", error);
    }
  } else {
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
    try {
      await deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  } else {
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
      try {
        const response = await toggleTaskRealisee(id, updatedTask);
        dispatch({ type: "TOGGLE_TASK_REALISEE", payload: response.data });
      } catch (error) {
        console.error(
          "Erreur lors du changement de statut de la tâche :",
          error
        );
      }
    } else {
      dispatch({
        type: "TOGGLE_TASK_REALISEE",
        payload: { ...updatedTask, id },
      });
      await networkQueue.addAction({
        type: "TOGGLE_TASK_REALISEE",
        payload: { ...updatedTask, id },
      });
    }
  };
