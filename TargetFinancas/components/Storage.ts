import { goalType } from "@/app/home"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

const ITEMS_STORAGE_KEY = "@target:financas"

export type ItemsStorage = goalType

async function get(): Promise<ItemsStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)

    return storage ? JSON.parse(storage) : []
  } catch (error) {
    throw new Error("ITEMS_GET: " + error)
  }
}

async function getById(id: string): Promise<ItemsStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)

    const array =  storage ? JSON.parse(storage) as ItemsStorage[] : []
    const res = array.filter((v) => v.id == id);
    return res;
  } catch (error) {
    throw new Error("ITEMS_GET: " + error)
  }
}

async function save(items: ItemsStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    throw new Error("ITEMS_SAVE: " + error)
  }
}

async function add(newItem: ItemsStorage): Promise<ItemsStorage[]> {
  const items = await get()
  const updatedItems = [...items, newItem]
  await save(updatedItems)
  
  return updatedItems
}

async function remove(oldItem: ItemsStorage): Promise<ItemsStorage[]> {
  const items = await get();
  
  const updatedItems = items.filter(item=> item.id !== oldItem.id);
  await save(updatedItems);
  
  return updatedItems;
}

async function removeAll(): Promise<ItemsStorage[]> {
  const items = await get();
  
  const updatedItems = items.filter(item=>false);
  await save(updatedItems);
  
  return updatedItems;
}

async function update(itemUpdated: ItemsStorage): Promise<ItemsStorage[]> {
  const items = await get();
  
  const updatedItems = items.map(item=> {
    if (item.id === itemUpdated.id) {
      return itemUpdated;
    }
    return item;
  }) as ItemsStorage[];
  await save(updatedItems);
  
  return updatedItems;
}

export const itemsStorage = {
  get,
  getById,
  add,
  update,
  remove,
  removeAll,
}