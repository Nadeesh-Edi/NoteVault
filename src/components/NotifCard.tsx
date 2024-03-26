import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

interface NotifCardProps {
    message: String
}

const NotifCard: FC<NotifCardProps> = (props) : JSX.Element => {
    const theme = useTheme()

    return (
        <View style={styles.notifBackGround}>
            <View style={{ flexDirection: 'row', borderColor: theme.colors.primary, borderRadius: 10, borderStyle: 'solid' }}>
                <View style={{ flex: 1 }}>
                    <Icon source="alert-circle" size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 7 }}>
                    <Text variant="labelMedium">{ props.message }</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    notifBackGround: {
        padding: 10,
    }
})

export default NotifCard;