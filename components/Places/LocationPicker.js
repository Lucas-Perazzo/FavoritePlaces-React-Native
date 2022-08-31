import { Alert, StyleSheet, View, Image, Text } from 'react-native'
import OutlinedButton from '../ui/OutlinedButton';
import { Colors } from '../../constants/colors';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import { useEffect, useState } from 'react';
import { getMapPreview, getAddress } from '../../util/location';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

function LocationPicker({ onPickLocation }) {
    const [pickedLocation, setPickedLocation] = useState();
    // useIsFocused Hook devuelve un boolean si el valor elegido esta enfocado
    const isFocused = useIsFocused();

    const navigation = useNavigation();
    const route = useRoute();

    // * funcion basica para verificar permisos ambos So 
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

    // Utilizo useEffect para renderizar en el caso de que se haya elegido una posicion manualmente la preview del mapa con las coordenadas guardadas.
    useEffect(() => {
        // Guardo la informacion del objeto que viene en params cuando guardo una ubicacion en el mapa manualmente, en el primer momento que se renderiza el componente los params no existen por lo tanto condiciono la creacion de esta constante cuando haya datos en params.
        if (isFocused && route.params) {
            const mapPickedLocation = {
                lat: route.params.pickedLat,
                lng: route.params.pickedLng
            };
            setPickedLocation(mapPickedLocation);
        }
    }, [route, isFocused]);

    // Este useEffect se ejecutara cuando haya una locacion seleccionada para enviar los datos al componente PlaceForm
    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation) {
                const address = await getAddress(
                    pickedLocation.lat, 
                    pickedLocation.lng
                );
                // Seteo el objeto que tiene lat y lng con el atributo adress que tendra como valor la direccion traducida por la funcion getAddress()
                onPickLocation({ ...pickedLocation, address: address });
            }
        };

        handleLocation();

    }, [pickedLocation, onPickLocation]);

    async function verifyPermissions() {
        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Insuficient Permissions!', 'Grant location permissions!');
            return false;
        }

        return true;
    };


    // Handler para obtener la ubicacion del dispositivo
    async function getLocationHandler() {
        const hasPermission = await verifyPermissions()
        if (!hasPermission) {
            return;
        }
        const location = await getCurrentPositionAsync();
        // Seteo el objeto con los valores para enviar a la url de location.
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        });
    };

    // Handler para elegir una ubicacion en el mapa.
    function pickOnMapHandler() {
        navigation.navigate('Map');
    };

    let locationPreview = <Text>No location picked yet.</Text>

    if (pickedLocation) {
        locationPreview = (
            <Image
                style={styles.mapPreviewImage}
                source={{
                    uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)
                }}
            />
        );
    };

    return (
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton
                    icon='location'
                    onPress={getLocationHandler}
                >Locate User</OutlinedButton>
                <OutlinedButton
                    icon='map'
                    onPress={pickOnMapHandler}
                >Pick on Map</OutlinedButton>
            </View>
        </View>
    );
};

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    mapPreviewImage: {
        width: '100%',
        height: '100%',
    }
});