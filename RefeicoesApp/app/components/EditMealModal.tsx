import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Clock, Trash2 } from 'lucide-react-native';
// Importe suas funções de storage aqui. Ajuste o caminho se necessário.
import { updateMeal, deleteMeal, Meal } from '../storage';

interface EditMealModalProps {
    visible: boolean;
    onClose: () => void;
    onMealUpdated: () => void; // Função para atualizar a lista na tela principal
    mealToEdit: Meal | null;    // A refeição que foi clicada para editar
}

export default function EditMealModal({ visible, onClose, onMealUpdated, mealToEdit }: EditMealModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');

    // Efeito para preencher os campos quando o modal abre com uma refeição
    useEffect(() => {
        if (visible && mealToEdit) {
            setTitle(mealToEdit.title);
            setDescription(mealToEdit.description);
            setTime(mealToEdit.time);
        } else if (!visible) {
            // Limpa os campos ao fechar para não aparecer lixo na próxima vez
            setTitle('');
            setDescription('');
            setTime('');
        }
    }, [visible, mealToEdit]);

    const handleUpdate = async () => {
        if (!title.trim() || !time.trim()) {
            Alert.alert('Aviso', 'Título e Horário são obrigatórios.');
            return;
        }

        if (!mealToEdit) return; // Segurança contra nulos

        try {
            // Chama a função do AsyncStorage que criamos
            await updateMeal(mealToEdit.id, {
                title: title.trim(),
                description: description.trim(),
                time: time.trim()
                // O ID e a DATA não mudam na edição simples
            });

            Alert.alert('Sucesso', 'Refeição atualizada!');
            onMealUpdated(); // Avisa a Home pra recarregar a lista
            onClose();       // Fecha o modal
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar a refeição.');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!mealToEdit) return;

        Alert.alert(
            "Apagar Refeição",
            `Tem certeza que deseja apagar "${mealToEdit.title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMeal(mealToEdit.id);
                            onMealUpdated(); // Atualiza a lista na Home
                            onClose();       // Fecha o modal
                        } catch (e) {
                            Alert.alert('Erro', 'Não foi possível apagar.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.content}>
                    {/* Header do Modal com botão de apagar extra */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar Refeição</Text>
                        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                            <TouchableOpacity onPress={handleDelete}>
                                <Trash2 color="#E74C3C" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ }}>
                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Whey Protein"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Opcional"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.label}>Horário</Text>


                        <TextInput
                            style={[styles.input]}
                            placeholder="ex: 12:30"
                            value={time}
                            onChangeText={setTime}
                            keyboardType="numbers-and-punctuation" // Facilita digitar ":"
                        />


                        {/* Container de Botões */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                                <Text style={styles.btnCancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleUpdate}>
                                <Text style={styles.btnSaveText}>Salvar Alterações</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    content: {
        backgroundColor: '#FFF',
        padding: 25,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%' // Não deixa o modal ocupar a tela toda se tiver muita descrição
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
    input: {
        borderWidth: 2,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FAFAFA'
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 35,
        marginBottom: 15
    },
    btn: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    btnCancel: { backgroundColor: '#F0F0F0' },
    btnCancelText: { color: '#555', fontWeight: '600', fontSize: 16 },
    btnSave: { backgroundColor: '#000' },
    btnSaveText: { color: '#FFF', fontWeight: '600', fontSize: 16 }
});