import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_BASE } from '../config/api';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Required by newer versions
    shouldShowList: true,   // Required by newer versions
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission to receive push notifications failed');
    return null;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.error('Project ID not found in app.json');
      return null;
    }

    // Get the FCM token specifically (this is what the backend expects)
    const token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const saveTokenToBackend = async (fcmToken: string, userId: string, idToken?: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/notifications/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken ? `Bearer ${idToken}` : '', // If available
      },
      body: JSON.stringify({ fcmToken, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to save token to backend:', errorData);
      return false;
    }

    console.log('FCM Token saved to backend successfully');
    return true;
  } catch (error) {
    console.error('Error saving token to backend:', error);
    return false;
  }
};

export const setupNotificationListeners = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponseReceived?: (response: Notifications.NotificationResponse) => void
) => {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
    if (onNotificationReceived) onNotificationReceived(notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Response Received:', response);
    if (onNotificationResponseReceived) onNotificationResponseReceived(response);
  });

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
};
