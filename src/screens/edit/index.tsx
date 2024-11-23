import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaterialIcons } from '@expo/vector-icons';
import { Bill } from '@/@types';
import { styles } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/routes';
import { NotificationService } from '@services/notifications';

type EditScreenProps = NativeStackScreenProps<RootStackParamList, 'edit'>;
type EditScreenRouteProp = EditScreenProps['route'];

export function Edit() {
  const navigation = useNavigation();
  const route = useRoute<EditScreenRouteProp>();
  const { id } = route.params;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [paid, setPaid] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadBill();
  }, []);

  const loadBill = async () => {
    try {
      const storedBills = await AsyncStorage.getItem('bills');
      if (storedBills) {
        const bills = JSON.parse(storedBills);
        const bill = bills.find((b: Bill) => b.id === id);
        if (bill) {
          setName(bill.name);
          setAmount(bill.amount.toString());
          setDueDate(parseISO(bill.dueDate));
          setDescription(bill.description || '');
          setPaid(bill.paid);
          setEnableNotification(!!bill.notificationTime);
          setNotificationTime(bill.notificationTime || '09:00');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conta:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da conta.');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome e o valor da conta.');
      return;
    }

    try {
      const storedBills = await AsyncStorage.getItem('bills');
      const bills = storedBills ? JSON.parse(storedBills) : [];
      const billIndex = bills.findIndex((b: Bill) => b.id === id);

      if (billIndex === -1) {
        Alert.alert('Erro', 'Conta não encontrada.');
        return;
      }

      // Cancel existing notification if it exists
      if (bills[billIndex].notificationTime) {
        await NotificationService.cancelNotification(id);
      }

      const updatedBill: Bill = {
        ...bills[billIndex],
        name: name.trim(),
        amount: parseFloat(amount),
        dueDate: dueDate.toISOString(),
        description: description.trim(),
        paid,
        notificationTime: enableNotification ? notificationTime : null,
      };

      // Schedule new notification if enabled
      if (enableNotification) {
        await NotificationService.scheduleNotification({
          id,
          title: 'Lembrete de Conta',
          body: `A conta ${name} vence hoje! Valor: R$ ${parseFloat(amount).toFixed(2)}`,
          date: dueDate,
          time: notificationTime,
          // repeat: 'day',
        });
      }

      bills[billIndex] = updatedBill;
      await AsyncStorage.setItem('bills', JSON.stringify(bills));
      
      Alert.alert('Sucesso', 'Conta atualizada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(format(selectedTime, 'HH:mm'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome da Conta</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome da conta"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data de Vencimento</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
              <MaterialIcons name="event" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Digite uma descrição"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.switchField}>
            <Text style={styles.label}>Conta Paga</Text>
            <Switch value={paid} onValueChange={setPaid} />
          </View>

          <View style={styles.switchField}>
            <Text style={styles.label}>Ativar Notificação</Text>
            <Switch value={enableNotification} onValueChange={setEnableNotification} />
          </View>

          {enableNotification && (
            <View style={styles.field}>
              <Text style={styles.label}>Horário da Notificação</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>{notificationTime}</Text>
                <MaterialIcons name="access-time" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={parseISO(`2000-01-01T${notificationTime}:00`)}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
