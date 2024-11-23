import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Bill, FilterStatus } from '@/@types';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Alert, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Text
} from 'react-native';
import { styles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/routes';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'home'>;

export function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const loadBills = async () => {
    try {
      const storedBills = await AsyncStorage.getItem('bills');
      if (storedBills) {
        const parsedBills = JSON.parse(storedBills);
        const validBills = parsedBills.map((bill: any) => ({
          id: bill.id || Date.now().toString(),
          name: bill.name || bill.title || 'Sem nome',
          amount: typeof bill.amount === 'number' ? bill.amount : 0,
          dueDate: bill.dueDate || new Date().toISOString(),
          paid: Boolean(bill.paid),
          description: bill.description || '',
          notificationTime: bill.notificationTime || ''
        }));
        setBills(validBills);
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as contas');
    }
  };

  useFocusEffect(() => {
    loadBills();
  });

  const handleDeleteBill = async (id: string) => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir esta conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedBills = bills.filter(bill => bill.id !== id);
              await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));
              setBills(updatedBills);
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert('Erro', 'Não foi possível excluir a conta');
            }
          }
        }
      ]
    );
  };

  const filteredBills = bills
    .filter(bill => {
      const billDate = new Date(bill.dueDate);
      return billDate.getMonth() === selectedMonth;
    })
    .filter(bill => {
      if (filterStatus === 'paid') return bill.paid;
      if (filterStatus === 'unpaid') return !bill.paid;
      return true;
    })
    .filter(bill =>
      bill.name.toLowerCase().includes(searchText.toLowerCase())
    );

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = filteredBills.filter(bill => bill.paid).reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidAmount = filteredBills.filter(bill => !bill.paid).reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conta..."
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))}
          >
            <MaterialIcons name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>{months[selectedMonth]}</Text>
          
          <TouchableOpacity
            onPress={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))}
          >
            <MaterialIcons name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'paid' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('paid')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'paid' && styles.filterButtonTextActive]}>
              Pagas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'unpaid' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('unpaid')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'unpaid' && styles.filterButtonTextActive]}>
              Não Pagas
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>R$ {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pago:</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              R$ {paidAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>A Pagar:</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              R$ {unpaidAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredBills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.billCard}
            onPress={() => navigation.navigate('details', { id: item.id })}
          >
            <View style={styles.billHeader}>
              <Text style={styles.billName}>{item.name}</Text>
              <View style={styles.billActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('edit', { id: item.id })}
                  style={styles.actionButton}
                >
                  <MaterialIcons name="edit" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteBill(item.id)}
                  style={styles.actionButton}
                >
                  <MaterialIcons name="delete" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.billInfo}>
              <Text style={styles.billAmount}>
                R$ {item.amount.toFixed(2)}
              </Text>
              <Text style={styles.billDueDate}>
                Vence em {format(new Date(item.dueDate), "dd 'de' MMMM", { locale: ptBR })}
              </Text>
              <View style={styles.billStatus}>
                <MaterialIcons
                  name={item.paid ? "check-circle" : "schedule"}
                  size={16}
                  color={item.paid ? "#4CAF50" : "#F44336"}
                />
                <Text style={[styles.billStatusText, { color: item.paid ? "#4CAF50" : "#F44336" }]}>
                  {item.paid ? "Pago" : "Pendente"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('add')}
      >
        <MaterialIcons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
