import React, {useEffect} from 'react';
import {Linking} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import Smartech from 'smartech-base-react-native';

import Event from '../screen/event';
import Notification from '../screen/notification';
import InApp from '../screen/inapp';
import Settings from '../screen/settings';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateDeeplink} from '../component/DeeplinkAction';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = (props) => {

  const { navigation } = props;

  const value = props.deeplinkReducer.deeplink;

  const navigateToURL = (deeplink) => {
    if (deeplink) {
        console.log('Deeplink == Home Tab', deeplink);
        if (deeplink.indexOf('profile') > -1) {
          navigation.navigate('Profile');
        }
        else if (deeplink.indexOf('customevents') > -1) {
          console.log("internal");
          navigation.navigate('CustomEvents');
        }
        else {
          Linking.canOpenURL(deeplink).then(supported => {
            if (supported) {
              Linking.openURL(deeplink);
            } else {
             console.log("Don't know how to handle this uri: " + deeplink);
            }
         });
        }
    }
};

  useEffect(() => {
    setTimeout(async () => {
      navigateToURL(value);
    }, 10);
    
  }, [value]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Event"
        component={Event}
        options={{ tabBarLabel: 'Event', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="event" color={color} size={size} />) }} />
      <Tab.Screen name="Notification" component={Notification} options={{ tabBarLabel: 'PNNotification', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="notifications" color={color} size={size} />) }} />
      <Tab.Screen name="InApp" component={InApp} options={{ tabBarLabel: 'InApp', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="web-asset" color={color} size={size} />) }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarLabel: 'Settings', tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="settings" color={color} size={size} />) }} />
    </Tab.Navigator>
  );
}

const mapStateToProps = (state) => {
  const {deeplinkReducer} = state;
  return {deeplinkReducer};
};

const mapDispatchToProps = dispatchValue =>
  bindActionCreators(
    {
      updateDeeplink,
    },
    dispatchValue,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabNavigator);