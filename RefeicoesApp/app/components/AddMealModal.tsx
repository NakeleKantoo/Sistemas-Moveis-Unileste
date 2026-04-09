import { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { addMeal } from '@/storage';

export default function AddMealModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [time, setTime] = useState('')

    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    
    // No botão de salvar do seu modal
    const handleSave = async () => {
        await addMeal({
            title,
            description,
            time,
            date: today
        });
        onClose(); // Fecha o modal
    };


    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.modalTitle}>Nova Refeição</Text>

                    <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={(t) => setTitle(t)} />
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Descrição" multiline value={description} onChangeText={(t) => setDescription(t)} />
                    <TextInput style={styles.input} placeholder="Horário (ex: 12:30)" value={time} onChangeText={(t) => setTime(t)} />

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#EEE' }]} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#000', flex: 1 }]} onPress={ handleSave }>
                            <Text style={{ color: '#FFF', textAlign: 'center' }}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    content: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 10 },
    btn: { padding: 15, borderRadius: 8, alignItems: 'center' }
});