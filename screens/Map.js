import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from '../components/ui/IconButton';


// Utilizacion basica de MapView
function Map({ navigation, route }) {
    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng
    };

    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    
    const region = {
        //Definen el centro del mapa
        latitude: initialLocation ? initialLocation.lat : 37.78,
        longitude: initialLocation ? initialLocation.lng : -122.43,
        // Cuanto contenido ademas del centro sera visible
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };

    // Al estar como disparador del onPress en el MapView obtenemos el objeto del event con las coordenadas y otros valores donde presiono el usuario.
    function selectLocationHandler(event) {
        if(initialLocation) {
            return;
        }
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;

        // Guardo en el state el objeto con las coordenadas seleccionadas
        setSelectedLocation({
            lat: lat,
            lng: lng
        });
    };

    // Funcion que guarda las coordenadas seleccionadas por el usuario para mostrarlas como vista previa en la pantalla de agregar un lugar.
    // ! React useCallBack(); para evitar bucles y re renderizados.
    // ? garantiza que una funcion definida dentro de un componente no se vuelva a crear innecesariamente.

    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert('No location picked!', 'Pick a location');
            return;
        }
        // Envio como params a la screen AddPlace los datos de la ubicacion seleccionada por el usuario
        navigation.navigate('AddPlace', {
            pickedLat: selectedLocation.lat,
            pickedLng: selectedLocation.lng
        });
    }, [navigation, selectedLocation]);

    // Nos permite ejecutar codigo cuando este componente se renderiza por primera vez
    useLayoutEffect(() => {
        // Si no hay una locacion inicial no aparecera el icono para guardar locacion en el header ya que accedemos desde la pantalla de detalles, que provee esta info por params.
        if (initialLocation) {
            return;
        }
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <IconButton
                    icon='save'
                    size={24}
                    color={tintColor}
                    onPress={savePickedLocationHandler}
                />
            )
        });
    }, [navigation, savePickedLocationHandler, initialLocation]);


    return (
        <MapView
            initialRegion={region}
            style={styles.map}
            // Prop que genera un objeto con las coordenadas del lugar que se pickeo
            onPress={selectLocationHandler}
        >
            {selectedLocation && (
                <Marker
                    title="Picked Location"
                    coordinate={{
                        latitude: selectedLocation.lat,
                        longitude: selectedLocation.lng
                    }}
                />
            )}
        </MapView>
    );
};

export default Map;

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
});