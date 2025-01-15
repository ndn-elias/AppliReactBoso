import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  editTask,
  deleteTaskAction,
  toggleTaskRealiseeAction,
} from "../components/taskActions";
import { View, Text, ActivityIndicator } from "react-native";
import TodoItem from "./TodoItem";

export default function TodoList({ categorieFiltre }) {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Chargement des tâches...</Text>
      </View>
    );
  }

  // Application du filtre
  const filteredTasks = categorieFiltre
    ? tasks.filter((task) => task.categorie === categorieFiltre)
    : tasks;

  if (!filteredTasks || filteredTasks.length === 0) {
    return (
      <View>
        <Text>Aucune tâche à afficher pour cette catégorie.</Text>
      </View>
    );
  }

  return (
    <View>
      {filteredTasks.map((task) => (
        <TodoItem
          key={task.id}
          tache={task}
          onEditTodo={(id, updatedTask) => dispatch(editTask(id, updatedTask))}
          onDeleteTodo={(id) => dispatch(deleteTaskAction(id))}
          onToggleRealisee={(id) =>
            dispatch(toggleTaskRealiseeAction(id, task))
          }
        />
      ))}
    </View>
  );
}
