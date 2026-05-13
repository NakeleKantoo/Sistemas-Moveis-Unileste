import { goalType } from '@/app/home';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function AddGoalScreen() {
    const [goalName, setGoalName] = useState('');
    const [targetValue, setTargetValue] = useState('');

    const router = useRouter();
    const metaid = useLocalSearchParams();

    const [goal, setGoal] = useState({} as goalType);

    const db = useSQLiteContext();

    const loadItem = async () => {
        const g = await db.getFirstAsync(`SELECT * FROM meta WHERE meta.id=?`,[metaid.meta as string])! as goalType;
        setGoal(g);
        setGoalName(g?.title);
        setTargetValue(g?.total.toString());
    }

    useEffect(() => {
        loadItem();
    }, [])

    const handleAddGoals = async () => {
        const g = { id: goal.id, title: goalName, total: Number.parseFloat(targetValue), current: goal.current, transacoes: goal.transacoes } as goalType;

        await db.runAsync(`UPDATE meta SET title=?, total=? WHERE id=?`, [g.title,g.total,metaid.meta as string]);

        router.back();
    }

    const handleRemoveGoal = async () => {

        const remove = async () => {
            await db.runAsync(`DELETE FROM meta WHERE id=?`, [metaid.meta as string]);
            await db.runAsync(`DELETE FROM transacoes WHERE meta_id=?`,[metaid.meta as string]);
            router.navigate('/home');
        }

        Alert.alert('Tem certeza?', 'Remover a meta é permanente.', [{ text: 'Sim', onPress: async () => await remove()}, { text: 'Não' }])
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>

                        {/* Header com botão voltar */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => { router.back() }}>
                                <ArrowLeft size={28} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemoveGoal()}>
                                <Trash2 size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.instructionText}>
                                Economize para alcançar sua meta financeira.
                            </Text>

                            {/* Campo: Nome da Meta */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome da meta</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Viagem para praia, Apple Watch"
                                    placeholderTextColor="#CCC"
                                    value={goalName}
                                    onChangeText={setGoalName}
                                />
                            </View>

                            {/* Campo: Valor Alvo */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Valor alvo (R$)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0,00"
                                    placeholderTextColor="#CCC"
                                    keyboardType="numeric"
                                    value={targetValue}
                                    onChangeText={setTargetValue}
                                />
                            </View>

                            {/* Botão Salvar */}
                            <TouchableOpacity style={styles.saveButton} onPress={() => { handleAddGoals() }}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    inner: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        height: 60,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    instructionText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 40,
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        fontSize: 18,
        color: '#333',
        paddingVertical: 8,
    },
    saveButton: {
        backgroundColor: '#3B4CCA',
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});