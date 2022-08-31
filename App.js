import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import IconButton from './components/ui/IconButton';
import { Colors } from './constants/colors';
import Map from './screens/Map';
import { useEffect, useState } from 'react';
import { init } from './util/database';
import AppLoading from 'expo-app-loading';
import PlaceDetails from './screens/PlaceDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInit, setDbInit] = useState(false);

  // Inicializo la db
  useEffect(() => {
    init()
      .then(() => {
        setDbInit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!dbInit) {
    return <AppLoading />
  };

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: Colors.gray700,
          contentStyle: { backgroundColor: Colors.gray700 }
        }}>
          <Stack.Screen
            name='AllPlaces'
            component={AllPlaces}
            // Uso de opciones como funcion, utilizando props
            options={({ navigation }) => ({
              title: 'Your Favorite Places',
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon='add'
                  size={24}
                  color={tintColor}
                  onPress={() => {
                    navigation.navigate('AddPlace');
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            name='AddPlace'
            component={AddPlace}
            options={{
              title: 'Add a new Place'
            }}
          />
          <Stack.Screen
            name='Map'
            component={Map}
          />
          <Stack.Screen
            name='PlaceDetails'
            component={PlaceDetails} 
            options={{
              title: 'Loading Place...'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

