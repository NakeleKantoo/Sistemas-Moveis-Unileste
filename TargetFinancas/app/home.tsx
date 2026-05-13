import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export type goalType = {
  id: string;
  title: string;
  current: number;
  total: number;
  transacoes: transactionType[];
}

export type transactionType = {
  id: string;
  valor: number;
  nome: string;
  meta_id: string;
}

export default function Dashboard() {
  const [goals, setGoals] = useState([] as goalType[]);

  const navigation = useNavigation();

  const db = useSQLiteContext();
  const getAllFromDatabase = async () => {
    let res = await db.getAllAsync(`
      SELECT
        m.id,
        m.title,
        m.total,
        COALESCE(SUM(t.valor), 0) AS current
      FROM meta m
      LEFT JOIN transacoes t ON t.meta_id = m.id
      GROUP BY m.id, m.title, m.total;
      `) as goalType[];
      res.map((v:goalType) => {return {...v, transacoes:[]}})
      return res;
  }


  const getGoals = async () => {
    setGoals(await getAllFromDatabase() as goalType[]);
  };

  navigation.addListener('focus', getGoals); //reload quando focar

  useEffect(() => { getGoals(); }, []);

  const calculateTotalMoney = async (): Promise<number> => {
    const total = await calculateGains() - await calculateLosses();
    return total;
  }

  const calculateGains = async (): Promise<number> => {
    let total = (await db.getFirstAsync(`SELECT sum(t.valor) as sum FROM transacoes t WHERE t.valor>0`)) as {sum:number};
    return total.sum??0;
  }

  const calculateLosses = async (): Promise<number> => {
    let total = (await db.getFirstAsync(`SELECT sum(t.valor) as sum FROM transacoes t WHERE t.valor<0`)) as {sum:number};
    return Math.abs(total.sum)??0;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Blue Header Section */}
      <LinearGradient colors={['#5B50FA', '#120026']} style={styles.header}>
        <Text style={styles.balanceLabel}>Total que você possui</Text>
        <Text style={styles.balanceAmount}>R$ {calculateTotalMoney()}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <View style={styles.statHeader}>
              <ArrowUp size={16} color="#4ADE80" />
              <Text style={styles.statLabel}>Entradas</Text>
            </View>
            <Text style={styles.statValue}>R$ {calculateGains()}</Text>
          </View>

          <View style={[styles.statsItem, { alignItems: 'flex-end' }]}>
            <View style={styles.statHeader}>
              <ArrowDown size={16} color="#F87171" />
              <Text style={styles.statLabel}>Saídas</Text>
            </View>
            <Text style={styles.statValue}>- R$ {calculateLosses()}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* White Goals Section */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Metas</Text>

        
          <FlatList showsVerticalScrollIndicator={false}
            data={goals}
            renderItem={(item) => {
              const goal = item.item; return <TouchableOpacity key={goal.id} style={styles.goalItem} onPress={() => navigation.navigate({ name: '[meta]', pathname: '/[meta]', params: { meta: goal.id } } as never)}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSubtext}>
                    {Math.max(goal.current / goal.total * 100, 0).toLocaleString('pt-BR').slice(0, 4)}% • R$ {goal.current.toLocaleString('pt-BR')} de R$ {goal.total?.toLocaleString('pt-BR')}
                  </Text>
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            }}
            keyExtractor={(item) => item.id}
          />
        

        {goals.length == 0 &&
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Nenhuma meta cadastrada.</Text>
          </View>
        }

      </View>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'add' } as never)}>
          <Text style={styles.buttonText}>Nova meta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: 'linear-gradient(180deg,rgba(91, 80, 250, 1) 0%, rgba(18, 0, 38, 1) 100%)'
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
  },
  statsItem: {
    flexDirection: 'column',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  goalSubtext: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#3B4CCA',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});