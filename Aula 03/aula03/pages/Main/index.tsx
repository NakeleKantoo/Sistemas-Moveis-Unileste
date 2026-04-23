import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles'
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CardItem } from '@/components/CardItem';
import { Plus, Search, Settings2 } from 'lucide-react-native'
import { StatusType } from '@/components/Status';
import { AddModal } from '@/components/AddModal';
import { ItemsStorage, itemsStorage } from '@/storage/ItemStorage';
import { EditModal } from '@/components/EditModal';


export type Orcamento = {
  id: string
  title: string;
  description: string;
  value: number;
  status: StatusType;
}

const TABS = [
  'Todos',
  'Aprovado',
  'Rascunho',
  'Enviado',
  'Recusado',
]

type activeTabType = StatusType | 'Todos'


const Main = () => {
  const [orcamentos, setOrcamentos] = useState([] as Orcamento[]);
  const [activeTab, setActiveTab] = useState('Todos' as activeTabType);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [itemEditing, setItemEditing] = useState({} as ItemsStorage)

  async function getOrcamentos() {
    setOrcamentos(await itemsStorage.get());
    const curr = activeTab
    changeActiveTab(curr);
  }

  useEffect(() => {
    getOrcamentos();
  }, []);

  async function handleAddOrcamento(orcamento: ItemsStorage) {
    await itemsStorage.add(orcamento);
    await getOrcamentos();
  }
  
  async function handleRemove(orcamento: ItemsStorage) {
    await itemsStorage.remove(orcamento);
    await getOrcamentos();
  }

  async function handleEditing(orcamento: ItemsStorage) {
    await itemsStorage.update(orcamento);
    await getOrcamentos();
  }

  function getNumberOfRascunhos():number {
    const somenteRascunhos = orcamentos.filter((orc) => orc.status=='Rascunho');
    return somenteRascunhos.length;
  }

  function getActiveTabStyle(tab:activeTabType) {
    if (activeTab==tab) {
      return styles.activeTab
    }
    return styles.inactiveTab
  }

  async function changeActiveTab(tabName: activeTabType) {
    switch (tabName) {
      case 'Todos':
        setOrcamentos(await itemsStorage.get())
        break;
      default:
        setOrcamentos(await itemsStorage.getByStatus(tabName));
        break;
    }
    setActiveTab(tabName);
  }

  



  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, styles.topRow]}>
        <View style={{ flexGrow: 1 }}>
          <Text style={[styles.h1, styles.purpleText]}>Orçamentos</Text>
          <Text style={[styles.p, styles.grayText]}>Você tem {getNumberOfRascunhos()} ite{getNumberOfRascunhos()==1? 'm': 'ns'} em rascunho</Text>
          {/* Aqui é o lado esquerdo superior*/}
        </View>


        {/*Lado direito superior */}
        <Button onPress={() => setAddModalVisible(true)} style={[styles.right, styles.button]}>
          <Plus color={"#fff"} />
          <Text style={[{ fontSize: 18, color: '#fff', paddingLeft: 4, fontWeight: '500' }]}>Novo</Text>
        </Button>
      </View>
      
      {/* aqui é a seção dos inputs */}
      <View style={[styles.flexRow, { gap: 8 }]}>
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Input placeholder='Título ou cliente'>
          <Search color='#4a4a4a' style={{ marginTop: 'auto', marginBottom: 'auto', marginHorizontal: 16 }} size={22} />
          </Input>
        </View>
        <View style={{ flexShrink: 1 }}>
          <Button style={[styles.right, styles.button, { backgroundColor: '#fff', borderColor: '#f0f0f0', borderWidth: 2 }]}>
            <Settings2 color='#6a46eb' />
          </Button>
        </View>
      </View>
      
      {/* aqui é a seção das abas */}
      <View style={[styles.flexRow, {marginVertical: 8}]}>
        <ScrollView horizontal style={{flex:1}} contentContainerStyle={{gap: 8}} showsHorizontalScrollIndicator={false}>
          {TABS.map((tabName,i) => (
            <Button key={i} style={[styles.buttonTab, getActiveTabStyle(tabName as activeTabType)]}
            onPress={() => changeActiveTab(tabName as activeTabType)}>
              <Text style={{color:'#fff'}}>{tabName}</Text>
            </Button>  
          ))}
        </ScrollView>
      </View>

      {/* aqui é a seção dos cards */}
      <View style={styles.flexRow}>
        <FlatList
        data={orcamentos}
        renderItem={({item}) => 
        <CardItem 
        title={item.title} 
        description={item.description} 
        value={item.value}
        status={item.status}
        onPress={() => {setItemEditing(item); setEditing(true);}}
        />}
        keyExtractor={(item) => item.id}
        />
      </View>


      <AddModal visible={addModalVisible} setVisible={setAddModalVisible} callback={async (orc:ItemsStorage) => {await handleAddOrcamento(orc); setAddModalVisible(false)}}/>
      <EditModal visible={editing} setVisible={setEditing} onEdit={async (i:ItemsStorage) => {await handleEditing(i); setEditing(false)}} item={itemEditing} onRemove={async (orc:ItemsStorage) => {await handleRemove(orc); setEditing(false)}}/>
    </View>
  );
}

export default Main;
