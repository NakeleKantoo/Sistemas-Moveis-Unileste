import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { LucideIcon, View } from "lucide-react-native"; // Better typing
import { styles } from "./styles";
import React, { ReactNode } from "react";

type Props = TouchableOpacityProps & {
    children?: ReactNode;
}

export function Button({ children, style, ...rest }: Props) {

    return (
        <TouchableOpacity style={[styles.container, style]}
            {...rest}
        >
            {children}
        </TouchableOpacity>
    );
}