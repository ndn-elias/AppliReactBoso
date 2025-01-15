import axios from "axios";

// URL de base de votre API MockAPI
const API_URL = "https://67876aa8c4a42c9161069af1.mockapi.io/taches"; // Assurez-vous que cette URL est correcte

// Fonctions pour les opérations CRUD
export const getTasks = () => axios.get(API_URL);
export const addTask = async (task) => {
  return await axios.post(API_URL, task); // Envoie la requête POST avec les données
};
export const updateTask = (id, updatedTask) => {
  return axios.put(`${API_URL}/${id}`, updatedTask);
};

export const deleteTask = (id) => {
  return axios.delete(
    `https://67876aa8c4a42c9161069af1.mockapi.io/taches/${id}`
  );
};

export const toggleTaskRealisee = (id, updatedTask) => {
  return axios.put(
    `https://67876aa8c4a42c9161069af1.mockapi.io/taches/${id}`,
    updatedTask
  );
};
