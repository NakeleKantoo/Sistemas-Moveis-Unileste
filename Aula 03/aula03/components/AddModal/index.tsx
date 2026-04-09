import { TouchableOpacity, TouchableOpacityProps, Text, View, ModalProps, Modal, Pressable } from "react-native";
import { styles } from "./styles";
import React, { ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "../Button";
import { PlusCircle, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusType } from "@/components/Status";
import { Orcamento } from "@/pages/Main";
import { ItemsStorage, itemsStorage } from '@/storage/ItemStorage'


type Props = ModalProps & {
    setVisible: (bool: boolean) => void;
    callback: (item: ItemsStorage) => Promise<void>;
}

const STATUS = ['Aprovado', 'Enviado', 'Rascunho', 'Recusado'];

export function AddModal({ callback, setVisible, visible, ...rest }: Props) {
    const insets = useSafeAreaInsets();
    const [currentStatus, setCurrentStatus] = useState(STATUS[0]);

    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ value, setValue ] = useState('');

    // --- ADD THIS EFFECT ---
    useEffect(() => {
        if (visible) {
            setTitle('');
            setDescription('');
            setValue('');
            setCurrentStatus(STATUS[0]);
        }
    }, [visible]);

    const getStatusStyle = (status:StatusType) => {
        if (currentStatus == status) {
            return styles.active   
        } else {
            return styles.inactive
        }
    }

    const addItem = async () => {
        const newOrcamento = {title, description, value: Number.parseFloat(value), status: currentStatus as StatusType} as Orcamento;
        await callback({...newOrcamento, id: Date.now()+title});
    }

    return (
        <Modal transparent={true} visible={visible} animationType="fade"
        onRequestClose={(v) => setVisible(false)}>
            <Pressable style={[styles.background]} onPress={() => setVisible(false)}>
                <View style={[styles.modal]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink:1 }}>
                        <Text style={{fontSize: 20, fontWeight:'500'}}>Adicionar orçamento</Text>
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
                            <Button activeOpacity={0.5} key={status} style={getStatusStyle(status as StatusType)} onPress={() => setCurrentStatus(status)}><Text style={{marginHorizontal: 'auto', color:'#fff'}}>{status}</Text></Button>
                        )}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        
                        <Button onPress={() => {addItem()}} style={{ alignItems: 'center', justifyContent:'center', gap: 8}}>
                            <PlusCircle color={"#fff"}/>
                            <Text style={{fontSize:16, color: '#fff'}}>Adicionar</Text>
                        </Button>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}