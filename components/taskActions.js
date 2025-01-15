import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskRealisee,
} from "../app/(tabs)/api";

export const fetchTasks = () => async (dispatch) => {
  dispatch({ type: "TASKS_LOADING" }); // Définir isLoading à true
  try {
    const response = await getTasks(); // Appel API pour récupérer les tâches
    console.log("Tâches récupérées :", response.data); // Log pour vérifier les données
    dispatch({ type: "SET_TASKS", payload: response.data });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
  } finally {
    dispatch({ type: "TASKS_LOADING_DONE" }); // Définir isLoading à false
  }
};

export const createTask = (task) => async (dispatch) => {
  try {
    console.log("Données envoyées à MockAPI :", task); // Vérifiez les données envoyées
    const response = await addTask(task);
    console.log("Réponse de MockAPI :", response.data); // Vérifiez la réponse
    dispatch({ type: "ADD_TASK", payload: response.data });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
  }
};

export const editTask = (id, updatedTask) => async (dispatch) => {
  try {
    const response = await updateTask(id, updatedTask); // API call
    dispatch({ type: "EDIT_TASK", payload: response.data }); // Redux store update
  } catch (error) {
    console.error("Erreur lors de la modification de la tâche :", error);
  }
};

export const deleteTaskAction = (id) => async (dispatch) => {
  try {
    await deleteTask(id); // Appel API pour supprimer la tâche
    dispatch({ type: "DELETE_TASK", payload: id }); // Mise à jour Redux
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
  }
};

export const toggleTaskRealiseeAction =
  (id, currentTask) => async (dispatch) => {
    try {
      const updatedTask = {
        ...currentTask,
        estRealisee: !currentTask.estRealisee,
      }; // Inverse le statut
      const response = await toggleTaskRealisee(id, updatedTask); // Appel API
      dispatch({ type: "TOGGLE_TASK_REAISEE", payload: response.data }); // Mise à jour Redux
    } catch (error) {
      console.error("Erreur lors du changement de statut de la tâche :", error);
    }
  };
