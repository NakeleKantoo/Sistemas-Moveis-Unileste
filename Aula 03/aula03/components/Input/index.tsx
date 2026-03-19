import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { ReactNode } from "react";

type Props = TextInputProps & {
    children?: ReactNode;
}


export function Input({children, ...rest }: TextInputProps) {
    return (
        <View style={styles.container}>
            {children}
            <TextInput style={styles.textarea} {...rest} />
        </View>
    );
}   