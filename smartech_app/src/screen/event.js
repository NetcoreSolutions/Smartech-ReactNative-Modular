import React, { useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import eventData from '../assets/events.json';

import Smartech from 'smartech-base-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

renderSeparator = () => {
    return (
        <View
            style={{
                height: 1,
                width: '100%',
                backgroundColor: '#CED0CE',
                marginLeft: '1%',
            }}
        />
    );
};

const Event = (props) => {
    const { navigation } = props;

    const events = eventData.filter((x) => x.section === 'Events');

    const actionOnRow = (item) => {
        Smartech.trackEvent(item.name, JSON.parse(JSON.stringify(item.payload)));
    };

    return (
        <View style={styles.container}>
            <FlatList
                ItemSeparatorComponent={renderSeparator}
                data={events}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => actionOnRow(item)}>
                        <View>
                            <Text style={styles.item}>{item.name}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
        </View>
    );
};

export default Event;
