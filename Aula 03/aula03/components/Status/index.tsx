import { TouchableOpacityProps, Text, View } from "react-native";
import { styles } from "./styles";
import React, { ReactNode } from "react";

export type StatusType = 
"Aprovado" | 
"Rascunho" | 
"Recusado" |
"Enviado"

type Props = TouchableOpacityProps & {
    status: StatusType;
    children?: ReactNode;
}

function getTextoStyle(status: StatusType) { 
    switch (status) {
        case "Aprovado":
            return styles.Aprovadotexto;
        case "Enviado":
            return styles.Enviadotexto;
        case "Rascunho":
            return styles.Rascunhotexto;
        case "Recusado":
            return styles.Recusadotexto;
    }
}

function getFundoStyle(status: StatusType) { 
    switch (status) {
        case "Aprovado":
            return styles.Aprovadofundo;
        case "Enviado":
            return styles.Enviadofundo;
        case "Rascunho":
            return styles.Rascunhofundo;
        case "Recusado":
            return styles.Recusadofundo;
    }
}

export function Status({ status }: Props) {
    return (
        <View style={[styles.container, getFundoStyle(status)]}>
            <View style={[styles.ball, styles[status]]}></View>
            <Text style={[styles.texto, getTextoStyle(status)]}>{status as string}</Text>
        </View>
    );
}