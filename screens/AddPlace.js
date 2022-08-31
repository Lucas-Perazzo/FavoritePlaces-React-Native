import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function AddPlace({ navigation }) {
    async function createPlaceHandler(place) {
        // ejecuto la funcion que llevara los datos a la query para crear las tablas con los valores ingresados
        await insertPlace(place);
        // navigation.navigate('AllPlaces', {
        //     place: place
        // });
        navigation.navigate('AllPlaces');
    };

    return (
        <PlaceForm onCreatePlace={createPlaceHandler} />
    );
};

export default AddPlace;