import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-paper';

const Smartech = require('smartech-base-react-native');

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    textinput: {
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        marginLeft: 10,
        paddingLeft: 5,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 5,
    },
    submitButton: {
        borderRadius: 5,
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    }
});

const CustomEvents = () => {

    const [customEvent, setCustomEvent] = React.useState({
        eventName: "",
        eventPayload: "",
    })

    const onEventNameChange = (value) => {
        setCustomEvent({
            ...customEvent,
            eventName: value,
        })
    }

    const onEventPayloadChange = (value) => {
        setCustomEvent({
            ...customEvent,
            eventPayload: value
        })
    }

    const onProfileSubmit = () => {
        try {
            Smartech.trackEvent(customEvent.eventName, JSON.parse(customEvent.eventPayload));
        } catch(e) {
            alert(e);
        }
     }

    return (
        <View style={styles.parentContainer}>
            <TextInput placeholder="First Name" placeholderColor="#c4c3cb" style={styles.textinput} onChangeText={(val) => onEventNameChange(val)} />
            <TextInput multiline={true} numberOfLines={7} placeholder="Payload" placeholderColor="#c4c3cb" style={styles.textinput} onChangeText={(val) => onEventPayloadChange(val)} />
            <View style={styles.submitButton}>
                <Button
                    onPress={() => onProfileSubmit()}
                    title="Submit"
                    color="#3897f1"
                />
            </View>
        </View>

    )
};

export default CustomEvents;
