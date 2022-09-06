import React from 'react';

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const AlbumArt = ({
  url,
  onPress
}) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[styles.image, {
            elevation: 10, shadowColor: '#d9d9d9',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 2,
            borderRadius: 20,
            backgroundColor: '#ffffff'
          }]}
        >
          <Image
            style={[styles.image, { borderRadius: 20 }]}
            source={{ uri: url }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

export default AlbumArt;

const imageSize = 100;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 30,
    paddingLeft: 24,
    paddingRight: 24,
  },
  image: {
    width: imageSize,
    height: imageSize,
  },
})