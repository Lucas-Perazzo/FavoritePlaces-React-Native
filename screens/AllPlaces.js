import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";

function AllPlaces({ route }) {
    const [loadedPlaces, setLoadedPlaces] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        async function loadPlaces() {
            const places = await fetchPlaces();
            console.log('All Places: ', places);
            setLoadedPlaces(places);
        }

        if (isFocused) { //&& route.params) {
            // Seteo mi estado de lugares con los lugares ya agregados + el nuevo lugar agregado que proviende de params.
            // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place]);
            loadPlaces();
        }

    }, [isFocused]); //route]);

    return (
        <PlacesList places={loadedPlaces} />
    );
}

export default AllPlaces;