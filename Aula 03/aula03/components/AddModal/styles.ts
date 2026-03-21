import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modal: {
        maxHeight: '90%',
        minHeight: '50%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        flexDirection: 'column',
        gap: 16,
    },
    background: {
        backgroundColor: '#000a',
        height:'100%',
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end'
    },
    active: {
        
    },
    inactive: {
        backgroundColor: '#333'
    }
}); 