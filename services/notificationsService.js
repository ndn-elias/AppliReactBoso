import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configuration initiale des notifications
export async function configureNotifications() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission pour les notifications refusée!");
      return;
    }
  } else {
    alert(
      "Les notifications push ne fonctionnent que sur un appareil physique."
    );
  }
}

// Programmation d’une notification
export async function scheduleNotification(task) {
  const { texte, dateExecution } = task;

  if (!dateExecution) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel de tâche",
        body: `La tâche "${texte}" doit être exécutée.`,
      },
      trigger: new Date(dateExecution),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la programmation de la notification :",
      error
    );
  }
}
