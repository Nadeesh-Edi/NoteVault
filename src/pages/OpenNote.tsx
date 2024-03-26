import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Appbar, Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { useObject, useRealm } from "@realm/react";
import Note from "../schemas/NoteSchema";
import ConfirmDialog from "../components/ConfirmDialog";
import EnterKeyModal from "../modals/EnterKeyModal";
import { decryptCypher } from "../hooks/encryption";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../store/dispatchSelectors";
import { setIsEdit } from "../store/isEditSlice";
import { setSelectedContent, setSelectedId, setSelectedTitle } from "../store/selectedIdSlicer";

interface OpenNoteProps {
    route: RouteProp<{ Details: { id: string } }>;
    navigation: NavigationProp<any>;
}

const OpenNote = ({ route, navigation } : { route: any, navigation: any },) => {
    const [noteContent, setNoteContent] = useState("")
    const noteId = route.params.id;
    const theme = useTheme()
    const realm = useRealm()
    const selectedNote = useObject(Note, noteId)
    const dispatch = useAppDispatch();

    const [cancelConfirm, setCancelConfirm] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [enterKey, setEnterKey] = useState(false)
    const [isDecrypted, setIsDecrypted] = useState(false)
    const cancelNotice = "Are you sure you want to cancel? This action is irreversible."

    useEffect(() => {
        selectedNote ? setNoteContent(selectedNote.content) : ''
    }, [selectedNote])

    const goBack = () => {
        navigation.goBack()
    }

    const confirmCancel = () => {
        setCancelLoading(true)
        try {
            realm.write(() => {
                realm.delete(selectedNote)
            })
            ToastAndroid.show("Note deleted successfully", ToastAndroid.SHORT)
            rejectCancel()
            goBack()
        } catch(e) {
            console.log("error", e);
            
            ToastAndroid.show("Error deleting the Note", ToastAndroid.SHORT)
        } finally {
            setCancelLoading(false)
        }
    }

    const rejectCancel = () => {
        setCancelConfirm(false)
    }

    const decryptContent = async (key: string) => {
        const decryptedContent = selectedNote ? decryptCypher(selectedNote.content, key) : ''
        console.log(decryptedContent);
        setEnterKey(false)
        setNoteContent(decryptedContent)

        try {
            const storedKey = await AsyncStorage.getItem('encryptKey')
            setIsDecrypted(storedKey == key)
            console.log(isDecrypted);
            
        } catch (e) {
            console.log(e); 
        }
    }

    const editNote = (selected: any) => {
        dispatch(setIsEdit(true))
        console.log("selected open", selected._id.toString());
        
        dispatch(setSelectedId(selected._id))
        dispatch(setSelectedTitle(selected.title))
        dispatch(setSelectedContent(noteContent))
        navigation.navigate("AddNote")
    }
    
    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={goBack} color={theme.colors.secondary} />
                <Appbar.Content title={selectedNote?.title} color={theme.colors.secondary} />
                { isDecrypted && <Appbar.Action icon="file-document-edit" color={theme.colors.secondary} rippleColor={theme.colors.onPrimary} onPress={() => {editNote(selectedNote)}} /> }
                <Appbar.Action icon="delete" color="#CC2929" rippleColor="#663D3D" onPress={() => {setCancelConfirm(true)}} />
            </Appbar.Header>

            <View style={styles.cardBackground}>
                <Card mode="contained" onLongPress={() => setEnterKey(true)} >
                    <Card.Content>
                        <Text variant="bodyMedium">{ noteContent }</Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Delete confirmation */}
            <ConfirmDialog visible={cancelConfirm} content={cancelNotice} confirmed={() => confirmCancel()} cancelled={() => rejectCancel()} loading={cancelLoading} />

            {/* Enter key to decypher */}
            <EnterKeyModal visible={enterKey} hidden={() => {setEnterKey(false)}} keyEntered={decryptContent} />
        </View>
    )
}

const styles = StyleSheet.create({
    cardBackground: {
        padding: 10
    }
})

export default OpenNote;