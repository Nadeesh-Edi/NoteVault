import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Appbar, Icon, Text, useTheme } from "react-native-paper";
import NotifCard from "../components/NotifCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from 'react-native-paper';
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { useAppDispatch } from "../store/dispatchSelectors";
import { setIsAuthenticating } from "../store/isAuthSlice";

function HowToUse({ navigation }: { navigation: any }): JSX.Element {
    const theme = useTheme()
    const [isSwitchOn, setIsSwitchOn] = useState(false)
    const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false)
    const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
    const dispatch = useAppDispatch();

    const title1 = "Encryption key"
    const encryptionKey = "This is a unique key which will be used to encrypt all your notes. The notes can only be decrypted using this key so make sure not to forget. Once set, it cannot be changed."
    const encryptNotice = "Note! Once this key is set it cannot be changed. All your notes will be lost if the key is lost."
    const title2 = "How to add a note"
    const howtoAdd = "Adding a note is easy. After setting a key, just press on the (+) icon in the Notes (home) screen. this will direct you to the page to add a note. All the notes you add will be encrypted by the key you entered previously."
    const title3 = "How to decrypt"
    const hotoDecrypt = "Click on the relevant note from the Notes (home) screen. It will show you the encrypted text. Press and hold on this text until a popup appears to enter the key. After entering the correct key only you will be able to view the proper note content."
    const fingerPrintMsg = "Use fingerprint to decrypt the notes"

    const goBack = () => {
        navigation.goBack()
    }

    const onToggleSwitch = (value : boolean) => {
        dispatch(setIsAuthenticating(true))
        rnBiometrics.simplePrompt({
            promptMessage: "Place fingerprint to confirm"
        }).then((result) => {
            if (result.success) {
                saveConfig(value ? "1" : "0");
            } else {
                ToastAndroid.show("Authentication failed", ToastAndroid.SHORT);
            }
        }).finally(() => {
            dispatch(setIsAuthenticating(false))
        })
    }

    const saveConfig = (value: string) => {
        AsyncStorage.setItem("isFingerprint", value).then(res => {
            ToastAndroid.show("Successfully saved", ToastAndroid.SHORT)
            setIsSwitchOn(value === "1")
        }).catch(err => {
            ToastAndroid.show("Save failed", ToastAndroid.SHORT)
        })
    }

    const checkBiometricAuth = async () => {
        rnBiometrics.isSensorAvailable().then((res) => {
            const { available, biometryType } = res;
            if (available && biometryType === BiometryTypes.Biometrics) {
                setIsFingerprintAvailable(true);
                getFingerprintConfig()
            } else {
                setIsFingerprintAvailable(false);
            }
        }).catch((err) => {
            setIsFingerprintAvailable(false);
        })
    }

    const getFingerprintConfig = async () => {
        const storedConfig = await AsyncStorage.getItem('isFingerprint')
        if (storedConfig === '1') {
            setIsSwitchOn(true)
        }
    }

    useEffect(() => {
        checkBiometricAuth();
    })

    const noteCard = (title: string, content: string, notice?: string): JSX.Element => {
        return (
            <View>
                <View style={styles.noticeCard}>
                    <Text variant="titleLarge">{title}</Text>
                    <Text variant="bodyMedium">{content}</Text>
                </View>

                {
                    notice && <View style={styles.notifBackGround}>
                    <View style={styles.notice}>
                        <View style={{ flex: 1 }}>
                            <Icon source="alert-circle" size={25} color="#FF0000" />
                        </View>
                        <View style={{ flex: 7 }}>
                            <Text variant="labelLarge">{ notice }</Text>
                        </View>
                    </View>
                </View>
                }
            </View>
        )
    }

    const configSwitch = () => {
        return (
            <View style={styles.notifBackGround}>
                <View style={styles.configRow}>
                    <View style={{ flex: 4 }}>
                        <Text variant="labelLarge">{fingerPrintMsg}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={theme.colors.primary} style={{ flex: 1 }} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={goBack} color={theme.colors.secondary} />
                <Appbar.Content title="How to use" color={theme.colors.secondary} />
            </Appbar.Header>

            {noteCard(title1, encryptionKey, encryptNotice)}
            {noteCard(title2, howtoAdd)}
            {noteCard(title3, hotoDecrypt)}
            {isFingerprintAvailable && configSwitch()}
        </View>
    )
}

const styles = StyleSheet.create({
    noticeCard: {
        padding: 10
    },
    notifBackGround: {
        padding: 10,
    },
    notice: { 
        flexDirection: 'row', 
        borderColor: '#ff0000', 
        borderRadius: 10, 
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFB2B6',
        padding: 10
    },
    configRow: {
        flexDirection: 'row', 
        borderRadius: 10, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#59a5eb',
        padding: 10
    }
})

export default HowToUse;