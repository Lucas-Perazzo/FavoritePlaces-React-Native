import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

function ImagePicker({onTakeImage}) {
    // * Guardo en este state la uri de la imagen que retorna el imagePicker para generar una previsualizacion. 
    const [pickedImage, setPickedImage] = useState();
    // ! Configurando los permisos para utilizar el imagePicker en IOS, utilizando el hook useCameraPermissions.
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    // Funcion que compara el status de los permisos y si no los tiene ejecuta la funcion que dispara el prompt de permisos.
    async function verifyPermissions() {
        if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if(cameraPermissionInformation.status === PermissionStatus.DENIED) {
           const permissionResponse = await requestPermission();
           
           return permissionResponse.granted; 
        }

        return true;
    }

    // * La funcion launchCameraAsync retornara una promesa durante el proceso que se abra la camara, se tome la foto y se guarde el archivo, por ello la funcion que hace trigger de esta funcionalidad debe ser async.
    async function takeImageHandler() {
        const hasPermission = await verifyPermissions();

        if(!hasPermission) {
            return;
        }
        // Configuro objeto de launchCameraAsync
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });
        setPickedImage(image.uri);
        // Enviamos al place form componente la propiedad uri de la imagen capturada para poder utilizarla en el objeto que vamos a enviar con los datos de la imagen y la ubicacion en PlaceForm.
        onTakeImage(image.uri);
    };

    let imagePreview = <Text>No image taken yet.</Text>;

    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />
    };

    return (
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <OutlinedButton
                icon='camera' 
                onPress={takeImageHandler}
            >Take Image</OutlinedButton>
        </View>
    );
};

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});