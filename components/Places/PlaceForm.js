import { useCallback, useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { Colors } from '../../constants/colors';
import { Place } from "../../models/place";
import Button from "../ui/Button";
import OutlinedButton from "../ui/OutlinedButton";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

function PlaceForm({ onCreatePlace }) {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState();
    const [pickedLocation, setPickedLocation] = useState();

    // Seteo el state enteredTitle con el value ingresado en el textInput
    function changeTitleHandler(enteredText) {
        setEnteredTitle(enteredText);
    };

    // Handler para recolectar la imagen tomada en la pantalla addPlace
    function takeImageHandler(imageUri) {
        setSelectedImage(imageUri);
    };

    // Handler para recolectar la locacion guardada en la pantalla addPlace
    // Usamos la funcion como callback para evitar que la funcion se ejecute incorrectamente.
    const pickLocationHandler = useCallback((location) => {
        setPickedLocation(location);
    }, []);

    // Handler para guardar los datos de addPlace
    function savePlaceHandler() {
        const placeData = new Place(
            enteredTitle,
            selectedImage,
            pickedLocation
        );
        onCreatePlace(placeData);
    };

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeTitleHandler}
                    value={enteredTitle}
                />
            </View>
            <ImagePicker onTakeImage={takeImageHandler} />
            <LocationPicker onPickLocation={pickLocationHandler} />
            <View style={styles.outButton}>
                <OutlinedButton
                    onPress={savePlaceHandler}
                >
                    Add Place</OutlinedButton>
            </View>
        </ScrollView>
    );
};

export default PlaceForm;

const styles = StyleSheet.create({
    outButton: {
        padding: 25,
        margin: 13
    },
    form: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primary500
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary100
    }
});