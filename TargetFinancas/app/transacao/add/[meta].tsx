import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react-native';
import { goalType, transactionType } from '@/app/home';
import { itemsStorage } from '@/components/Storage';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function NewTransactionScreen() {
  const [type, setType] = useState<'guardar' | 'resgatar'>('guardar');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');

  const router = useRouter();
  const metaid = useLocalSearchParams();

  const [goal, setGoal] = useState({} as goalType);

  const handleNewTransaction = async () => {
    const transaction = {} as transactionType;
    transaction.descricao = reason;
    transaction.valor = Number.parseFloat(value);
    transaction.id = value+Date.now();

    if (goal.transacoes == undefined) goal.transacoes = [];

    goal.transacoes.push(transaction);

    await itemsStorage.update(goal);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>Nova transação</Text>
              <Text style={styles.description}>
                A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar.
              </Text>

              {/* Seletor de Tipo (Tabs) */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, type === 'guardar' && styles.tabActive]}
                  onPress={() => setType('guardar')}
                >
                  <ArrowUp size={18} color={type === 'guardar' ? '#FFF' : '#999'} />
                  <Text style={[styles.tabText, type === 'guardar' && styles.tabTextActive]}>
                    Guardar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, type === 'resgatar' && styles.tabActiveResgatar]}
                  onPress={() => setType('resgatar')}
                >
                  <ArrowDown size={18} color={type === 'resgatar' ? '#FFF' : '#999'} />
                  <Text style={[styles.tabText, type === 'resgatar' && styles.tabTextActive]}>
                    Resgatar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input Valor */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={setValue}
                />
              </View>

              {/* Input Motivo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Motivo (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Investir em CDB de 110% no banco XPTO"
                  placeholderTextColor="#CCC"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity style={styles.saveButton} onPress={() => handleNewTransaction()}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#3B4CCA',
  },
  tabActiveResgatar: {
    backgroundColor: '#3B4CCA', // No screenshot parece manter a mesma cor azul para ambos os ativos
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#FFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#CCC',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#3B4CCA',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});