import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Switch, requireNativeComponent } from 'react-native';
import { AuthContext } from '../component/context';
import AsyncStorage from '@react-native-community/async-storage';
const SmartechReact = require('smartech-base-react-native');
const SmartechPushReact = require('smartech-push-react-native');

var RNAppInbox = requireNativeComponent('SmartAppInboxView');

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    viewHeader: {
        marginTop: 10,
        marginLeft: 14,
    },
    viewSubHeader: {
        marginTop: 5,
        height: 30,
        marginLeft: 14,
    },
    viewDivider: {
        height: 1,
        width: "100%",
        marginTop: 10,
        backgroundColor: "#CED0CE",
        marginLeft: '1%',
    },
    viewSubDivider: {
        height: 1,
        width: "100%",
        borderColor: 'red',
        marginTop: 10,
    },
    viewSwitchContainer: {
        flexDirection: "row", width: "100%", height: 40, justifyContent: 'space-between', marginTop: 10
    },
    txtSwitch: {
        fontSize: 17, textAlign: "center", height: "100%", marginLeft: 13, textAlignVertical: 'center'
    },
    txtTitle: {
        fontSize: 17, textAlign: "left", textAlignVertical: 'center'
    },

});


const Settings = ({ navigation }) => {

    const { signOut } = React.useContext(AuthContext);

    const [isPNEnabled, setIsPNEnabled] = useState(true);
    const [isInAppEnabled, setIsInAppEnabled] = useState(true);
    const [isEventTrackingEnabled, setIsEventTrackingEnabled] = useState(true);
    const [isShowAppInbox, setIsShowAppInbox] = useState(false);
   

    useEffect(() => {
        console.log('settings........');
    
        _retrieveData();
      }, []);

    
    const _retrieveData = async () => {
        try {
          const inAppValue = await AsyncStorage.getItem('inAppTracking');
          const pnValue = await AsyncStorage.getItem('pnTracking');
          const eventValue = await AsyncStorage.getItem('eventTracking');
          console.log("stored values: "+ inAppValue + "  "+pnValue+"  "+eventValue);
          if (inAppValue !== null) {
            setIsInAppEnabled(inAppValue === "true" ? true : false)
          }
          if (pnValue !== null) {
            setIsPNEnabled(pnValue  === "true" ? true : false)
          }
          if (eventValue !== null) {
            setIsEventTrackingEnabled(eventValue  === "true" ? true : false)
          }

        } catch (error) {
          // Error retrieving data
        }
      };

    const toggleOptoutPN = (e) => {
        console.log("toogle pn " + e);
        setIsPNEnabled(e);
        SmartechPushReact.optPushNotification(e);
        AsyncStorage.setItem('pnTracking', JSON.stringify(e));
    }

    const toggleOptInAppMessages = (e) => {
        console.log("toogle InApp " + e);
        setIsInAppEnabled(e);
        SmartechReact.optInAppMessage(e);
        try {
            AsyncStorage.setItem('inAppTracking', JSON.stringify(e));
        } catch (e) {
            console.log(e);
        }
    }

    const toggleOptEventTracking = (e) => {
        console.log("Event  tracking " + e);
        setIsEventTrackingEnabled(e);
        SmartechReact.optTracking(e);

        try {
            AsyncStorage.setItem('eventTracking', JSON.stringify(e));
        } catch (e) {
            console.log(e);
        }
    }

    const onPressButton = () => {
        alert("clicked");
    }

    const openProfile = () => {
        navigation.navigate('Profile');
    }

    const openCustomEvents = () => {
        SmartechReact.setUserIdentity("",(error, result) => {
            console.log(error,result);
        })

        SmartechReact.getUserIdentity((error, result) => {
            console.log(error,result);
        })

        navigation.navigate('CustomEvents');
    }

    const onLogout = () => {
        SmartechReact.logoutAndClearUserIdentity(false);
        signOut();
    }

    const onLogoutandClearIdentity = () => {
        SmartechReact.logoutAndClearUserIdentity(true);
        signOut();
    }
    

    const onNavigateInDefaultAppBox = () => {
        //setIsShowAppInbox(true)
    }

    const onNavigateInCustomAppBox = () => {
        navigation.navigate('AppInbox');
    }

    return  !isShowAppInbox ? (
         
        <View style={styles.container}>
            <View style={styles.viewHeader}>
                <Text style={{ fontSize: 17 }} >General Settings</Text>
            </View>
            <View style={styles.viewDivider} />


            <TouchableOpacity onPress={onLogout}>
                <View style={styles.viewSubHeader}>
                    <Text style={styles.txtTitle} >Logout</Text>
                </View>
                <View style={styles.viewSubDivider} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onLogoutandClearIdentity}>
                <View style={styles.viewSubHeader}>
                    <Text style={styles.txtTitle} >Logout and Clear Identity</Text>
                </View>
                <View style={styles.viewSubDivider} />
            </TouchableOpacity>

            <TouchableOpacity onPress={openProfile}>
                <View style={styles.viewSubHeader}>
                    <Text style={styles.txtTitle} >Update My Profile</Text>
                </View>
                <View style={styles.viewSubDivider} />
            </TouchableOpacity>

            <TouchableOpacity onPress={openCustomEvents}>
                <View style={styles.viewSubHeader}>
                    <Text style={styles.txtTitle} >Custom Events</Text>
                </View>
                <View style={styles.viewSubDivider} />
            </TouchableOpacity>

            <View style={styles.viewHeader}>
                <Text style={{ fontSize: 17 }} >GDPR Settings</Text>
            </View>
            <View style={styles.viewDivider} />


            <View style={styles.viewSwitchContainer} >
                <Text style={styles.txtSwitch} >Opt PushNotifications</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isPNEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleOptoutPN}
                    value={isPNEnabled}
                    style={{ marginRight: 10 }}
                />
            </View>

            <View style={styles.viewSwitchContainer} >
                <Text style={styles.txtSwitch} >Opt InApp messages</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isInAppEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleOptInAppMessages}
                    value={isInAppEnabled}
                    style={{ marginRight: 10 }}
                />
            </View>

            <View style={styles.viewSwitchContainer} >
                <Text style={styles.txtSwitch} >Opt Event tracking</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEventTrackingEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleOptEventTracking}
                    value={isEventTrackingEnabled}
                    style={{ marginRight: 10 }}
                />
            </View>

            <TouchableOpacity onPress={onNavigateInCustomAppBox}>
                <View style={styles.viewSubHeader}>
                    <Text style={styles.txtTitle} >Custom AppInBox</Text>
                </View>
                <View style={styles.viewSubDivider} />
            </TouchableOpacity>

        </View> )
            :
                <RNAppInbox  style = {{flex:1, width:"100%", height:'100%'}}/>
            }

export default Settings;