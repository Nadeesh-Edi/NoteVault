import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

interface InputFieldProps {
    label: string,
    value: string,
    change: Dispatch<SetStateAction<string>>,
    isMultiLine?: boolean,
    isPwrd?: boolean
}

const MainInputField: FC<InputFieldProps> = (props) : JSX.Element => {
    const theme = useTheme()
    const [isSecured, setIsSecured] = useState(props.isPwrd ? props.isPwrd : false)

    return (
        <>
            <TextInput
                style={styles.singleField}
                mode="outlined"
                activeOutlineColor={theme.colors.primary}
                multiline={props.isMultiLine}
                label={props.label}
                value={props.value}
                onChangeText={props.change}
                secureTextEntry={isSecured}
                right={props.isPwrd && <TextInput.Icon icon="eye" onPress={e => setIsSecured(!isSecured)} />}/>
        </>
    )
}

const styles = StyleSheet.create({
    singleField: {
        margin: 10
    }
})

export default MainInputField;