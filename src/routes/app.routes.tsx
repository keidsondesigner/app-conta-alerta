import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '@/screens/home';
import { Add } from '@/screens/add';
import { Edit } from '@/screens/edit';
import { Details } from '@/screens/details';

export type RootStackParamList = {
  home: undefined;
  add: undefined;
  edit: { id: string };
  details: { id: string };
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#00875F'
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Roboto_700Bold'
        }
      }}
    >
      <Screen 
        name="home"
        component={Home}
        options={{
          title: 'Minhas Contas'
        }}
      />
      <Screen 
        name="add"
        component={Add}
        options={{
          title: 'Nova Conta'
        }}
      />
      <Screen 
        name="edit"
        component={Edit}
        options={{
          title: 'Editar Conta'
        }}
      />
      <Screen 
        name="details"
        component={Details}
        options={{
          title: 'Detalhes da Conta'
        }}
      />
    </Navigator>
  );
}
