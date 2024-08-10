import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FAB, Icon, Snackbar, useTheme, Text } from "react-native-paper";
import { Appbar } from "react-native-paper";
import NoteCard from "../components/NoteCard";
import AddKeyModal from "../modals/AddKeyModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@realm/react";
import Note from "../schemas/NoteSchema";
import { LogBox } from 'react-native';
import ConfirmDialog from "../components/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../store/dispatchSelectors";
import { setIsEdit } from "../store/isEditSlice";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

function NotesList({ navigation }: { navigation: any }): JSX.Element {
    const [showKeySnack, setShowKeySnack] = useState(false)
    const [showKeyModal, setShowKeyModal] = useState(false)
    const [isKeyAvailable, setIsKeyAvailable] = useState(false)
    const theme = useTheme()
    const dispatch = useAppDispatch();
    
    const notes = useQuery(Note)

    const onToggleSnackBar = () => setShowKeySnack(!showKeySnack);
    const onDismissSnackBar = () => setShowKeySnack(false);


    const checkForKey = async () => {
        try {
            const key = await AsyncStorage.getItem('encryptKey')
            
            if (!key) {
                setIsKeyAvailable(false)
                return false;
            } else {
                setIsKeyAvailable(true)
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const addNewNote = async () => {
        const keyAvailable = await checkForKey()
        if (keyAvailable) {
            dispatch(setIsEdit(false));
            navigation.navigate("AddNote")
        } else {
            setShowKeySnack(true)
        }
        // navigation.navigate("AddNote")
    }

    function openNote(note: Note): any {
        navigation.navigate("OpenNote", { id: note._id })
    }

    const openHowToUse = () => {
        navigation.navigate("HowtoUse")
    }

    useEffect(() => {
        checkForKey()
    }, [])

    return (
        <View style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            <Appbar.Header>
                <Appbar.Content title="Notes" color={theme.colors.secondary} />
                <Appbar.Action icon="progress-question" color="#fff" onPress={openHowToUse} rippleColor="#005b96" size={32} />
            </Appbar.Header>

            {notes.length > 0 ?
                <View>
                    <ScrollView>
                        {notes.map((item, index) => {
                            return (
                                <NoteCard id={item._id.toString()} title={item.title} subtitle={item.content} key={index} onPress={() => openNote(item)} />
                            )
                        })}
                    </ScrollView>
                </View> :
                <View style={styles.emptyIcon}>
                    <Icon source="heart-broken" color={theme.colors.primary} size={60} />
                    <Text variant="titleMedium">Oops! You don't have any notes in your Vault.</Text>
                    <Text variant="titleMedium">Click on the + icon to add some!</Text>
                </View>
            }

            <FAB 
                icon="plus" 
                style={styles.plusBtn} 
                theme={{ colors: { primaryContainer: theme.colors.primary, onPrimaryContainer: theme.colors.secondary } }}
                rippleColor={theme.colors.onPrimary}
                onPress={() => addNewNote()}
                size="medium" />

            {/* Confirm dialog to notify to add key */}
            <ConfirmDialog visible={showKeySnack} content="Please add a encryption key to proceed" confirmed={() => {
                setShowKeySnack(false)
                setShowKeyModal(true)
            }} cancelled={() => setShowKeySnack(false)} />

            <AddKeyModal visible={showKeyModal} setVisible={setShowKeyModal} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainScreen: {
        backgroundColor: '#294666',
        flex: 1
    },
    emptyIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusBtn: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export default NotesList;