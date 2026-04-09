import AsyncStorage from '@react-native-async-storage/async-storage';

const MEALS_KEY = '@RefeicoesApp:meals';

export interface Meal {
  id: string;
  title: string;
  description: string;
  time: string; // HH:mm
  date: string; // YYYY-MM-DD
}

export const getAllMeals = async (): Promise<Meal[]> => {
  try {
    const storage = await AsyncStorage.getItem(MEALS_KEY);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    console.error("Erro ao buscar refeições", error);
    return [];
  }
};

export const getMealsByDate = async (date: string): Promise<Meal[]> => {
  const all = await getAllMeals();
  return all.filter(meal => meal.date === date);
};

export const addMeal = async (newMeal: Omit<Meal, 'id'>) => {
  try {
    const all = await getAllMeals();
    const mealWithId = { ...newMeal, id: Date.now().toString() };
    
    const updated = [...all, mealWithId];
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Erro ao salvar refeição", error);
  }
};

export const updateMeal = async (id: string, updatedData: Partial<Meal>) => {
  try {
    const all = await getAllMeals();
    const updated = all.map(meal => 
      meal.id === id ? { ...meal, ...updatedData } : meal
    );
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Erro ao editar refeição", error);
  }
};

export const deleteMeal = async (id: string) => {
  try {
    const all = await getAllMeals();
    const filtered = all.filter(meal => meal.id !== id);
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Erro ao deletar refeição", error);
  }
};