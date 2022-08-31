const GOOGLE_API_KEY = 'ENTER_YOUR_API_KEY_FOR_TEST';

export function getMapPreview(lat, lng) {
    // creo en una constante la url de mi ubicacion en el mapa como imagen.
    // Genero una url dinamica con los datos de lat y lng obtenidos por el objeto de la funcion getLocationHandler() en LocationPicker.js
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
    &markers=color:red%7Clabel:S%7C${lat},${lng}
    &key=${GOOGLE_API_KEY}`;

    return imagePreviewUrl;
};

// Utilizando fetch() para hacer un pedido http consultando al endpoint de reverse geocoding Google API para enviar una lat y lng y obtener una direccion legible para el usuario. (Ver documentacion geocoding)
export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error('Failed to fetch address!');
    }

    const data = await response.json();
    const address = data.results[0].formatted_address;

    return address;
};
