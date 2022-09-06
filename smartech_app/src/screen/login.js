import React from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, Button, Keyboard, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';

import { AuthContext } from '../component/context';

const SmartechReact = require('smartech-base-react-native');
const SmartechPushReact = require('smartech-push-react-native');

const Login = ({ navigation }) => {

    const { signIn } = React.useContext(AuthContext);

    const [data, setData] = React.useState({
        username: '',
    });

    const loginHandle = (userName) => {
        console.log("data: " + data.username);
        signIn(userName);
    };

    const textInputChange = (val) => {
        setData({
            ...data,
            username: val,
        });
    };

    const onLoginPress = () => {
        // Alert, Badge, Sound
        SmartechPushReact.registerForPushNotificationWithAuthorizationOptions(true, true, true)
        loginHandle(data.username);
        SmartechReact.login(data.username);
        console.log("data is " + data.username);
    }

    const showAllMethods = () => {    
        SmartechReact.getAppId((error, appId) => {
            console.log('App Id = ', appId);
            console.log('App Id Error = ', error);
         });
         SmartechPushReact.getDevicePushToken((error, devicePushToken) => {
            console.log('Device Push Token = ', devicePushToken);
            console.log('Device Push Token Error = ', error);
        });
        SmartechReact.getDeviceGuid((error, deviceGuid) => {
            console.log('Device Guid = ', deviceGuid);
            console.log('Device Guid Error = ', error);
        });
        SmartechReact.getSDKVersion((error, sdkVersion) => {
            console.log('SDK Version = ', sdkVersion);
            console.log('SDK Version Error = ', error);
        });
        
    }


    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText={(val) => textInputChange(val)} />
                        <View style={styles.loginButton}>
                            <Button
                                onPress={() => onLoginPress(data.username)}
                                title="Login"
                                color="#3897f1"
                            />
                        </View>
                        <View style={styles.loginButton}>
                            <Button
                                onPress={() => showAllMethods()}
                                title="Print All Get Methods"
                                color="#3897f1"
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    loginScreenContainer: {
        flex: 1,
    },
    loginFormView: {
        flex: 1
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 100,
        marginBottom: 5,
    },
    loginButton: {
        borderRadius: 5,
        height: 45,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        marginBottom: 5
    }
})

export default Login;