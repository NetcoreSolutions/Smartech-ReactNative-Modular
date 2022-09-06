import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const Controls = ({
  paused,
  onPressPlay,
  onPressPause,
  onPressMute,
  muted
}) => (
    <View style={styles.container}>
      {console.log('muted',muted)}
      <Text>{muted}</Text>
      <View style={{alignItems:'center', flexDirection:'row', width:'90%', alignSelf:'center'}}>
            <TouchableOpacity style={{}} onPress={onPressMute}>
                {
                    muted? 
                    <Image style={{height: 25, width: 25}} source={require('../../../assets/images/speaker_mute.png')} /> :
                    <Image style={{height: 25, width: 25}} source={require('../../../assets/images/speaker.png')} />
                }
                
            </TouchableOpacity>
        
        {!paused ?
            <TouchableOpacity style={{marginLeft: 15}} onPress={onPressPause}>
                <View style={styles.playButton}>
                    <Image style={{ height: 35, width: 35 }} source={require('../../../assets/images/pause.png')} />
                </View>
            </TouchableOpacity> :
            <TouchableOpacity style={{marginLeft: 15}} onPress={onPressPlay}>
                <View style={styles.playButton}>
                    <Image style={{height: 35, width: 35}} source={require('../../../assets/images/play.png')} />
                </View>
            </TouchableOpacity>
        }
      </View>
    </View>
  );

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  playButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  }
})