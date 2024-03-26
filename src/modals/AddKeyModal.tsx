import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import MainInputField from "../components/MainInputField";
import MainButton from "../components/MainButton";
import NotifCard from "../components/NotifCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AddKeyModalProps {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

const  AddKeyModal: FC<AddKeyModalProps> = (props) : JSX.Element => {
    const [key, setKey] = useState("")
    const [isBtnDisabled, setIsBtnDisabled] = useState(true)
    const showModal = () => props.setVisible(true);
    const hideModal = () => props.setVisible(false);

    const alertMsg = "This key will be used to encrypt all your notes. The notes can only be decrypted using this key so make sure not to forget. Once set, it cannot be changed."

    const saveKey = () => {
        AsyncStorage.setItem("encryptKey", key).then(res => {
            ToastAndroid.show("Successfully saved", ToastAndroid.SHORT)
            hideModal()
        }).catch(err => {
            ToastAndroid.show("Save failed", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        if (key === '') {
            setIsBtnDisabled(true)
        } else {
            setIsBtnDisabled(false)
        }
    }, [key])

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={hideModal} contentContainerStyle={styles.modalStyle} >
                <Text variant="titleMedium">ADD ENCRYPTION KEY</Text>

                <MainInputField value={key} label="Encryption key" change={setKey} isPwrd />

                <NotifCard message={alertMsg} />

                <MainButton text="SAVE" onPress={saveKey} isUnFixed={true} isDisabled={isBtnDisabled} />
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

export default AddKeyModal;