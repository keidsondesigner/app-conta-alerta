import { View, Text, TextInput, TouchableOpacity, Switch, Platform } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Bill } from '@/@types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotificationService } from '@/services/notifications';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

export function Add() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [description, setDescription] = useState('');
  const [paid, setPaid] = useState(false);
  const [notificationTime, setNotificationTime] = useState(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [enableNotification, setEnableNotification] = useState(true);

  const handleSave = async () => {
    if (!name.trim() || !amount.trim()) {
      alert('Por favor, preencha o nome e o valor da conta');
      return;
    }

    try {
      const storedBills = await AsyncStorage.getItem('bills');
      const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

      const billDueDate = new Date(dueDate);
      billDueDate.setHours(0, 0, 0, 0);

      const newBill: Bill = {
        id: Date.now().toString(),
        name: name.trim(),
        amount: parseFloat(amount.replace(',', '.')),
        dueDate: billDueDate.toISOString(),
        paid,
        description: description.trim(),
        notificationTime: format(notificationTime, 'HH:mm')
      };

      const updatedBills = [...bills, newBill];
      await AsyncStorage.setItem('bills', JSON.stringify(updatedBills));

      // Schedule notification if enabled
      if (enableNotification) {
        await NotificationService.scheduleNotification({
          id: newBill.id,
          title: 'Lembrete de Conta',
          body: `A conta ${newBill.name} vence hoje! Valor: R$ ${parseFloat(newBill.amount).toFixed(2)}`,
          date: newBill.dueDate,
          time: newBill.notificationTime,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Não foi possível salvar a conta');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome da Conta</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Aluguel"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Valor (R$)</Text>
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
            <MaterialIcons name="calendar-today" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Horário da Notificação</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {format(notificationTime, 'HH:mm')}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione uma descrição..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.switchField}>
          <Text style={styles.label}>Conta Paga</Text>
          <Switch
            value={paid}
            onValueChange={setPaid}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={paid ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchField}>
          <Text style={styles.label}>Notificação</Text>
          <Switch
            value={enableNotification}
            onValueChange={setEnableNotification}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={enableNotification ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={notificationTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                setNotificationTime(selectedTime);
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
