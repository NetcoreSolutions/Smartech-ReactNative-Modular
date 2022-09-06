//import * as React from 'react';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, Linking } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Login from '../screen/login';
import Profile from '../screen/profile';
import CustomEvents from '../screen/customevents';
import HomeTabNavigator from './HomeTabNavigator';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//Smartech SDK Refernce
import Smartech from 'smartech-base-react-native';
import SmartechPushReact from 'smartech-push-react-native';
import SmartechAppInboxReact from 'smartech-appinbox-react-native';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateDeeplink } from '../component/DeeplinkAction';
import AppInbox from '../screen/appinbox/appinbox';

import { AuthContext } from '../component/context';
const Stack = createStackNavigator();

const SmartechStackNavigator = (props) => {

  const { navigation } = props;
  let eventEmitterSubscription;
  let eventAppinboxEmitterSubscription;

  useEffect(() => {

    console.log('in ussefect');
    //================= SMARTECH SDK IMPLEMENTATION START ================= 

    // Adding the Smartech Deeplink Notification Listener
    SmartechAppInboxReact.addDeepLinkListener(SmartechAppInboxReact.SmartechAppInboxDeeplinkNotification, handleDeeplinkWithPayload, (eventAppinboxEmitterSubscription) => {
      eventAppinboxEmitterSubscription = eventAppinboxEmitterSubscription;
    });
    
    // Adding the Smartech Deeplink Notification Listener
     SmartechPushReact.addDeepLinkListener(SmartechPushReact.SmartechDeeplinkNotification, handleDeeplinkWithPayload, (eventSubscriptionObject) => {
      eventEmitterSubscription = eventSubscriptionObject;
    });

    // Android callback to handle deeplink in terminated/background state.
    SmartechPushReact.getDeepLinkUrl(function (_response) {
      console.log('getDeepLinkUrl Initial Deeplink Response ', _response);
      props.updateDeeplink(_response.deeplink);
    });

    return function cleanup() {
      eventEmitterSubscription.remove()
      eventAppinboxEmitterSubscription.remove()
      // Removing the Smartech Deeplink Notification Listener
      //SmartechPushReact.removeListener(SmartechPushReact.SmartechDeeplinkNotification, handleDeeplinkWithPayload);
    };
  }, []);

  // Handling the SDK Deeplink Callback.
  const handleDeeplinkWithPayload = (smartechData) => {
    console.log('Deeplink and Payload At JS App Level: ' + JSON.stringify(smartechData));
    props.updateDeeplink(smartechData.deeplink);
  };

  //================= SMARTECH SDK IMPLEMENTATION END ================= 


  const getHeaderTitle = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

    switch (routeName) {
      case 'Event':
        return 'Event';
      case 'Notification':
        return 'Notification';
      case 'InApp':
        return 'InApp';
      case 'Settings':
        return 'Settings';
      default:
        return 'Event'
    }
  }

  useEffect(() => {

    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 10);
  }, []);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const Authenticated = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabNavigator"
          component={HomeTabNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="CustomEvents"
          component={CustomEvents}
          options={{ title: 'CustomEvents' }}
        />
         <Stack.Screen
          name="AppInbox"
          component={AppInbox}
          options={{ title: 'AppInbox' }}
        />
      </Stack.Navigator>
    )
  }

  const NonAuthenticated = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
      </Stack.Navigator>
    )
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.name,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (username) => {
      let userToken = null;
      if (username != null) {
        userToken = 'abc';
      } else {
        userToken = null;
      }

      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }
      //console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', name: username, token: userToken });
    },
    
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
    }
  }), []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <Authenticated />
        ) : (
            <NonAuthenticated />
          )}
      </NavigationContainer>
    </AuthContext.Provider>

  );
}

const mapStateToProps = (state) => {
  const { deeplinkReducer } = state;
  return { deeplinkReducer };
};

const mapDispatchToProps = dispatchValue =>
  bindActionCreators(
    {
      updateDeeplink,
    },
    dispatchValue,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SmartechStackNavigator);
