import React, { FC } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";
import Note from "../schemas/NoteSchema";

interface NoteCardProps {
    title: String,
    subtitle: String,
    id: String,
    onPress: () => void
}

const NoteCard: FC<NoteCardProps> = (props) : JSX.Element => {
    return (
        <View style={styles.cardBackground}>
            <Card elevation={2} onPress={e => {
                e.preventDefault()
                props.onPress()
            }}>
                <Card.Title 
                    title={props.title}
                    subtitle={props.subtitle} />
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    cardBackground: {
        padding: 10
    }
})

export default NoteCard;