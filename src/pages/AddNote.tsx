import React, { useEffect, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { Appbar, Button, TextInput, useTheme } from "react-native-paper";
import MainInputField from "../components/MainInputField";
import MainButton from "../components/MainButton";
import { useObject, useQuery, useRealm } from "@realm/react";
import Note from "../schemas/NoteSchema";
import { createCypher } from '../hooks/encryption'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../store/dispatchSelectors";

function AddNote({ navigation }: { navigation: any }): JSX.Element {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const theme = useTheme()
    const realm = useRealm()
    const notes = useQuery(Note)
    const dispatch = useAppDispatch();
    const { isEdit } = useAppSelector(state => state.isEdit)
    const { selectedId } = useAppSelector(state => state.selectedId)
    const selectedNote = useAppSelector(state => state.selectedId)
    const editedNote = isEdit && selectedId ? useObject(Note, selectedId) : null

    useEffect(() => {
        if (isEdit) {
            setTitle(selectedNote.selectedTitle)
            setContent(selectedNote.selectedContent)
        }
    }, [isEdit])

    const encryptContent = async () => {
        const storedKey = await AsyncStorage.getItem('encryptKey')
        return storedKey ? createCypher(content, storedKey) : ''
    }

    const onPressSave = () => {
        if (isEdit) {
            saveEdit()
        } else {
            saveNote()
        }
    }

    const saveNote = async () => {
        let encryptedContent = ""
        try {
            encryptedContent = await encryptContent()
        } catch (e) {
            console.log(e);
        }
        
        realm.write(() => {
            realm.create("Note", Note.generate(title, encryptedContent))
        })
        ToastAndroid.show("Successfully saved", ToastAndroid.SHORT)
        goBack()
    }

    const saveEdit = async () => {
        let encryptedContent = ""
        try {
            encryptedContent = await encryptContent()
        } catch (e) {
            console.log(e);
        }
        
        if (editedNote) {
            realm.write(() => {
                editedNote.title = title;
                editedNote.content = encryptedContent;
            })
            ToastAndroid.show("Successfully saved", ToastAndroid.SHORT)
            goBack()
        }
    }

    const goBack = () => {
        navigation.navigate('NotesList')
    }

    useEffect(() => {
        if (title.trim() == '' || content.trim() === '') {
            setIsSaveDisabled(true)
        } else {
            setIsSaveDisabled(false)
        }
    }, [title, content])

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={goBack} color={theme.colors.secondary} />
                <Appbar.Content title={isEdit ? "Edit Note" : "Add Note"} color={theme.colors.secondary} />
            </Appbar.Header>

            <MainInputField label="Note title" value={title} change={setTitle}/>

            <MainInputField label="Note Content" value={content} change={setContent} isMultiLine={true} />

            <MainButton text="SAVE NOTE" onPress={onPressSave} isDisabled={isSaveDisabled} />
        </View>
    )
}

export default AddNote;