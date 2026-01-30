import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
};

export const scheduleMedicalReminder = async (title: string, dateString: string, petName: string) => {
//   const triggerDate = new Date(dateString);
//   triggerDate.setHours(8, 0, 0); 
  const triggerDate = new Date();
  triggerDate.setSeconds(triggerDate.getSeconds() + 5);

  if (triggerDate.getTime() <= new Date().getTime()) return;

  try {
    // Local notification එකක් පමණක් schedule කිරීම
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🐾 Reminder for ${petName}!`,
        body: `Today is: ${title}`,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    console.log("Local notification set!");
  } catch (error) {
    console.log("Scheduling error: ", error);
  }
};