import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Modal, Portal, Text, useTheme } from "react-native-paper";
import MainInputField from "../components/MainInputField";
import MainButton from "../components/MainButton";
import NotifCard from "../components/NotifCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from 'react-native-paper';
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { useAppDispatch } from "../store/dispatchSelectors";
import { setIsAuthenticating } from "../store/isAuthSlice";
interface AddKeyModalProps {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

const  AddKeyModal: FC<AddKeyModalProps> = (props) : JSX.Element => {
    const [key, setKey] = useState("")
    const [isBtnDisabled, setIsBtnDisabled] = useState(true)
    const [isSwitchOn, setIsSwitchOn] = useState(false)
    const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false)
    const showModal = () => props.setVisible(true);
    const hideModal = () => props.setVisible(false);
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })

    const alertMsg = "This key will be used to encrypt all your notes. Once set, it cannot be changed."
    const fingerPrintTitle = "Use Fingerprint for decryption";
    const fingerPrintMsg = "(This feature can be later switched on and off in the settings section)"

    const saveKey = () => {
        AsyncStorage.setItem("encryptKey", key).then(res => {
            ToastAndroid.show("Successfully saved", ToastAndroid.SHORT)
            hideModal()
        }).catch(err => {
            ToastAndroid.show("Save failed", ToastAndroid.SHORT)
        })
    }

    const saveConfig = (value: string) => {
        AsyncStorage.setItem("isFingerprint", value).then(res => {
            saveKey()
        }).catch(err => {
            ToastAndroid.show("Save failed", ToastAndroid.SHORT)
        })
    }

    const submitForm = () => {
        if (isFingerprintAvailable) {
            authenticateSave();
        } else {
            saveConfig("0")
        }
    }

    const authenticateSave = () => {
        dispatch(setIsAuthenticating(true))
        rnBiometrics.simplePrompt({
            promptMessage: "Place fingerprint"
        }).then((result) => {
            if (result.success) {
                saveConfig(isSwitchOn ? "1" : "0")
            } else {
                ToastAndroid.show("Authentication failed", ToastAndroid.SHORT);
            }
        }).finally(() => {
            dispatch(setIsAuthenticating(false))
        })
    }

    const onToggleSwitch = (value : boolean) => {
        setIsSwitchOn(value);
    }

    const checkBiometricAuth = async () => {
        rnBiometrics.isSensorAvailable().then((res) => {
            const { available, biometryType } = res;
            
            if (available && biometryType === BiometryTypes.Biometrics) {
                setIsFingerprintAvailable(true);
            } else {
                setIsFingerprintAvailable(false);
            }
        }).catch((err) => {
            setIsFingerprintAvailable(false);
        })
    }

    useEffect(() => {
        if (key === '') {
            setIsBtnDisabled(true)
        } else {
            setIsBtnDisabled(false)
        }
    }, [key])

    useEffect(() => {
        checkBiometricAuth();
    })

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={hideModal} contentContainerStyle={styles.modalStyle} >
                <Text variant="titleMedium">ADD ENCRYPTION KEY</Text>

                <MainInputField value={key} label="Encryption key" change={setKey} isPwrd />

                <NotifCard message={alertMsg} />

                {isFingerprintAvailable && 
                    <View style={styles.row}>
                        <View style={{ flex: 3 }}>
                            <Text variant="labelMedium">{fingerPrintTitle}</Text>
                            <Text variant="labelMedium">{fingerPrintMsg}</Text>
                        </View>
                        
                        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={theme.colors.primary} style={{ flex: 1 }} />
                    </View>
                }

                <MainButton text="SAVE" onPress={submitForm} isUnFixed={true} isDisabled={isBtnDisabled} />
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
    },
    row: {
        flexDirection: "row",
    }
})

export default AddKeyModal;