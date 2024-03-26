import React, { Dispatch, FC, SetStateAction } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface MainButtonProps {
    text: String,
    onPress: Dispatch<GestureResponderEvent>,
    isUnFixed?: boolean,
    isDisabled?: boolean
}

const MainButton: FC<MainButtonProps> = (props): JSX.Element => {
    const theme = useTheme()

    return (
        <View style={props.isUnFixed ? styles.mainButtonUnFixed : styles.mainButtonFixed}>
            <Button 
                style={styles.singleField} 
                mode="elevated" 
                buttonColor={theme.colors.primary} 
                textColor="#fff" 
                onPress={props.onPress} 
                rippleColor="#005b96"
                disabled={props.isDisabled}>
                    {props.text}
                </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    singleField: {
        margin: 10
    },
    mainButtonFixed: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    mainButtonUnFixed: {
        bottom: 0,
        width: '100%'
    }
})

export default MainButton;