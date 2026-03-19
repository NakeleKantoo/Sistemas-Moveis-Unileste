import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 4,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        minHeight: 28
    },
    Aprovado: { backgroundColor: '#007700' },
    Rascunho: { backgroundColor: '#555555' },
    Enviado: { backgroundColor: '#2266bb'},
    Recusado: { backgroundColor: '#bb2222' },
    Aprovadotexto: { color: '#007700' },
    Rascunhotexto: { color: '#555555' },
    Enviadotexto:  { color: '#2266bb'},
    Recusadotexto: { color: '#bb2222' },
    Aprovadofundo: { backgroundColor: '#77dd77' },
    Rascunhofundo: { backgroundColor: '#bbbbbb' },
    Enviadofundo: { backgroundColor: '#77bbff' },
    Recusadofundo: { backgroundColor: '#ff7777' },
    ball:{
        width: 8,
        height: 8,
        borderRadius: 50,
        marginHorizontal:6
    },
    texto: {
        fontSize: 13,
        marginRight:4
    }
}); 