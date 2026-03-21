import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusType } from "@/components/Status"
import { Orcamento } from "@/pages/Main"
import { Alert } from "react-native"

const ITEMS_STORAGE_KEY = "@comprar:items"

export type ItemsStorage = Orcamento & {
    id: string
}

async function get(): Promise<ItemsStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)

    return storage ? JSON.parse(storage) : []
  } catch (error) {
    throw new Error("ITEMS_GET: " + error)
  }
}

async function getByStatus(status: StatusType): Promise<ItemsStorage[]> {
  const items = await get()
  return items.filter((item) => item.status === status)
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

async function changeStatus(itemUpdated: ItemsStorage): Promise<ItemsStorage[]> {
  const items = await get();
  
  const updatedItems = items.map(item=> {
    if (item.id === itemUpdated.id) {
      return {...item, status: itemUpdated.status};
    }
    return item;
  }) as ItemsStorage[];
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
  getByStatus,
  add,
  update,
  remove,
  removeAll,
  changeStatus,
}