import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { ArrowLeft, Pencil, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, Link, useNavigation } from 'expo-router';
import { goalType } from './home';
import { itemsStorage } from '@/components/Storage';
import { FlatList } from 'react-native';

export default function GoalDetailScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const metaid = useLocalSearchParams();

    const [goal, setGoal] = useState({} as goalType);

    const loadItem = async () => {
        setGoal((await itemsStorage.getById(metaid.meta as string)).at(0)!);
    }

    useEffect(() => {
        loadItem();
    }, [])

    navigation.addListener('focus', loadItem);
    
    

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Personalizado */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}>
                    <Pencil size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Título da Meta */}
                <Text style={styles.goalTitle}>{goal?.title}</Text>

                {/* Seção de Progresso */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Valor guardado</Text>
                    <View style={styles.progressValueRow}>
                        <Text style={styles.savedAmount}>R$ {goal?.current?.toFixed(2).replace('.', ',')}</Text>
                        <Text style={styles.targetAmount}> de R$ {goal?.total?.toFixed(2).replace('.', ',')}</Text>
                        <Text style={styles.percentageText}>{(goal?.current/goal.total*100)?.toLocaleString('pt-BR').slice(0,4)}%</Text>
                    </View>

                    {/* Barra de Progresso Customizada */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${(goal.current/goal.total*100)}%` }]} />
                    </View>
                </View>

                {/* Seção de Transações */}
                <View style={styles.transactionsSection}>
                    <Text style={styles.sectionTitle}>Transações</Text>

                    <FlatList
                    data={goal.transacoes}
                    renderItem ={(i) => {const tx= i.item; return (
                        <View key={tx.id} style={styles.transactionItem}>
                            <View style={styles.txIconContainer}>
                                {tx.valor > 0 ? (
                                    <ArrowUpRight size={20} color="#3B4CCA" /> // Azul para entrada
                                ) : (
                                    <ArrowDownLeft size={20} color="#F87171" /> // Vermelho para saída
                                )}
                            </View>

                            <View style={styles.txDetails}>
                                <Text style={styles.txAmount}>
                                    {tx.valor < 0 ? `- R$ ${Math.abs(tx.valor).toFixed(2).replace('.', ',')}` : `R$ ${tx.valor.toFixed(2).replace('.', ',')}`}
                                </Text>
                                <View style={styles.txSubtextRow}>
                                    {tx.descricao ? (
                                        <Text style={styles.txDescription}> • {tx.descricao}</Text>
                                    ) : null}
                                </View>
                            </View>

                            <TouchableOpacity style={styles.deleteIconContainer}>
                                <X size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    )}} />
                </View>
            </ScrollView>

            {/* Botão Inferior Fixo */}
            <View style={styles.footer}>
                <Link href={{
                    pathname:'/transacao/add/[meta]',
                    params: {meta: goal.id}
                }} asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Nova transação</Text>
                </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        height: 60,
    },
    headerIcon: {
        padding: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Espaço para o botão fixo
    },
    goalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 20,
        marginBottom: 24,
    },
    progressContainer: {
        marginBottom: 40,
    },
    progressLabel: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
    },
    progressValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    savedAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    targetAmount: {
        fontSize: 14,
        color: '#999',
    },
    percentageText: {
        marginLeft: 'auto', // Empurra para a direita
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B4CCA', // Azul combinando com a marca
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3B4CCA',
        borderRadius: 3,
    },
    transactionsSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    txIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    txDetails: {
        flex: 1,
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    txSubtextRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txDate: {
        fontSize: 12,
        color: '#999',
    },
    txDescription: {
        fontSize: 12,
        color: '#999',
        flexShrink: 1, // Evita que texto longo quebre o layout
    },
    deleteIconContainer: {
        padding: 8,
        marginLeft: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        paddingBottom: 30, // Margem extra para home indicator
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    button: {
        backgroundColor: '#3B4CCA',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});