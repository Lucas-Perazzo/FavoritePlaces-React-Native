import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

// creo la bd
// Como primer argumento recibe un string con el nombre de la base de datos

const database = SQLite.openDatabase('places.db');

// Funciones para interactuar con la bd

// Estructura inicial 
export function init() {
    // Ejemplo de promesa manual
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            // el objeto viene por defecto en la funcion y sera el objeto de la transaccion en si
            // Metodo para realizar querys
            // Recibe una funcion como argumento que sera el objeto de transaccion para crear y enviar la consulta
            // !Comando para crear tabla con los datos necesarios
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS places (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    imageUri TEXT NOT NULL,
                    address TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL
                )`,
                // TODO
                [],
                // ! Funcion de callBack si todo sale bien
                () => {
                    resolve();
                },
                // ! Funcion de callBack error 
                // ? _ como argumento aclara que pasamos el arg por necesidad tecnica pero no lo utilizamos.
                // * el primer argumento seria la transaccion
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
};

export function insertPlace(place) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`
                INSERT INTO places (title, imageUri, address, lat, lng) 
                VALUES (?, ?, ?, ?, ?)`,
                // Buena practica para agregar datos dinamicamente a las querys
                [
                    place.title, 
                    place.imageUri, 
                    place.address, 
                    place.location.lat, 
                    place.location.lng
                ],
                // Success & Error Cases
                (_, result) => {
                    console.log('RESULT INSERT: ', result);
                    resolve(result);
                },
                (_, error) => {
                    reject(error );
                }
            );
        });
    });
    return promise;
};

// Extraer data de la db
export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places',
                [],
                (_, result) => {
                    const places = [];

                    for (const dp of result.rows._array) {
                        places.push(new Place(
                            dp.title,
                            dp.imageUri,
                            {
                                address: dp.address,
                                lat: dp.lat,
                                lng: dp.lng
                            },
                            dp.id
                            )
                        );
                    }
                    resolve(places);
                },
                (_, reject) => {
                    reject(error);
                }
            );  
        });
    });

    return promise;
};

// Fetcheo de la base de datos el lugar con el id que envio para traer sus datos
export function fetchPlaceDetails(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    const dbPlace = result.rows._array[0]
                    const place = new Place(
                        dbPlace.title, 
                        dbPlace.imageUri, 
                        {lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address}, 
                        dbPlace.id
                    );
                    resolve(place);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
};