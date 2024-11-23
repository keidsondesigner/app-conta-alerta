import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermission() {
    try {
      if (Platform.OS === 'web') {
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      console.log('Notification permission granted');
    } catch (error) {
      console.log('Error requesting notification permission:', error);
    }
  },

  async scheduleNotification({ id, title, body, date, time }: { 
    id: string;
    title: string;
    body: string;
    date: Date;
    time: string;
  }) {
    try {
      await this.requestPermission();

      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0);

      // Verifica se a data é no passado
      if (scheduledDate.getTime() < Date.now()) {
        console.log('Cannot schedule notification for past date');
        return;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: scheduledDate,
        },
      });

      console.log('Notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  async cancelNotification(id: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.log('Notification cancelled:', id);
    } catch (error) {
      console.error('Error cancelling notification:', error);
      throw error;
    }
  },

  addListeners(
    onReceive?: (notification: Notifications.Notification) => void,
    onResponse?: (response: Notifications.NotificationResponse) => void
  ) {
    const subscriptions: any[] = [];

    if (onReceive) {
      const subscription = Notifications.addNotificationReceivedListener(onReceive);
      subscriptions.push(subscription);
    }

    if (onResponse) {
      const subscription = Notifications.addNotificationResponseReceivedListener(onResponse);
      subscriptions.push(subscription);
    }

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  },
};
