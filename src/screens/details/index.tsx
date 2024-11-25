import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bill } from '@/@types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/currency';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/routes';

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'details'>;
type DetailsScreenRouteProp = DetailsScreenProps['route'];

export function Details() {
  const navigation = useNavigation();
  const route = useRoute<DetailsScreenRouteProp>();
  const { id } = route.params;
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    loadBill();
  }, []);

  const loadBill = async () => {
    try {
      const storedBills = await AsyncStorage.getItem('bills');
      if (storedBills) {
        const bills = JSON.parse(storedBills);
        const foundBill = bills.find((b: Bill) => b.id === id);
        if (foundBill) {
          setBill(foundBill);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conta:', error);
    }
  };

  if (!bill) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{bill.name}</Text>
        
        <View style={styles.row}>
          <MaterialIcons name="attach-money" size={24} color="#4CAF50" />
          <Text style={styles.label}>Valor:</Text>
          <Text style={styles.value}>{formatCurrency(bill.amount)}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="event" size={24} color="#2196F3" />
          <Text style={styles.label}>Vencimento:</Text>
          <Text style={styles.value}>
            {format(parseISO(bill.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons 
            name={bill.paid ? "check-circle" : "schedule"} 
            size={24} 
            color={bill.paid ? "#4CAF50" : "#F44336"} 
          />
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: bill.paid ? "#4CAF50" : "#F44336" }]}>
            {bill.paid ? "Pago" : "Pendente"}
          </Text>
        </View>

        {bill.notificationTime && (
          <View style={styles.row}>
            <MaterialIcons name="notifications" size={24} color="#FFA000" />
            <Text style={styles.label}>Notificação:</Text>
            <Text style={styles.value}>{bill.notificationTime}</Text>
          </View>
        )}

        {bill.description && (
          <View style={styles.descriptionContainer}>
            <MaterialIcons name="description" size={24} color="#607D8B" />
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.description}>{bill.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('edit', { id: bill.id })}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
