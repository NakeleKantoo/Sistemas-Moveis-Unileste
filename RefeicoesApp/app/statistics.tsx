import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Timer, Hash, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getMealsByDate, Meal } from '@/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Função para gerar os últimos 7 dias (ou quantos você quiser)
const getLastDays = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse(); // Do mais antigo para hoje
};

export default function Statistics() {
  const router = useRouter();
  const days = getLastDays(7); // Geramos uma semana de histórico
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estado para armazenar as refeições de cada dia carregado
  const [dataByDay, setDataByDay] = useState<Record<string, Meal[]>>({});

  useEffect(() => {
    loadAllDays();
  }, []);

  const loadAllDays = async () => {
    const results: Record<string, Meal[]> = {};
    for (const day of days) {
      const dayMeals = await getMealsByDate(day);
      results[day] = dayMeals.sort((a, b) => a.time.localeCompare(b.time));
    }
    setDataByDay(results);
    
    // Inicia o Scroll no último dia (hoje)
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH * (days.length - 1), animated: false });
    }, 100);
  };

  // Funções de auxílio de tempo (mesmas do anterior)
  const getMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const formatDiff = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Intervalos</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          // Aqui você poderia carregar mais dias se o usuário chegar no início
        }}
      >
        {days.map((date) => (
          <View key={date} style={styles.page}>
            <View style={styles.dateBanner}>
               <Text style={styles.dateLabel}>
                {date === new Date().toISOString().split('T')[0] ? "Hoje" : date.split('-').reverse().join('/')}
               </Text>
               <Text style={styles.swipeHint}>← arraste para ver outros dias →</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
              <View style={styles.miniCard}>
                <Hash color="#333" size={20} />
                <Text style={styles.miniValue}>{dataByDay[date]?.length || 0} refeições</Text>
              </View>

              {dataByDay[date]?.map((meal, index, array) => {
                const nextMeal = array[index + 1];
                let diffText = "";
                if (nextMeal) {
                  const diff = getMinutes(nextMeal.time) - getMinutes(meal.time);
                  diffText = formatDiff(diff);
                }

                return (
                  <View key={meal.id} style={styles.timelineItem}>
                    <View style={styles.timelineLine}>
                      <View style={styles.dot} />
                      {nextMeal && <View style={styles.line} />}
                    </View>
                    <View style={styles.mealInfo}>
                      <View style={styles.mealCard}>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                      </View>
                      {nextMeal && (
                        <View style={styles.intervalBadge}>
                          <Timer size={14} color="#666" />
                          <Text style={styles.intervalText}>Intervalo: {diffText}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}

              {(!dataByDay[date] || dataByDay[date].length === 0) && (
                <Text style={styles.emptyText}>Sem registros para este dia.</Text>
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingVertical: 32 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  page: { width: SCREEN_WIDTH, flex: 1 },
  dateBanner: { 
    padding: 15, 
    backgroundColor: '#F8F9FA', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  dateLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  swipeHint: { fontSize: 10, color: '#999', marginTop: 4 },
  miniCard: { 
    backgroundColor: '#F0F0F0', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  miniValue: { fontSize: 18, fontWeight: 'bold' },
  timelineItem: { flexDirection: 'row', minHeight: 70 },
  timelineLine: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333' },
  line: { width: 2, flex: 1, backgroundColor: '#DDD' },
  mealInfo: { flex: 1, paddingBottom: 15 },
  mealCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  mealTime: { fontSize: 11, fontWeight: 'bold' },
  mealTitle: { fontSize: 15 },
  intervalBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8, 
    marginLeft: 5 
  },
  intervalText: { fontSize: 12, color: '#666', marginLeft: 5 },
  emptyText: { textAlign: 'center', color: '#CCC', marginTop: 50, fontSize: 16 }
});