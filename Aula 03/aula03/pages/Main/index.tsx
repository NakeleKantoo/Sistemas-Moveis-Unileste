import React, { useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import styles from './styles'
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CardItem } from '@/components/CardItem';
import { Plus, Search, Settings2 } from 'lucide-react-native'
import { StatusType } from '@/components/Status';


type Orcamento = {
  title: string;
  description: string;
  value: number;
  status: StatusType;
}

const DATA = [
  {title: 'oi', description: 'oi', value: 1, status: 'Rascunho'} as Orcamento,
  {title: 'oi', description: 'oi', value: 2, status: 'Aprovado'} as Orcamento,
  {title: 'oi', description: 'oi', value: 3, status: 'Aprovado'} as Orcamento,
  {title: 'oi', description: 'oi', value: 40000, status: 'Aprovado'} as Orcamento,
] as Orcamento[];

const TABS = [
  'Todos',
  'Aprovado',
  'Rascunho',
  'Enviado',
  'Recusado',
]

type activeTabType = StatusType | 'Todos'


const Main = () => {
  const [orcamentos, setOrcamentos] = useState(DATA);
  const [displayOrcamentos, setDisplayOrcamentos] = useState(orcamentos);
  const [activeTab, setActiveTab] = useState('Todos' as activeTabType);

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

  function changeActiveTab(tabName: activeTabType) {
    switch (tabName) {
      case 'Aprovado':
        setDisplayOrcamentos(orcamentos.filter((orc) => orc.status == 'Aprovado'));
        break;  
      case 'Rascunho':
        setDisplayOrcamentos(orcamentos.filter((orc) => orc.status == 'Rascunho'));
        break;  
      case 'Recusado':
        setDisplayOrcamentos(orcamentos.filter((orc) => orc.status == 'Recusado'));
        break;  
      case 'Enviado':
        setDisplayOrcamentos(orcamentos.filter((orc) => orc.status == 'Enviado'));
        break;  
      case 'Todos':
        setDisplayOrcamentos(orcamentos);
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
        <Button style={[styles.right, styles.button]}>
          <Plus color={"#fff"} />
          <Text style={[{ fontSize: 18, color: '#fff', paddingLeft: 4, fontWeight: '500' }]}>Novo</Text>
        </Button>

      </View>


      <View style={[styles.flexRow, { gap: 8 }]}> {/* aqui é a seção dos inputs */}
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

      <View style={[styles.flexRow, {marginVertical: 8}]}> {/* aqui é a seção das abas */}
        <ScrollView horizontal style={{flex:1}} contentContainerStyle={{gap: 8}}>
          {TABS.map((tabName,i) => (
            <Button key={i} style={[styles.buttonTab, getActiveTabStyle(tabName as activeTabType)]}
            onPress={() => changeActiveTab(tabName as activeTabType)}>
              <Text style={{color:'#fff'}}>{tabName}</Text>
            </Button>  
          ))}
        </ScrollView>
      </View>

      <View style={styles.flexRow}> {/* aqui é a seção dos cards */}
        <FlatList
        data={displayOrcamentos}
        renderItem={({item}) => 
        <CardItem 
        title={item.title} 
        description={item.description} 
        value={item.value}
        status={item.status}
        />}
        keyExtractor={(item) => item.title+item.status+item.value}
        />
      </View>

    </View>
  );
}

export default Main;
