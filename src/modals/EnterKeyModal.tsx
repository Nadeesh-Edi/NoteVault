import React, { FC, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import MainInputField from "../components/MainInputField";
import NotifCard from "../components/NotifCard";
import MainButton from "../components/MainButton";

interface EnterKeyModalProps {
    visible: boolean,
    hidden: () => void,
    keyEntered: (key: string) => void
}

const EnterKeyModal : FC<EnterKeyModalProps> = (props) : JSX.Element => {
    const [key, setKey] = useState("")
    const [isBtnDisabled, setBtnDisabled] = useState(true)

    useEffect(() => {
        if (key === '') {
            setBtnDisabled(true)
        } else {
            if (isBtnDisabled) {
                setBtnDisabled(false)
            }
        }
    }, [key])
    
    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hidden} contentContainerStyle={styles.modalStyle} >
                <Text variant="titleMedium">ENTER ENCRYPTION KEY</Text>

                <MainInputField value={key} label="Encryption key" change={setKey} isPwrd />

                <MainButton text="DECRYPT" onPress={() => props.keyEntered(key)} isUnFixed={true} isDisabled={isBtnDisabled} />
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        margin: 20
    }
})

export default EnterKeyModal;