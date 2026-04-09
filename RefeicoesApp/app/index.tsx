import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, BarChart2 } from 'lucide-react-native';
import AddMealModal from '@/components/AddMealModal';
import { Meal, getMealsByDate } from '@/storage';
import EditMealModal from '@/components/EditMealModal';


export default function Home() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [meals, setMeals] = useState([] as Meal[]);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Função para carregar refeições (reutilizável)
  const loadMeals = async () => {
    const data = await getMealsByDate(today);
    setMeals(data.sort((a, b) => a.time.localeCompare(b.time)));
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleEditPress = (meal: Meal) => {
    setSelectedMeal(meal);       // Guarda qual refeição foi clicada
    setEditModalVisible(true);   // Abre o modal de edição
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Dieta</Text>
        <TouchableOpacity onPress={() => router.push('/statistics')}>
          <BarChart2 color="#333" size={28} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals} // Exemplo rápido
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.card}>
            <Text style={{ fontWeight: 'bold', backgroundColor: '#0002', padding: 4, borderRadius: 8 }}>{item.time}</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text style={{ color: '#666' }}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>

      <AddMealModal visible={modalVisible} onClose={() => { setModalVisible(false); loadMeals(); }} />
      <EditMealModal
        visible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedMeal(null); // Limpa a seleção ao fechar
        }}
        mealToEdit={selectedMeal} // Passa a refeição selecionada
        onMealUpdated={loadMeals} // Recarrega a lista após salvar ou apagar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50, paddingBottom: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: {
    padding: 15, backgroundColor: '#F0F0F0', borderRadius: 8, flexDirection: 'row', marginBottom: 10, alignItems: 'center',
    overflow: 'hidden', display: 'flex', gap: 10
  },
  fab: {
    position: 'absolute', bottom: 60, right: 20,
    backgroundColor: '#000', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  }
});