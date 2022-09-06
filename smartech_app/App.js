
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, PermissionsAndroid, Alert } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DeepLinkReducer from './src/component/DeeplinkReducer';
const store = createStore(DeepLinkReducer);
import SmartechStackNavigator from './src/navigation/SmartechStackNavigator';

export default function App() {

  function setupSmartech () {
    console.log("Hello Smartech");
  }

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  requestLocationPermission()
  setupSmartech();
  
  return (
    <Provider store={store}>
      <SmartechStackNavigator />
    </Provider>
  );
}