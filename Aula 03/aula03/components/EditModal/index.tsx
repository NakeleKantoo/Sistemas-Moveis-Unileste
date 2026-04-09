import { Text, View, ModalProps, Modal, Alert, Pressable } from "react-native";
import { styles } from "./styles";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "../Button";
import { PencilLine, Trash2, X } from "lucide-react-native";
import { StatusType } from "@/components/Status";
import { Orcamento } from "@/pages/Main";
import { ItemsStorage, itemsStorage } from '@/storage/ItemStorage'


type Props = ModalProps & {
    setVisible: (bool: boolean) => void;
    onEdit: (item: ItemsStorage) => Promise<void>;
    onRemove: (item: ItemsStorage) => Promise<void>;
    item: ItemsStorage;
}

const STATUS = ['Aprovado', 'Enviado', 'Rascunho', 'Recusado'];

export function EditModal({item, onEdit, onRemove, setVisible, visible, ...rest }: Props) {
    const [currentStatus, setCurrentStatus] = useState(item.status);
    
    const [ title, setTitle ] = useState(item.title);
    const [ description, setDescription ] = useState(item.description);
    const [ value, setValue ] = useState(item.value?.toString());
    const id = item.id

    // --- ADD THIS EFFECT ---
    useEffect(() => {
        if (visible && item) {
            setTitle(item.title || '');
            setDescription(item.description || '');
            setValue(item.value?.toString() || '');
            setCurrentStatus(item.status);
        }
    }, [item, visible]);

    const getStatusStyle = (status:StatusType) => {
        if (currentStatus == status) {
            return styles.active   
        } else {
            return styles.inactive
        }
    }

    const editItem = async () => {
        const newOrcamento = {title, description, value: Number.parseFloat(value), status: currentStatus as StatusType} as Orcamento;
        await onEdit({...newOrcamento, id});
    }

    return (
        <Modal transparent={true} visible={visible} animationType="slide"
        onRequestClose={(v) => setVisible(false)}
        >
            <Pressable style={[styles.background]} onPress={() => setVisible(false)}>
                <View style={[styles.modal]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink:1 }}>
                        <Text style={{fontSize: 20, fontWeight:'500'}}>Editar orçamento</Text>
                        <Button onPress={() => setVisible(false)} style={{ marginLeft: 'auto', padding: 4, maxWidth: 32, maxHeight: 32, backgroundColor: '#f00' }}><X color={"#fff"} /></Button>
                    </View>

                    <Input placeholder="Titulo"
                        value={title}
                        onChangeText={(t) => setTitle(t)}
                        
                    ></Input>
                    <Input placeholder="Descrição"
                        value={description}
                        onChangeText={(t) => setDescription(t)}
                    ></Input>

                    <Input placeholder="Valor"
                        value={value}
                        onChangeText={(t) => setValue(t)}
                    ></Input>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8}}>
                        {STATUS.map((status) =>
                            <Button activeOpacity={0.5} key={status} style={getStatusStyle(status as StatusType)} onPress={() => setCurrentStatus(status as StatusType)}><Text style={{marginHorizontal: 'auto', color:'#fff'}}>{status}</Text></Button>
                        )}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        
                        <Button onPress={() => {editItem()}} style={{ alignItems: 'center', justifyContent:'center', gap: 8}}>
                            <PencilLine color={"#fff"}/>
                            <Text style={{fontSize:16, color: '#fff'}}>Editar</Text>
                        </Button>
                        <Button onPress={() => {
                            Alert.alert('Tem certeza?', 'Tem certeza que deseja remover esse item?', 
                                [{text:'Sim', onPress: async () => await onRemove(item)}, {text: 'Não'}])
                            }} style={{ alignItems: 'center', justifyContent:'center', gap: 8, backgroundColor: '#d66'}}>
                            <Trash2 color={"#fff"}/>
                            <Text style={{fontSize:16, color: '#fff'}}>Remover</Text>
                        </Button>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}