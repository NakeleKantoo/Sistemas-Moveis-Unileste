import { Alert, TouchableOpacity, TouchableOpacityProps, Text, View, AlertButton } from "react-native";
import { styles } from "./styles";
import React, { ReactNode } from "react";
import { Status, StatusType } from "@/components/Status";

type Props = TouchableOpacityProps & {
    title: string;
    description: string;
    value: number;
    status: StatusType;
    children?: ReactNode;
}

export function CardItem({ title, description, value, status, ...rest }: Props) {

    return (
        <TouchableOpacity style={styles.container} {...rest}>
            {/* Esquerda */}
            <View style={styles.column}>
                <Text style={{fontSize: 18, fontWeight:'bold'}}>{title}</Text>
                <Text style={{color: '#777'}}>{description}</Text>
            </View>

            {/* Direita */}
            <View style={styles.column}>
                <Status status={status}/>
                <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{fontSize:12, verticalAlign:'bottom', marginHorizontal:4}}>R$</Text>
                    <Text style={{fontSize:14, fontWeight: 'bold'}}>{value.toLocaleString('pt-BR')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}