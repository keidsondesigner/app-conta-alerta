import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NotificationService } from '@/services/notifications';
import { Routes } from '@/routes';
import { Loading } from '@/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  useEffect(() => {
    NotificationService.requestPermission();

    const unsubscribe = NotificationService.addListeners(
      (notification) => {
        console.log('Notification received:', notification);
      },
      (response) => {
        console.log('Notification response:', response);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </>
  );
}
