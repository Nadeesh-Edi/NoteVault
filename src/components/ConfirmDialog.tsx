import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

interface ConfrimDialogProps {
    content: string,
    visible: boolean,
    confirmed: () => void,
    cancelled: () => void,
    loading?: boolean
}

const ConfirmDialog : FC<ConfrimDialogProps> = (props) : JSX.Element => {
    const theme = useTheme()

    return (
        <Portal>
            <Dialog visible={props.visible} onDismiss={props.cancelled}>
                <Dialog.Content>
                    <Text variant="bodyMedium">{ props.content }</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor={theme.colors.primary} rippleColor={theme.colors.onPrimary} onPress={e => {
                        e.preventDefault()
                        props.confirmed()
                    }} loading={props.loading}>Confirm</Button>
                    <Button textColor={theme.colors.primary} rippleColor={theme.colors.onPrimary} onPress={e => {
                        e.preventDefault()
                        props.cancelled()
                    }}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
} 

export default ConfirmDialog;