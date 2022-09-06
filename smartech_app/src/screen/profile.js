import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
const Smartech = require('smartech-base-react-native');

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    childContainer: {
        flexDirection: 'column',
        flex: 1,
        marginTop: 30,
    },
    profileTextInput: {
        height: 50,
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

const Profile = () => {

    const [profileData, setProfileData] = React.useState({
        firstName: "",
        lastName: "",
        age: 0,
        country: "",
        state: "",
        city: "",
        pincode: "",
    });

    const onSubmit = () => {
        

        const date =
        {
            FIRST_NAME: profileData.firstname,
            LAST_NAME: profileData.lastname,
            AGE: profileData.age,
            COUNTRY: profileData.country,
            STATE: profileData.state,
            CITY: profileData.city,
            PINCODE: profileData.pincode
        };

        Smartech.updateUserProfile(date, function (response) {
            alert("response" + response);
        
          }, function (error) {
          });
    }

    const onFirstNameChange = (value) => {
        setProfileData({
            ...profileData,
            firstName: value,
        })
    }

    const onLastNameChange = (value) => {
        setProfileData({
            ...profileData,
            lastName: value,
        })
    }

    const onAgeChange = (value) => {
        setProfileData({
            ...profileData,
            age: value,
        })
    }

    const onCountryChange = (value) => {
        setProfileData({
            ...profileData,
            country: value,
        })
    }

    const onStateChange = (value) => {
        setProfileData({
            ...profileData,
            state: value,
        })
    }

    const onCityChange = (value) => {
        setProfileData({
            ...profileData,
            city: value,
        })
    }

    const onPinCodeChange = (value) => {
        setProfileData({
            ...profileData,
            pincode: value,
        })
    }

    return (
        <View style={styles.parentContainer}>
            <View style={styles.childContainer}>
                <TextInput placeholder="First Name" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onFirstNameChange(val)} />
                <TextInput placeholder="Last Name" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onLastNameChange(val)} />
                <TextInput placeholder="Age" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onAgeChange(val)} />
                <TextInput placeholder="Country" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onCountryChange(val)} />
                <TextInput placeholder="State" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onStateChange(val)} />
                <TextInput placeholder="City" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onCityChange(val)} />
                <TextInput placeholder="Pincode" placeholderColor="#c4c3cb" style={styles.profileTextInput} onChangeText={(val) => onPinCodeChange(val)} />

                <View style={styles.submitButton}>
                    <Button
                        onPress={() => onSubmit()}
                        title="Submit"
                        color="#3897f1"
                    />
                </View>
            </View>


        </View>
    )
}

export default Profile;